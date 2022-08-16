import React, { useState, useCallback } from 'react'
import { useLocation, useHistory } from 'react-router'
import Page from 'components/Layout/Page'
import {
  Box,
  Button,
  Flex,
  InfoIcon,
  Text,
  Skeleton,
  useTooltip,
  useMatchBreakpoints,
  AutoRenewIcon,
  ButtonMenu as UiKitButtonMenu,
  ButtonMenuItem as UiKitButtonMenuItem,
} from 'husky-uikit'
import styled from 'styled-components'
import { TokenImage } from 'components/TokenImage'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { getAddress } from 'utils/addressHelpers'
import { getBalanceAmount, getDecimalAmount } from 'utils/formatBalance'
import { getPoolApr } from 'utils/apr'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { useTranslation } from 'contexts/Localization'
import { useVault, useERC20 } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCakePrice, useFarmMasterChefData, useFarmTokensLpData, useFarmPancakeLpData, useHuskiPrice } from 'state/leverage/hooks'
import { usePoolVaultData, usePoolFairLaunchData } from 'state/pool/hooks'
import { usePriceList, useTokenPriceList } from 'utils/api'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import NumberInput from 'components/NumberInput'
import HighchartsReact from 'highcharts-react-official'
import HighStock from 'highcharts/highstock'
import useTheme from 'hooks/useTheme'
import { useWeb3React } from '@web3-react/core'
import SingleFarmSelect, { SingleFarmSelectToken } from 'components/Select/SingleFarmSelect'
import { getHuskyRewards, getYieldFarming, getLeverageFarmingData, getRunLogic, getRunLogic1 } from '../helpers'
import { useTradeFeesFromPid } from '../../../state/graph/hooks'
import TimeChart from './components/TimeChart'
import PriceChart from './components/PriceChart'

interface LocationParams {
  singleData?: any
  marketStrategy?: string
}

const Section = styled(Box)`
  background-color: ${({ theme }) => theme.card.background};
  border-radius: 12px;
  padding: 10px 10px 0;
  .textArea {
    margin: 10px -10px 0;
    > ${Flex} {
      padding: 10px 10px;
      border-bottom: ${({ theme }) => (theme.isDark ? '1px solid #272B30' : '1px solid #EFEFEF')};
    }
  }
  ${({ theme }) => theme.mediaQueries.xxl} {
    padding: 15px 15px 5px;
    .textArea {
      margin: 15px -15px 0;
      > ${Flex} {
        padding: 18px 15px 10px;
        border-bottom: ${({ theme }) => (theme.isDark ? '1px solid #272B30' : '1px solid #EFEFEF')};
      }
    }
  }
  input[type='range'] {
    -webkit-appearance: auto;
  }
`
const SectionWrapper = styled(Flex)`
  max-width: 100%;
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    justify-content: space-between;
  }
  > ${Flex} {
    flex-direction: column;
    &.graphSide {
      width: 100%;
      gap: 1rem;
      ${({ theme }) => theme.mediaQueries.md} {
        flex: 0 0 calc(100% * 2 / 3 - 1rem);
        width: calc(100% / 3);
      }
    }
    &.infoSide {
      width: 100%;
      ${({ theme }) => theme.mediaQueries.md} {
        flex: 0 0 calc(100% / 3);
        width: calc(100% / 3);
      }
    }
  }
`

const InputArea = styled(Flex)`
  background-color: ${({ theme }) => (theme.isDark ? '#111315' : '#F7F7F8')};
  border-radius: 12px;
  height: 37px;
  ${({ theme }) => theme.mediaQueries.xxl} {
    height: 60px;
  }
  padding: 0 14px;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  input {
    padding: 0;
    font-size: 14px;
    background: unset;
    border: none;
    box-shadow: none;
    width: 80%;
    &:focus:not(:disabled) {
      box-shadow: none;
    }
  }
`

const ButtonMenu = styled(UiKitButtonMenu)`
  border-radius: 6px;
  width: 100%;
  height: 25px;
  padding: 3px 4px;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.xxl} {
    height: 40px;
    border-radius: 12px;
  }
`

const ButtonMenuItem = styled(UiKitButtonMenuItem)`
  font-weight: 600;
  font-size: 10px;
  border-radius: 6px;
  height: 100%;
  ${({ theme }) => theme.mediaQueries.xxl} {
    font-size: 12px;
    border-radius: 12px;
  }
  padding: 0;
  color: ${({ isActive }) => (isActive ? '#FF6A55' : '#6F767E')};
  box-shadow: ${({ isActive }) =>
    isActive
      ? '0px 4px 8px -4px rgba(0, 0, 0, 0.25), inset 0px -1px 1px rgba(0, 0, 0, 0.04), inset 0px 2px 0px rgba(255, 255, 255, 0.25);'
      : 'none'};
`

const StyledPage = styled(Page)`
  max-width: 1440px;
`

function areEqual(prevProps, nextProps) {
  // dont re-render if the data is the same
  /* Basically, this function is shouldComponentUpdate, except you return true if you want it to not render. */
  // https://stackoverflow.com/questions/54946933/how-can-i-prevent-my-functional-component-from-re-rendering-with-react-memo-or-r
  return prevProps.options.series[0].data === nextProps.options.series[0].data
}

const HighchartsReactWrapper: React.FC<{ options: Record<string, any> }> = React.memo((props) => {
  const chartComponent = React.useRef(null)
  React.useEffect(() => {
    const { chart } = chartComponent.current
    // console.log(' chartComponent', chartComponent)
    // console.log(' chart', chart)
    chart.update(props.options, true, true, true)
    // console.log('render triggerred', props)
  }, [props.options, props])

  return (
    <HighchartsReact highcharts={HighStock} options={props.options} constructorType="stockChart" ref={chartComponent} />
  )
}, areEqual)

const BaseTokenOnly = () => {
  const { t } = useTranslation()
  const { isMobile, isTablet, isXl } = useMatchBreakpoints()
  const isTabletExtended = isTablet || isXl
  const isSmallScreen = isMobile || isTabletExtended
  const { account } = useWeb3React()

  const {
    state: { singleData: data, marketStrategy: selectedStrategy },
  } = useLocation<LocationParams>()
  const history = useHistory()

  const singleFarm = data
  // const coingeckoId = singleFarm?.token?.coingeckoId
  // const quoteTokenCoingeckoId = singleFarm?.quoteToken?.coingeckoId

  let coingeckoId
  let quoteTokenCoingeckoId
  if (singleFarm?.quoteToken?.symbol === 'CAKE' && singleFarm?.singleFlag === 0) {
    coingeckoId = singleFarm?.quoteToken?.coingeckoId
    quoteTokenCoingeckoId = singleFarm?.token?.coingeckoId
  } else {
    coingeckoId = singleFarm?.token?.coingeckoId
    quoteTokenCoingeckoId = singleFarm?.quoteToken?.coingeckoId
  }

  const { isDark } = useTheme()
  const { priceList: basetokenPriceList, dateList } = usePriceList(coingeckoId)
  const { priceList: quoteTokenPriceList } = usePriceList(quoteTokenCoingeckoId)

  const getSingleLeverage = (selStrategy: string): number => {
    if (selStrategy.toLowerCase() === 'bull3x' || selStrategy.toLowerCase() === 'bear') {
      return 3
    }
    return 2
  }
  const tokenPriceList = useTokenPriceList(coingeckoId)
  const [marketStrategy, setMarketStrategy] = useState<string>(selectedStrategy)
  const singleLeverage: number = getSingleLeverage(marketStrategy)

  let tokenName
  let quoteTokenName
  let riskKillThreshold

  // const getDefaultTokenInfo = (selStrat: string): string => {
  //   if (selStrat.includes('bull')) {
  //     return 'QuoteTokenInfo'
  //   }
  //   // && singleFarm?.quoteToken?.symbol !== 'CAKE'

  //   return 'TokenInfo'
  // }
  // const tokenInfoToUse = getDefaultTokenInfo(marketStrategy)
  // const [selectedToken, setSelectedToken] = useState(singleFarm?.[tokenInfoToUse]?.token)
  const [selectedToken, setSelectedToken] = useState(singleFarm?.token)

  if (marketStrategy.includes('bull')) {
    // bull === 2x long
    if (singleFarm?.quoteToken?.symbol === 'CAKE' && singleFarm?.singleFlag === 0) {
      tokenName = singleFarm?.token?.symbol.toUpperCase().replace('WBNB', 'BNB')
      quoteTokenName = singleFarm?.quoteToken?.symbol.toUpperCase().replace('WBNB', 'BNB')
      riskKillThreshold = singleFarm?.liquidationThreshold
    } else {
      tokenName = singleFarm?.QuoteTokenInfo?.token?.symbol.toUpperCase().replace('WBNB', 'BNB')
      quoteTokenName = singleFarm?.QuoteTokenInfo?.quoteToken?.symbol.toUpperCase().replace('WBNB', 'BNB')
      riskKillThreshold = singleFarm?.quoteTokenLiquidationThreshold
    }
  } else {
    // 2x short || 3x short
    tokenName = singleFarm?.token?.symbol.toUpperCase().replace('WBNB', 'BNB')
    quoteTokenName = singleFarm?.quoteToken?.symbol.toUpperCase().replace('WBNB', 'BNB')
    riskKillThreshold = singleFarm?.liquidationThreshold
  }

  // for chart logic params
  const Token0Name = singleFarm?.token?.symbol.toUpperCase().replace('WBNB', 'BNB')
  const Token1Name = singleFarm?.quoteToken?.symbol.toUpperCase().replace('WBNB', 'BNB')

  // const { allowance: tokenUserTokenAllowances } = useTokenAllowance(
  //   getAddress(singleFarm?.token?.address),
  //   singleFarm?.vaultAddress,
  // )
  // const { allowance: quoteTokenUserTokenAllowances } = useTokenAllowance(
  //   getAddress(singleFarm?.quoteToken?.address),
  //   singleFarm?.vaultAddress,
  // )
  // const { allowance: tokenUserQuoteTokenAllowances } = useTokenAllowance(
  //   getAddress(singleFarm?.token?.address),
  //   singleFarm?.QuoteTokenInfo?.vaultAddress,
  // )
  // const { allowance: quoteTokenUserQuoteTokenAllowances } = useTokenAllowance(
  //   getAddress(singleFarm?.QuoteTokenInfo?.token?.address),
  //   singleFarm?.vaultAddress,
  // ) 

  // let allowance = '0'
  const [isApproved, setIsApproved] = useState<boolean>(false)
  if (Number(singleFarm.userData.tokenAllowance) > 0 && Number(singleFarm.userData.quoteTokenAllowance) > 0) {
    setIsApproved(true)
  }

  // if (marketStrategy.includes('bull')) {
  //   if (selectedToken.symbol.toUpperCase().replace('WBNB', 'BNB') === tokenName) {
  //     allowance =
  //       Number(singleFarm?.userData?.quoteTokenUserQuoteTokenAllowances) > 0
  //         ? singleFarm?.userData?.quoteTokenUserQuoteTokenAllowances
  //         : quoteTokenUserQuoteTokenAllowances.toString()
  //     // console.info('quotetoken quotetoken')
  //   } else {
  //     allowance =
  //       Number(singleFarm?.userData?.tokenUserQuoteTokenAllowances) > 0
  //         ? singleFarm?.userData?.tokenUserQuoteTokenAllowances
  //         : tokenUserQuoteTokenAllowances.toString()
  //     // console.info('quotetoken token')
  //     // contract = quoteTokenApproveContract
  //     // approveAddress = quoteTokenVaultAddress
  //     if (selectedToken?.symbol === 'wBNB') {
  //       allowance = '1'
  //     }
  //   }
  // } else if (!marketStrategy.includes('bull')) {
  //   if (selectedToken?.symbol.toUpperCase().replace('WBNB', 'BNB') === tokenName) {
  //     // contract = quoteTokenApproveContract
  //     // approveAddress = vaultAddress
  //     allowance =
  //       Number(singleFarm?.userData?.tokenUserTokenAllowances) > 0
  //         ? singleFarm?.userData?.tokenUserTokenAllowances
  //         : tokenUserTokenAllowances.toString()
  //     // console.info('token token')
  //   } else {
  //     // console.info('token quotetoken')
  //     allowance =
  //       Number(singleFarm?.userData?.quoteTokenUserTokenAllowances) > 0
  //         ? singleFarm?.userData?.quoteTokenUserTokenAllowances
  //         : quoteTokenUserTokenAllowances.toString()
  //     // contract = approveContract
  //     // approveAddress = vaultAddress
  //   }
  // }

  // useEffect(() => {
  //   setIsApproved(Number(allowance) > 0)
  // }, [allowance])

  const getWrapText = (): string => {
    if (
      singleFarm?.lpSymbol.toUpperCase().includes('BNB') &&
      marketStrategy.includes('bull') &&
      selectedToken?.symbol.toUpperCase().replace('WBNB', 'BNB') !== tokenName
    ) {
      return t(`Wrap BNB & ${singleLeverage}x Farm`)
    }
    return t(`${singleLeverage}x Farm`)
  }

  const { toastError, toastSuccess, toastInfo, toastWarning } = useToast()
  const [isPending, setIsPending] = useState(false)

  const { balance: bnbBalance } = useGetBnbBalance()
  const { balance: tokenBalance } = useTokenBalance(getAddress(selectedToken?.address))
  const userTokenBalance = getBalanceAmount(selectedToken.symbol.toLowerCase() === 'wbnb' ? bnbBalance : tokenBalance)

  const [inputValue, setInputValue] = useState<string>()
  const [buttonIndex, setButtonIndex] = useState(null)
  const handleInput = useCallback((event) => {
    // check if input is a number and includes decimals
    if (event.target.value.match(/^\d*\.?\d*$/) || event.target.value === '') {
      const input = event.target.value
      // const finalValue = new BigNumber(input).gt(userTokenBalance) ? userTokenBalance.toString() : input
      const finalValue = input
      setInputValue(finalValue)
    } else {
      event.preventDefault()
    }
    setButtonIndex(null)
  }, [])
  const setInputToFraction = (index) => {
    if (index === 0) {
      setInputValue(userTokenBalance.times(0.25).toString())
      setButtonIndex(index)
    } else if (index === 1) {
      setInputValue(userTokenBalance.times(0.5).toString())
      setButtonIndex(index)
    } else if (index === 2) {
      setInputValue(userTokenBalance.times(0.75).toString())
      setButtonIndex(index)
    } else if (index === 3) {
      setInputValue(userTokenBalance.toString())
      setButtonIndex(index)
    }
  }

  const vaultAddress = getAddress(singleFarm?.pool.address)
  const tokenAddress = getAddress(singleFarm?.token?.address)
  const quoteTokenAddress = getAddress(singleFarm?.quoteToken?.address)
  const approveContract = useERC20(tokenAddress)
  const quoteTokenApproveContract = useERC20(quoteTokenAddress)
  const vaultContract = useVault(vaultAddress)
  // const quoteTokenVaultAddress = singleFarm?.QuoteTokenInfo?.vaultAddress
  // const quoteTokenVaultContract = useVault(quoteTokenVaultAddress)

  const { callWithGasPrice } = useCallWithGasPrice()
  const { vaultDebtVal, interestRatePerYear } = usePoolVaultData(singleFarm.pool.pid)
  const { debtPoolRewardPerBlock } = usePoolFairLaunchData(singleFarm.pool.pid)
  const { totalSupply } = useFarmPancakeLpData(singleFarm.pid, singleFarm.pool.pid)
  const { tokenAmountTotal, quoteTokenAmountTotal, lpTotalInQuoteToken } = useFarmTokensLpData(singleFarm.pid, singleFarm.pool.pid)
  const { poolWeight } = useFarmMasterChefData(singleFarm.pid, singleFarm.pool.pid)

  const [isApproving, setIsApproving] = useState<boolean>(false)

  const handleApprove = async () => {
    let contract
    let approveAddress
    // if (marketStrategy.includes('bull')) {
    //   if (selectedToken.symbol.toUpperCase().replace('WBNB', 'BNB') === tokenName) {
    //     contract = quoteTokenApproveContract
    //     approveAddress = quoteTokenVaultAddress
    //   } else {
    //     contract = approveContract
    //     approveAddress = quoteTokenVaultAddress
    //   }
    // } else if (!marketStrategy.includes('bull')) {
      if (selectedToken.symbol.toUpperCase().replace('WBNB', 'BNB') === tokenName) {
        contract = approveContract
        approveAddress = vaultAddress
      } else {
        contract = quoteTokenApproveContract
        approveAddress = vaultAddress
      }
    // }

    setIsApproving(true)
    try {
      toastInfo(t('Approving...'), t('Please Wait!'))
      const tx = await contract.approve(approveAddress, ethers.constants.MaxUint256)
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Approved!'), t('Your request has been approved'))
        setIsApproved(true)
      } else {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      }
    } catch (error: any) {
      toastWarning(t('Error'), error.message)
    } finally {
      setIsApproving(false)
    }
  }

  const huskyPrice = useHuskiPrice() 
  const cakePrice = useCakePrice()
  const huskyRewards = getHuskyRewards(
    vaultDebtVal,
    debtPoolRewardPerBlock,
    singleFarm.tokenPriceUsd,
    huskyPrice)
  const yieldFarmData = getYieldFarming(
    singleFarm.quoteTokenPriceUsd,
    poolWeight,
    lpTotalInQuoteToken, new BigNumber(cakePrice))
  // const { interestRatePerYear } = useFarmsWithToken(singleFarm, tokenName)
  // const { interestRatePerYear } = usePoolVaultData(singleFarm.pool.pid)
  const { tradingFee: tradeFee } = useTradeFeesFromPid(singleFarm.pid)

  const getApr = (lvg: number) => {
    return getPoolApr(yieldFarmData, tradeFee, huskyRewards, interestRatePerYear, lvg)
  }
  const getApy = (lvg: number) => {
    const totalapr = getApr(lvg)
    if (totalapr === null) {
      return null
    }
    // eslint-disable-next-line no-restricted-properties
    const totalapy = Math.pow(1 + totalapr / 365, 365) - 1
    return totalapy * 100
  }

  let tokenInputValue
  let quoteTokenInputValue

  if (marketStrategy.includes('bull')) {
    // bull === 2x long
    if (selectedToken.symbol.toUpperCase().replace('WBNB', 'BNB') !== tokenName) {
      tokenInputValue = inputValue || 0
      quoteTokenInputValue = 0
    } else {
      tokenInputValue = 0
      quoteTokenInputValue = inputValue || 0
    }

    if (singleFarm?.quoteToken?.symbol === 'CAKE' && singleFarm?.singleFlag === 0) {
      if (selectedToken.symbol.toUpperCase().replace('WBNB', 'BNB') !== tokenName) {
        tokenInputValue = 0
        quoteTokenInputValue = inputValue || 0
      } else {
        tokenInputValue = inputValue || 0
        quoteTokenInputValue = 0
      }
    }
  } else {
    // eslint-disable-next-line no-lonely-if
    if (selectedToken.symbol.toUpperCase().replace('WBNB', 'BNB') !== tokenName) {
      tokenInputValue = 0
      quoteTokenInputValue = inputValue || 0
    } else {
      tokenInputValue = inputValue || 0
      quoteTokenInputValue = 0
    }
  }

  const farmingData = getLeverageFarmingData(
    singleFarm.token,
    totalSupply,
    tokenAmountTotal,
    quoteTokenAmountTotal,
    singleLeverage,
    tokenInputValue,
    quoteTokenInputValue,
    tokenName,
  )
  const farmData = farmingData ? farmingData[1] : []
  const apy = getApy(singleLeverage)

  const balanceBigNumber = new BigNumber(userTokenBalance)
  let balanceNumber
  if (balanceBigNumber.lt(1)) {
    balanceNumber = balanceBigNumber
      .toNumber()
      .toFixed(
        singleFarm.quoteToken?.decimalsDigits ? singleFarm.quoteToken?.decimalsDigits : 2,
      )
  } else {
    balanceNumber = balanceBigNumber.toNumber().toFixed(2)
  }

  // const bnbVaultAddress = getWbnbAddress()
  // const depositContract = useVault(bnbVaultAddress)
  const handleDeposit = async (bnbMsgValue, contract, id, workerAddress, amount, loan, maxReturn, dataWorker) => {
    // const callOptionsBNB = {
    //   gasLimit: 380000,
    //   value: bnbMsgValue,
    // }
    setIsPending(true)
    try {
      toastInfo(t('Transaction Pending...'), t('Please Wait!'))
      // const tx = await callWithGasPrice(depositContract, 'deposit', [bnbMsgValue], callOptionsBNB)

      const allowance1 = singleFarm?.userData?.tokenUserQuoteTokenAllowances
      if (Number(allowance1) === 0) {
        handleApproveBnb(contract, id, workerAddress, amount, loan, maxReturn, dataWorker)
      } else {
        handleFarm(contract, id, workerAddress, amount, loan, maxReturn, dataWorker)
      }

      // const receipt = await tx.wait()
      // if (receipt.status) {
      // toastSuccess(t('Successful!'), t('Your deposit was successfull'))
      // }
    } catch (error) {
      toastError(t('Unsuccessful'), t('Something went wrong your deposit request. Please try again...'))
    } finally {
      setIsPending(false)
    }
  }

  const handleApproveBnb = async (contract, id, workerAddress, amount, loan, maxReturn, dataWorker) => {
    toastInfo(t('Approving...'), t('Please Wait!'))
    setIsApproving(true)
    try {
      // const tx = await approveContract.approve(quoteTokenVaultAddress, ethers.constants.MaxUint256)
      handleFarm(contract, id, workerAddress, amount, loan, maxReturn, dataWorker)
      // const receipt = await tx.wait()
      // if (receipt.status) {
      //   toastSuccess(t('Approved!'), t('Your request has been approved'))

      // } else {
      //   toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      // }
    } catch (error: any) {
      toastWarning(t('Error'), error.message)
    } finally {
      setIsApproving(false)
    }
  }

  const handleFarm = async (contract, id, workerAddress, amount, loan, maxReturn, dataWorker) => {
    const callOptions = {
      gasLimit: 3800000,
    }
    const callOptionsBNB = {
      gasLimit: 3800000,
      value: amount,
    }

    setIsPending(true)
    try {
      toastInfo(t('Pending Request!'), t('Please Wait'))
      const tx = await callWithGasPrice(
        contract,
        'work',
        [id, workerAddress, amount, loan, maxReturn, dataWorker],
        tokenName === 'BNB' ? callOptionsBNB : callOptions,
      )
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Successful!'), t('Your farm was successfull'))
        history.push('/singleAssets')
      }
    } catch (error) {
      toastError('Unsuccessfulll', 'Something went wrong your farm request. Please try again...')
    } finally {
      setIsPending(false)
      setInputValue('')
      setButtonIndex(null)
    }
  }

  const handleConfirm = async () => {
    const id = 0
    const abiCoder = ethers.utils.defaultAbiCoder
    const AssetsBorrowed = farmData ? farmData[3] : 0
    const loan = getDecimalAmount(new BigNumber(AssetsBorrowed), 18)
      .toString()
      .replace(/\.(.*?\d*)/g, '')
    // getDecimalAmount(new BigNumber(AssetsBorrowed), 18).toString()
    const maxReturn = 0

    let farmingTokenAmount
    let strategiesAddress
    let dataStrategy
    let dataWorker
    // let contract
    // let amount
    // let workerAddress

    // if (marketStrategy.includes('bull')) {
    //   // bull === 2x long
    //   if (selectedToken.symbol.toUpperCase().replace('WBNB', 'BNB') === tokenName) {
    //     // token is farm token
    //     tokenInputValue = inputValue || 0
    //     quoteTokenInputValue = 0
    //     strategiesAddress = singleFarm?.QuoteTokenInfo.strategies.StrategyAddAllBaseToken
    //     dataStrategy = ethers.utils.defaultAbiCoder.encode(['uint256'], ['1'])
    //     dataWorker = ethers.utils.defaultAbiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
    //   } else {
    //     // console.info('!== tokenName')
    //     tokenInputValue = 0
    //     quoteTokenInputValue = inputValue || 0
    //     farmingTokenAmount = quoteTokenInputValue?.toString()
    //     strategiesAddress = singleFarm?.QuoteTokenInfo.strategies.StrategyAddTwoSidesOptimal
    //     dataStrategy = abiCoder.encode(['uint256', 'uint256'], [ethers.utils.parseEther(farmingTokenAmount), '1'])
    //     dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
    //   }

    //   contract = quoteTokenVaultContract
    //   amount = getDecimalAmount(new BigNumber(tokenInputValue || 0), 18)
    //     .toString()
    //     .replace(/\.(.*?\d*)/g, '')
    //   // getDecimalAmount(new BigNumber(tokenInputValue), 18).toString()
    //   workerAddress = singleFarm?.QuoteTokenInfo.address
    // } else {
      // 2x short || 3x short
      console.info('2x short || 3x short', selectedToken.symbol)
      if (selectedToken.symbol.toUpperCase().replace('WBNB', 'BNB') === tokenName) {
        console.info('===tokenname', tokenName)
        tokenInputValue = inputValue || 0
        quoteTokenInputValue = 0
        strategiesAddress = singleFarm?.strategies.StrategyAddAllBaseToken
        dataStrategy = ethers.utils.defaultAbiCoder.encode(['uint256'], ['1'])
        dataWorker = ethers.utils.defaultAbiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      } else {
        console.info('!!!==tokenname', tokenName)
        tokenInputValue = 0
        quoteTokenInputValue = inputValue || 0
        farmingTokenAmount = quoteTokenInputValue?.toString()
        strategiesAddress = singleFarm?.strategies.StrategyAddTwoSidesOptimal
        dataStrategy = abiCoder.encode(['uint256', 'uint256'], [ethers.utils.parseEther(farmingTokenAmount), '1'])
        dataWorker = ethers.utils.defaultAbiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      }
      const contract = vaultContract
      const amount = getDecimalAmount(new BigNumber(tokenInputValue || 0), 18)
        .toString()
        .replace(/\.(.*?\d*)/g, '')
      // getDecimalAmount(new BigNumber(tokenInputValue), 18).toString()
      const workerAddress = singleFarm?.address
    // }

    if (
      singleFarm?.lpSymbol.toUpperCase().includes('BNB') &&
      marketStrategy.includes('bull') &&
      selectedToken.symbol.toUpperCase().replace('WBNB', 'BNB') === 'BNB'
    ) {
      const bnbMsgValue = getDecimalAmount(new BigNumber(farmingTokenAmount || 0), 18)
        .toString()
        .replace(/\.(.*?\d*)/g, '')

      handleDeposit(bnbMsgValue, contract, id, workerAddress, amount, loan, maxReturn, dataWorker)
    } else {
      handleFarm(contract, id, workerAddress, amount, loan, maxReturn, dataWorker)
    }
  }
  const { profitLossRatioToken0, profitLossRatioToken1 } = getRunLogic1(
    basetokenPriceList,
    quoteTokenPriceList,
    riskKillThreshold,
    interestRatePerYear,
    getApr(1),
    singleLeverage,
    Token0Name,
    Token1Name,
    tokenName,
  )

  const { priceRiseFall, profitLossRatioSheet1Token0, profitLossRatioSheet1Token1 } = getRunLogic(
    riskKillThreshold,
    getApr(1),
    singleLeverage,
    Token0Name,
    Token1Name,
    tokenName,
  )

  // for charts data
  const xAxisdataTime = dateList
  const timeChartData1 = profitLossRatioToken0
  const timeChartData2 = profitLossRatioToken1
  const xAxisdataPrice = priceRiseFall
  const priceChartData1 = profitLossRatioSheet1Token0
  const priceChartData2 = profitLossRatioSheet1Token1

  const getStockChartOption = () => {
    const option = {
      chart: {
        backgroundColor: 'transparent',
        polar: true,
        type: 'line',
        color: 'white',
      },
      plotOptions: {
        series: {
          showInLegend: true,
        },
      },
      rangeSelector: {
        buttons: [
          {
            type: 'day',
            count: 7,
            text: '7d',
          },
          {
            type: 'month',
            count: 1,
            text: '30d',
          },
          {
            type: 'month',
            count: 3,
            text: '90d',
          },
          {
            type: 'month',
            count: 6,
            text: '180d',
          },
          {
            type: 'year',
            count: 1,
            text: '1y',
          },
          {
            type: 'all',
            text: 'Max',
          },
        ],
        enabled: true,
        allButtonsEnabled: true,
        // inputEnabled: false,
        selected: 2,
      },

      tooltip: {
        split: false,
        shared: true,
      },
      credits: {
        enabled: false,
      },
      scrollbar: {
        enabled: false,
      },
      yAxis: {
        gridLineColor: isDark ? '#ffe7eb1a' : '#0000001a',
        gitdLineWidth: 1,
      },
      series: [
        {
          // id: '000001',
          name: 'Price',
          data: tokenPriceList,
          tooltip: {
            valueDecimals: 2,
            pointFormat: '{series.name}: <b>&dollar;{point.y}</b><br/>',
          },
        },
      ],
      // not sure if react-highcharts support this
      // if yes, it will display a message if theres no data for the chart (for example, if data is taking too long to load)
      lang: {
        noData: 'Loading data, please wait',
      },
      noData: {
        style: {
          fontWeight: 'bold',
          fontSize: '15px',
          color: '#303030',
        },
      },
    }
    return option
  }

  const getSelectOptions = (): Array<{ icon: string; value: string; label: { name: string; value: string } }> => {
    if (selectedStrategy === 'neutral') {
      return [
        {
          icon: 'neutral',
          value: 'neutral',
          label: { name: 'Neutral Strategy', value: '2x' },
        },
        {
          icon: 'bear',
          value: 'bear',
          label: { name: 'Bear Strategy', value: '3x' },
        },
        {
          icon: 'bull',
          value: 'bull2x',
          label: { name: 'Bull Strategy', value: '2x' },
        },
        {
          icon: 'bull',
          value: 'bull3x',
          label: { name: 'Bull Strategy', value: '3x' },
        },
      ]
    }
    if (selectedStrategy === 'bear') {
      return [
        {
          icon: 'bear',
          value: 'bear',
          label: { name: 'Bear Strategy', value: '3x' },
        },
        {
          icon: 'bull',
          value: 'bull2x',
          label: { name: 'Bull Strategy', value: '2x' },
        },
        {
          icon: 'bull',
          value: 'bull3x',
          label: { name: 'Bull Strategy', value: '3x' },
        },
        {
          icon: 'neutral',
          value: 'neutral',
          label: { name: 'Neutral Strategy', value: '2x' },
        },
      ]
    }
    if (selectedStrategy === 'bull2x') {
      return [
        {
          icon: 'bull',
          value: 'bull2x',
          label: { name: 'Bull Strategy', value: '2x' },
        },
        {
          icon: 'bull',
          value: 'bull3x',
          label: { name: 'Bull Strategy', value: '3x' },
        },
        {
          icon: 'bear',
          value: 'bear',
          label: { name: 'Bear Strategy', value: '3x' },
        },
        {
          icon: 'neutral',
          value: 'neutral',
          label: { name: 'Neutral Strategy', value: '2x' },
        },
      ]
    }
    return [
      {
        icon: 'bull',
        value: 'bull3x',
        label: { name: 'Bull Strategy', value: '3x' },
      },
      {
        icon: 'bull',
        value: 'bull2x',
        label: { name: 'Bull Strategy', value: '2x' },
      },
      {
        icon: 'bear',
        value: 'bear',
        label: { name: 'Bear Strategy', value: '3x' },
      },
      {
        icon: 'neutral',
        value: 'neutral',
        label: { name: 'Neutral Strategy', value: '2x' },
      },
    ]
  }

  const getSelectOptionsCake = (): Array<{ icon: string; value: string; label: { name: string; value: string } }> => {
    if (selectedStrategy === 'bull2x') {
      return [
        {
          icon: 'bull',
          value: 'bull2x',
          label: {
            name: 'Bull Strategy',
            value: '2x',
          },
        },
        {
          icon: 'bull',
          value: 'bull3x',
          label: {
            name: 'Bull Strategy',
            value: '3x',
          },
        },
      ]
    }
    return [
      {
        icon: 'bull',
        value: 'bull3x',
        label: { name: 'Bull Strategy', value: '3x' },
      },
      {
        icon: 'bull',
        value: 'bull2x',
        label: { name: 'Bull Strategy', value: '2x' },
      },
    ]
  }

  const getTokenSelectOptions = React.useCallback(() => {
    return [
      {
        icon: singleFarm?.token,
        label: { name: singleFarm?.token?.symbol.toUpperCase().replace('WBNB', 'BNB') },
        value: singleFarm?.token,
      },
      {
        icon: singleFarm?.quoteToken,
        label: { name: singleFarm?.quoteToken?.symbol.toUpperCase().replace('WBNB', 'BNB') },
        value: singleFarm?.quoteToken,
      },
    ]
  }, [singleFarm])

  const [tokenSelectOptions, setTokenSelectOptions] = useState(getTokenSelectOptions())
  const [resetWatcher, setResetWatcher] = useState(0)
  React.useEffect(() => {
    setSelectedToken(singleFarm?.token)
    setTokenSelectOptions(getTokenSelectOptions())
    setResetWatcher((prev) => prev + 1)
  }, [getTokenSelectOptions, marketStrategy, singleFarm])

  const yieldFarming = Number(yieldFarmData * singleLeverage)
  const tradingFees = Number(tradeFee * 365 * singleLeverage)
  const huskyRewardsData = Number(huskyRewards * (singleLeverage - 1)) * 100
  const borrowingInterestData = Number(Number(interestRatePerYear) * (singleLeverage - 1)) * 100
  const apr = getApr(singleLeverage) * 100
  const dailyApr = apr / 365

  // const minimumDebt =
  //   tokenName === singleFarm?.token?.symbol.toUpperCase().replace('WBNB', 'BNB')
  //     ? new BigNumber(singleFarm?.tokenMinDebtSize).div(new BigNumber(BIG_TEN).pow(18))
  //     : new BigNumber(singleFarm?.quoteTokenMinDebtSize).div(new BigNumber(BIG_TEN).pow(18))
  const minimumDebt = 1

  const { tooltip, targetRef, tooltipVisible } = useTooltip(
    <>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small>{t('Yield Farming')}</Text>
        <Text>{yieldFarming?.toFixed(2)}%</Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small>{t('Trading Fees')}</Text>
        <Text>{tradingFees?.toFixed(2)}%</Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small>{t('Huski Rewards')}</Text>
        <Text>{huskyRewardsData?.toFixed(2)}%</Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small>{t('Borrowing Interest')}</Text>
        <Text>-{Number(borrowingInterestData)?.toFixed(2)}%</Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small>{t('Total APR')}</Text>
        <Text>{apr?.toFixed(2)}%</Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small>{t('Total APY')}</Text>
        <Text>{apy?.toFixed(2)}%</Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small>{t('Daily APR')}</Text>
        <Text>{dailyApr?.toFixed(2)}%</Text>
      </Flex>
    </>,
    { placement: 'right' },
  )

  const [chartype, setChartType] = useState(0)
  return (
    <StyledPage>
      <Text bold fontSize="3" color="secondary" mx="auto">
        {t(
          `Farming ${singleFarm.lpSymbol
            .toUpperCase()
            .replace('WBNB', 'BNB')
            .replace(' PANCAKESWAPWORKER', '')} Pools`,
        )}
      </Text>
      <SectionWrapper>
        <Flex className="graphSide">
          <Section>
            <HighchartsReactWrapper options={getStockChartOption()} />
          </Section>

          <Section>
            <Flex mb="20px" borderBottom={`1px solid ${isDark ? '#ffe7eb1a' : '#0000001a'}`} width="100%">
              <Flex>
                <Text
                  style={{
                    marginRight: '40px',
                    cursor: 'pointer',
                    color: chartype === 0 ? '#623CE7' : '',
                    fontWeight: 'bold',
                    borderBottom: chartype === 0 ? '3px solid #623CE7' : '',
                    paddingBottom: '10px',
                  }}
                  onClick={() => setChartType(0)}
                >
                  {t(`ROI Over Time`)}
                </Text>
                <Text
                  style={{
                    cursor: 'pointer',
                    color: chartype === 1 ? '#623CE7' : '',
                    fontWeight: 'bold',
                    borderBottom: chartype === 1 ? '3px solid #623CE7' : '',
                    paddingBottom: '10px',
                  }}
                  onClick={() => setChartType(1)}
                >
                  {t(`ROI vs Price Fluctuation`)}
                </Text>
              </Flex>
            </Flex>
            {chartype === 0 ? (
              <TimeChart
                xAxisdata={xAxisdataTime}
                chartData1={timeChartData1.length > 0 ? timeChartData1 : [0]}
                chartData2={timeChartData2.length > 0 ? timeChartData2 : [0]}
                tokenName={tokenName}
                quoteTokenName={quoteTokenName}
              />
            ) : (
              <PriceChart
                xAxisdata={xAxisdataPrice}
                chartData1={priceChartData1}
                chartData2={priceChartData2}
                tokenName={tokenName}
                quoteTokenName={quoteTokenName}
              />
            )}
          </Section>
        </Flex>
        <Flex className="infoSide">
          <Section>
            <Flex>
              <SingleFarmSelect
                options={
                  singleFarm.quoteToken?.symbol === 'CAKE' ? getSelectOptionsCake() : getSelectOptions()
                }
                onChange={(option) => {
                  setMarketStrategy(option.value)
                  setInputValue('')
                  setButtonIndex(null)
                }}
              />
            </Flex>
            <Flex justifyContent="space-between" alignItems="center" mb="12px" mt="24px">
              <Text fontSize={isSmallScreen ? '12px' : '14px'}>{t('Collateral')}</Text>
              <SingleFarmSelectToken
                options={tokenSelectOptions}
                onChange={(option) => {
                  setSelectedToken(option.value)
                  setInputValue('')
                  setButtonIndex(null)
                }}
                reset={resetWatcher}
              />
            </Flex>
            <Box>
              <Text color="#6F767E" fontSize={isSmallScreen ? '10px' : '12px'}>
                {t('Balance: ')}
                <Text as="span" fontSize={isSmallScreen ? '10px' : '12px'}>
                  {balanceNumber}
                </Text>
              </Text>
              <InputArea justifyContent="space-between" mt="10px" mb="1rem">
                <Box width={isSmallScreen ? '18px' : '30px'} height={isSmallScreen ? '18px' : '30px'}>
                  <TokenImage token={selectedToken} width={isSmallScreen ? 18 : 30} height={isSmallScreen ? 18 : 30} />
                </Box>
                <NumberInput placeholder="0.00" value={inputValue} onChange={handleInput} />
                <Text fontSize="14px" fontWeight="bold">
                  {selectedToken.symbol.toUpperCase().replace('WBNB', 'BNB')}
                </Text>
              </InputArea>
              <ButtonMenu onItemClick={setInputToFraction} activeIndex={buttonIndex} isDark={isDark}>
                <ButtonMenuItem>25%</ButtonMenuItem>
                <ButtonMenuItem>50%</ButtonMenuItem>
                <ButtonMenuItem>75%</ButtonMenuItem>
                <ButtonMenuItem>100%</ButtonMenuItem>
              </ButtonMenu>
            </Box>
            <Box className="textArea">
              <Flex alignItems="center" justifyContent="space-between">
                <Flex alignItems="center">
                  <Text fontSize={isSmallScreen ? '12px' : '14px'} mr="5px">
                    {t('APY')}
                  </Text>
                  {tooltipVisible && tooltip}
                  <span ref={targetRef}>
                    <InfoIcon width="14px" color="textSubtle" />
                  </span>
                </Flex>
                {apy ? (
                  <Text fontSize={isSmallScreen ? '12px' : '14px'}>{apy?.toFixed(2)}%</Text>
                ) : (
                  <Skeleton width="80px" height="1rem" />
                )}
              </Flex>
              <Flex alignItems="center" justifyContent="space-between">
                <Text fontSize={isSmallScreen ? '12px' : '14px'}>{t('Equity')}</Text>
                {farmData ? (
                  <Text fontSize={isSmallScreen ? '12px' : '14px'}>
                    {new BigNumber(farmData[3] || 0)?.toFixed(3, 1)} {tokenName}
                  </Text>
                ) : (
                  <Text fontSize={isSmallScreen ? '12px' : '14px'}>0.00 {tokenName}</Text>
                )}
              </Flex>
              <Flex alignItems="center" justifyContent="space-between">
                <Text fontSize={isSmallScreen ? '12px' : '14px'}>{t('Position Value')}</Text>
                {farmData ? (
                  <Text fontSize={isSmallScreen ? '12px' : '14px'}>
                    {new BigNumber(farmData[8] || 0).toFixed(3, 1)} {tokenName} +{' '}
                    {new BigNumber(farmData[9] || 0).toFixed(3, 1)} {quoteTokenName}
                  </Text>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
              </Flex>
            </Box>
            <Flex mt="25px">
              {isApproved ? (
                <Button
                  width={isSmallScreen ? 60 : 120}
                  height={isSmallScreen ? 30 : 40}
                  mx="auto"
                  onClick={handleConfirm}
                  isLoading={isPending}
                  endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
                  disabled={
                    !account || !isApproved || Number(inputValue) === 0 || inputValue === undefined || isPending
                  }
                  style={{ fontSize: isSmallScreen ? '10px' : '14px' }}
                >
                  {isPending ? t('Confirming') : getWrapText()}
                </Button>
              ) : (
                <Button
                  width={isSmallScreen ? 60 : 120}
                  height={isSmallScreen ? 30 : 40}
                  mx="auto"
                  onClick={handleApprove}
                  isLoading={isApproving}
                  endIcon={isApproving ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
                  style={{ fontSize: isSmallScreen ? '10px' : '14px' }}
                >
                  {isApproving ? t('Approving') : t('Approve')}
                </Button>
              )}
            </Flex>
            <Flex height={isSmallScreen ? '15px' : '18px'} mt="10px">
              {inputValue ? (
                <Text mx="auto" color="red" fontSize={isSmallScreen ? '10px' : '10px'}>
                  {new BigNumber(farmData[3]).lt(minimumDebt)
                    ? t('Minimum Debt Size: %minimumDebt% %tokenName%', {
                      minimumDebt,
                      tokenName: tokenName.toUpperCase().replace('WBNB', 'BNB'),
                    })
                    : null}
                </Text>
              ) : null}
            </Flex>
          </Section>
        </Flex>
      </SectionWrapper>
    </StyledPage>
  )
}

export default BaseTokenOnly

// NOTE: javascript Number function and BigNumber.js toNumber() function might return a different value than the actual value
// if that value is bigger than MAX_SAFE_INTEGER. so needs to be careful when doing number operations.
// https://stackoverflow.com/questions/35727608/why-does-number-return-wrong-values-with-very-large-integers

// NOTE 2: the reason highcharts keeps re-rendering is a bit unclear, maybe because of tokenPriceList or something else in the page
// but wrapping it in a React.memo() function and giving it the areEqual function, which tells it to re-render only when the
// tokenPriceList (props.options.series[0].data) changes, seems to work.
// https://stackoverflow.com/questions/54946933/how-can-i-prevent-my-functional-component-from-re-rendering-with-react-memo-or-r
