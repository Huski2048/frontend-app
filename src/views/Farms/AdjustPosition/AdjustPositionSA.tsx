/* eslint-disable array-callback-return */
/* eslint-disable no-restricted-properties */
import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import Page from 'components/Layout/Page'
import {
  Box,
  Button,
  Flex,
  Text,
  Skeleton,
  InfoIcon,
  ChevronRightIcon,
  AutoRenewIcon,
  ArrowDropDownIcon,
  useMatchBreakpoints,
} from 'husky-uikit'
import styled from 'styled-components'
import { useCakePrice, useFarmMasterChefData, useFarmTokensLpData, useFarmPancakeLpData, useHuskiPrice } from 'state/leverage/hooks'
import { usePoolVaultData, usePoolFairLaunchData } from 'state/pool/hooks'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { getAddress, getWbnbAddress } from 'utils/addressHelpers'
import { getBalanceAmount, getDecimalAmount } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'config/index'
// import useTheme from 'hooks/useTheme'
import { ethers } from 'ethers'
import { useTranslation } from 'contexts/Localization'
import { useVault } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import NumberInput from 'components/NumberInput'
import { TokenImage, TokenPairImage } from 'components/TokenImage'
import { useWeb3React } from '@web3-react/core'
import { formatDisplayedBalance } from 'utils/formatDisplayedBalance'
import { getHuskyRewards, getYieldFarming, getAdjustData, getAdjustPositionRepayDebt } from '../helpers'

interface MoveProps {
  move: number
}

const MoveBox = styled(Box) <MoveProps>`
  margin-left: ${({ move }) => move}px;
  margin-top: -20px;
  margin-bottom: 10px;
  color: #7b3fe4;
`
const MoveBox1 = styled(Box) <MoveProps>`
  margin-left: ${({ move }) => move}px;
  margin-top: -20px;
  margin-bottom: 10px;
  color: #83bf6e;
`
const makeLongShadow = (color: any, size: any) => {
  let i = 2
  let shadow = `${i}px 0 0 ${size} ${color}`

  for (; i < 856; i++) {
    shadow = `${shadow}, ${i}px 0 0 ${size} ${color}`
  }

  return shadow
}

const RangeInput = styled.input`
  overflow: hidden;
  display: block;
  appearance: none;
  width: 100%;
  margin: 0;
  height: 32px;

  cursor: pointer;

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 32px;
    background: linear-gradient(to right, #7b3fe4, #7b3fe4) 100% 50% / 100% 4px no-repeat transparent;
  }

  &:focus {
    outline: none;
  }

  &::-webkit-slider-thumb {
    position: relative;
    appearance: none !important;
    height: 32px;
    width: 28px;

    background-image: url('/images/blueslider.png');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    border: 0;
    top: 50%;
    transform: translateY(-50%);
    box-shadow: ${makeLongShadow('rgb(189,159,242)', '-13px')};
    transition: background-color 150ms;
    &::before {
      height: 32px;
      width: 32px;
      background: red !important;
    }
  }
`

const RangeInput1 = styled.input`
  overflow: hidden;
  display: block;
  appearance: none;
  width: 100%;
  margin: 0;
  height: 32px;

  cursor: pointer;

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 32px;
    background: linear-gradient(to right, #83bf6e, #83bf6e) 100% 50% / 100% 4px no-repeat transparent;
  }

  &:focus {
    outline: none;
  }

  &::-webkit-slider-thumb {
    position: relative;
    appearance: none !important;
    height: 32px;
    width: 28px;

    background-image: url('/images/RangeHandle1.png');
    background-position: center center;
    background-repeat: no-repeat;

    background-size: 100% 100%;

    border: 0;
    top: 50%;
    transform: translateY(-50%);
    box-shadow: ${makeLongShadow('rgb(193,223,183)', '-13px')};
    transition: background-color 150ms;
    &::before {
      height: 32px;
      width: 32px;
      background: red !important;
    }
  }
`

interface LocationParams {
  data: any
}

const Section = styled(Box)`
  max-width: 850px;
  &:first-of-type {
    background-color: ${({ theme }) => theme.colors.disabled};
  }
  margin-left: auto;
  margin-right: auto;
  width: 95%;
  ${({ theme }) => theme.mediaQueries.lg} {
    width: 60%;
  }
  background-color: ${({ theme }) => theme.card.background};
  box-shadow: ${({ theme }) => theme.card.boxShadow};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 2rem;
  &:not(:first-child) {
    > ${Flex} {
      padding: 1rem 0;
    }
  }
`
const BalanceInputWrapper = styled(Flex)`
  border-bottom: 2px solid #9da2a6;
  padding: 5px;
  input {
    border: none;
    font-size: 12px;
    box-shadow: none;
    &:focus:not(:disabled) {
      box-shadow: none;
    }
    ${({ theme }) => theme.mediaQueries.xxl} {
      font-size: 14px;
    }
  }
`
const MainText = styled(Text)`
  font-size: 12px;
  ${({ theme }) => theme.mediaQueries.xxl} {
    font-size: 14px;
  }
  span.iconContainer {
    vertical-align: middle;
    display: inline-flex;
    margin-left: 5px;
    svg {
      width: 12px;
      ${({ theme }) => theme.mediaQueries.xxl} {
        width: 14px;
      }
    }
  }
`

const TitleText = styled(Text)`
  font-size: 13px;
  font-weight: 700;
  ${({ theme }) => theme.mediaQueries.xxl} {
    font-size: 20px;
  }
`
const ValueText = styled(Text)`
  font-size: 12px;
  font-weight: 700;
  ${({ theme }) => theme.mediaQueries.xxl} {
    font-size: 14px;
  }
`
const SubText = styled(Text)`
  color: #6f767e;
  font-size: 10px;
  ${({ theme }) => theme.mediaQueries.xxl} {
    font-size: 12px;
  }
`

const AdjPosBtn = styled(Button)`
  font-size: 10px;
  padding: 3px 12px;
  border-radius: 8px;
  height: unset;
  line-height: 24px;
  ${({ theme }) => theme.mediaQueries.xxl} {
    padding: 5px 12px;
    border-radius: 10px;
    font-size: 14px;
  }
`

const AdjustPositionSA = () => {
  // const { isDark } = useTheme()
  const { account } = useWeb3React()
  BigNumber.config({ EXPONENTIAL_AT: 1e9 }) // with this numbers from BigNumber won't be written in scientific notation (exponential)
  const { t } = useTranslation()
  const {
    state: { data },
  } = useLocation<LocationParams>()
  const history = useHistory()

  const handleSliderChange = (e) => {
    const value = e?.target?.value
    setTargetPositionLeverage(Number(value))
  }

  // const marketStrategy = 'bull' // TODO: get from data
  const [tokenInput, setTokenInput] = useState<string>()
  // const [quoteTokenInput, setQuoteTokenInput] = useState(0)

  const { positionId, debtValue, lpAmount, vault, serialCode } = data
  const {
    lpSymbol,
    tokenPriceUsd,
    quoteTokenPriceUsd,
    leverage,
    tradeFee,
    tokenBorrowInterest,
    workerAddress,
    strategies,
    token,
    quoteToken,
    pool,
    pid
  } = data?.farmData
  // const { quoteToken, token } = TokenInfo
  const { vaultAddress } = pool.address
  // const quoteTokenVaultAddress = QuoteTokenInfo.vaultAddress
  const vaultContract = useVault(vaultAddress)
  // const quoteTokenVaultContract = useVault(quoteTokenVaultAddress)
  const { callWithGasPrice } = useCallWithGasPrice()
  const { vaultDebtVal } = usePoolVaultData(pool.pid)
  const { debtPoolRewardPerBlock } = usePoolFairLaunchData(pool.pid)
  const { totalSupply } = useFarmPancakeLpData(pid, pool.pid)
  const { tokenAmountTotal, quoteTokenAmountTotal, lpTotalInQuoteToken } = useFarmTokensLpData(pid, pool.pid)
  const { poolWeight } = useFarmMasterChefData(pid, pool.pid)

  const { balance: bnbBalance } = useGetBnbBalance()
  const { balance: tokenBalance } = useTokenBalance(getAddress(token.address))
  const { balance: quoteTokenBalance } = useTokenBalance(getAddress(quoteToken.address))
  const lptotalSupplyNum = new BigNumber(totalSupply)

  const targetRef = React.useRef<any>()
  const [moveVal, setMoveVal] = useState({ width: 0, height: 0 })
  const [margin, setMargin] = useState(0)

  const targetRef1 = React.useRef<any>()
  const [moveVal1, setMoveVal1] = useState({ width: 0, height: 0 })
  const [margin1, setMargin1] = useState(0)

  let symbolName
  let lpSymbolName
  let tokenValue
  let quoteTokenValue
  let inputValue
  // let tokenPrice
  // let quoteTokenPrice
  let tokenValueSymbol
  let quoteTokenValueSymbol
  let inputSymbol
  let baseTokenAmount
  // let farmTokenAmount
  // let basetokenBegin
  // let farmingtokenBegin
  // let workerAddress
  // let withdrawMinimizeTradingAddress
  let partialCloseLiquidateAddress
  let strategyLiquidateAddress
  let contract
  let tokenInputValue
  let quoteTokenInputValue
  let userTokenBalance
  let userQuoteTokenBalance
  let userInputBalance
  let minimumDebt
  let borrowingInterest

  if (vault.toUpperCase() === vaultAddress.toUpperCase()) {
    // console.log('case 1')
    symbolName = token?.symbol.replace('wBNB', 'BNB')
    lpSymbolName = lpSymbol.replace(' PancakeswapWorker', '')
    tokenValue = token
    quoteTokenValue = quoteToken
    inputValue = serialCode === '221' ? tokenValue : quoteTokenValue
    // tokenPrice = tokenPriceUsd
    // quoteTokenPrice = quoteTokenPriceUsd
    tokenValueSymbol = token?.symbol.replace('wBNB', 'BNB')
    quoteTokenValueSymbol = quoteToken?.symbol.replace('wBNB', 'BNB')
    inputSymbol = serialCode === '221' ? tokenValueSymbol : quoteTokenValueSymbol
    baseTokenAmount = (Number(tokenAmountTotal) / Number(lptotalSupplyNum)) * lpAmount
    // farmTokenAmount = (Number(quoteTokenAmountTotal) / Number(lptotalSupplyNum)) * lpAmount
    // basetokenBegin = parseInt(tokenAmountTotal)
    // farmingtokenBegin = parseInt(quoteTokenAmountTotal)
    // workerAddress = address
    // withdrawMinimizeTradingAddress = strategies.StrategyPartialCloseMinimizeTrading
    partialCloseLiquidateAddress = strategies.StrategyPartialCloseLiquidate
    strategyLiquidateAddress = strategies.StrategyLiquidate
    contract = vaultContract
    tokenInputValue = tokenInput || 0
    quoteTokenInputValue = 0 // formatNumber(quoteTokenInput)
    userTokenBalance = getBalanceAmount(tokenValueSymbol === 'BNB' ? bnbBalance : tokenBalance)
    userQuoteTokenBalance = getBalanceAmount(quoteTokenValueSymbol === 'BNB' ? bnbBalance : quoteTokenBalance)
    userInputBalance = serialCode === '221' ? userTokenBalance : userQuoteTokenBalance
    minimumDebt = new BigNumber(data.farmData?.tokenMinDebtSize).div(new BigNumber(BIG_TEN).pow(18))
    borrowingInterest = tokenBorrowInterest
  } else {
    //  console.log('case 2')
    // symbolName = quoteToken?.symbol.replace('wBNB', 'BNB')
    // lpSymbolName = QuoteTokenInfo?.name.replace(' PancakeswapWorker', '')
    // tokenValue = quoteToken
    // quoteTokenValue = token
    // inputValue = serialCode === '221' ? tokenValue : quoteTokenValue
    // tokenPrice = quoteTokenPriceUsd
    // quoteTokenPrice = tokenPriceUsd
    // tokenValueSymbol = quoteToken?.symbol.replace('wBNB', 'BNB')
    // quoteTokenValueSymbol = token?.symbol.replace('wBNB', 'BNB')
    // inputSymbol = serialCode === '221' ? tokenValueSymbol : quoteTokenValueSymbol
    // baseTokenAmount = (Number(quoteTokenAmountTotal) / Number(lptotalSupplyNum)) * lpAmount
    // farmTokenAmount = (Number(tokenAmountTotal) / Number(lptotalSupplyNum)) * lpAmount
    // // baseTokenAmount = new BigNumber(quoteTokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    // // farmTokenAmount = new BigNumber(tokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    // basetokenBegin = parseInt(quoteTokenAmountTotal)
    // farmingtokenBegin = parseInt(tokenAmountTotal)
    // workerAddress = QuoteTokenInfo.address
    // withdrawMinimizeTradingAddress = QuoteTokenInfo.strategies.StrategyPartialCloseMinimizeTrading
    // partialCloseLiquidateAddress = QuoteTokenInfo.strategies.StrategyPartialCloseLiquidate
    // strategyLiquidateAddress = QuoteTokenInfo.strategies.StrategyLiquidate
    // contract = quoteTokenVaultContract
    // tokenInputValue = 0
    // quoteTokenInputValue = tokenInput || 0
    // userTokenBalance = getBalanceAmount(tokenValueSymbol === 'BNB' ? bnbBalance : quoteTokenBalance)
    // userQuoteTokenBalance = getBalanceAmount(quoteTokenValueSymbol === 'BNB' ? bnbBalance : tokenBalance)
    // userInputBalance = serialCode === '221' ? userTokenBalance : userQuoteTokenBalance
    // minimumDebt = new BigNumber(data.farmData?.quoteTokenMinDebtSize).div(new BigNumber(BIG_TEN).pow(18))
    // borrowingInterest = quoteTokenBorrowInterest
  }
  // console.info('use this', {
  //   symbolName,
  //   lpSymbolName,
  //   tokenValue,
  //   quoteTokenValue,
  //   tokenPrice,
  //   quoteTokenPrice,
  //   tokenValueSymbol,
  //   quoteTokenValueSymbol,
  //   inputSymbol,
  //   baseTokenAmount,
  //   farmTokenAmount,
  //   basetokenBegin,
  //   farmingtokenBegin,
  //   workerAddress,
  //   withdrawMinimizeTradingAddress,
  //   partialCloseLiquidateAddress,
  //   contract,
  //   tokenInputValue,
  //   quoteTokenInputValue,
  //   userTokenBalance,
  //   userQuoteTokenBalance,
  // })

  // const totalPositionValueInToken = new BigNumber(positionValueBase).dividedBy(BIG_TEN.pow(18)) // positionValueBaseNumber
  const debtValueNumber = new BigNumber(debtValue).dividedBy(BIG_TEN.pow(18))
  // const debtRatio = new BigNumber(debtValueNumber).div(new BigNumber(totalPositionValueInToken))
  const lvgAdjust = new BigNumber(baseTokenAmount)
    .times(2)
    .div(new BigNumber(baseTokenAmount).times(2).minus(new BigNumber(debtValueNumber)))
  const currentPositionLeverage = Number(lvgAdjust.toFixed(2, 1)) // lvgAdjust.toNumber()
  const [targetPositionLeverage, setTargetPositionLeverage] = useState<number>(currentPositionLeverage)
  // for apr
  const huskyPrice = useHuskiPrice()
  const cakePrice = useCakePrice()
  const yieldFarmData = getYieldFarming(
    quoteTokenPriceUsd,
    poolWeight,
    lpTotalInQuoteToken, new BigNumber(cakePrice))
  const huskyRewards = getHuskyRewards(
    vaultDebtVal,
    debtPoolRewardPerBlock,
    tokenPriceUsd, 
    huskyPrice) * 100
  const yieldFarmAPR = yieldFarmData * Number(currentPositionLeverage)
  const tradingFeesAPR = Number(tradeFee) * 365 * Number(currentPositionLeverage)
  const huskiRewardsAPR = huskyRewards * (currentPositionLeverage - 1)
  const borrowingInterestAPR = borrowingInterest * (currentPositionLeverage - 1)
  const apr = Number(yieldFarmAPR) + Number(tradingFeesAPR) + Number(huskiRewardsAPR) - Number(borrowingInterestAPR)
  const apy = Math.pow(1 + apr / 100 / 365, 365) - 1

  const adjustedYieldFarmAPR = yieldFarmData * Number(targetPositionLeverage)
  const adjustedTradingFeesAPR = Number(tradeFee) * 365 * Number(targetPositionLeverage)
  const adjustedHuskyRewards = getHuskyRewards(
    vaultDebtVal,
    debtPoolRewardPerBlock,
    tokenPriceUsd, 
    huskyPrice) * 100
  const adjustHuskiRewardsAPR = adjustedHuskyRewards * (targetPositionLeverage - 1)
  const adjustBorrowingInterestAPR = borrowingInterest * (currentPositionLeverage - 1)
  const adjustedApr: number =
    Number(adjustedYieldFarmAPR) +
    Number(adjustedTradingFeesAPR) +
    Number(adjustHuskiRewardsAPR) -
    Number(adjustBorrowingInterestAPR)
  const adjustedApy = Math.pow(1 + adjustedApr / 100 / 365, 365) - 1

  useLayoutEffect(() => {
    if (targetRef.current !== null && targetRef.current !== undefined) {
      setMoveVal({
        width: targetRef?.current?.offsetWidth,
        height: targetRef?.current?.offsetHeight,
      })
    }
  }, [targetPositionLeverage])

  useEffect(() => {
    const tt = ((Math.min(targetPositionLeverage, leverage) - 1) / (leverage - 1)) * (moveVal.width - 32)

    setMargin(tt)
  }, [targetPositionLeverage, moveVal.width, leverage])

  const { farmingData, repayDebtData } = getAdjustData(
    token,
    totalSupply,
    tokenAmountTotal,
    quoteTokenAmountTotal,
    data,
    targetPositionLeverage,
    quoteTokenInputValue,
    tokenInputValue,
    symbolName,
  )
  const adjustData = farmingData ? farmingData[1] : []
  let assetsBorrowed
  let baseTokenInPosition
  let farmingTokenInPosition
  let closeRatioValue // the ratio of position to close

  let UpdatedDebt
  if (adjustData?.[3] === 0 && adjustData?.[11] === 0) {
    // use repayDebtData
    assetsBorrowed = repayDebtData?.[4]
    baseTokenInPosition = repayDebtData?.[2]
    farmingTokenInPosition = repayDebtData?.[3]
    UpdatedDebt = Number(debtValueNumber) - repayDebtData?.[4]
    closeRatioValue = repayDebtData?.[8]
  } else {
    assetsBorrowed = adjustData?.[3]
    baseTokenInPosition = adjustData?.[8]
    farmingTokenInPosition = adjustData?.[9]
    UpdatedDebt =
      targetPositionLeverage >= currentPositionLeverage
        ? adjustData?.[3] + Number(debtValueNumber)
        : Number(debtValueNumber) - repayDebtData?.[4]
    closeRatioValue = repayDebtData?.[8]
  }

  const [percentageToClose, setPercentageToClose] = useState<number>(0)

  const {
    remainBase,
    remainFarm,
    minimumReceived,
    closeRatio,
  } = getAdjustPositionRepayDebt(data.farmData, data, targetPositionLeverage, percentageToClose / 100, symbolName, true)

  const handleTokenInput = useCallback(
    (event) => {
      // check if input is a number and includes decimals
      if (event.target.value.match(/^[0-9]*[.,]?[0-9]{0,18}$/)) {
        const input = event.target.value
        const finalValue = new BigNumber(input).gt(userInputBalance) ? input : input
        setTokenInput(finalValue)
      } else {
        event.preventDefault()
      }
    },
    [userInputBalance],
  )
  useLayoutEffect(() => {
    if (targetRef1.current !== null && targetRef1.current !== undefined) {
      setMoveVal1({
        width: targetRef1?.current?.offsetWidth,
        height: targetRef1?.current?.offsetHeight,
      })
      // console.log("!!!!", targetRef1?.current?.offsetWidth);
    }
  }, [percentageToClose])

  useEffect(() => {
    setMargin1(((moveVal1.width - 32) / 100) * percentageToClose)
  }, [percentageToClose, moveVal1.width])

  const [isRepayDebt, setIsRepayDebt] = useState(false)

  const datalistSteps = []
  const datalistOptions = (() => {
    for (let i = 1; i < leverage / 0.5; i++) {
      datalistSteps.push(1 + 0.5 * (-1 + i))
    }
    return datalistSteps.map((value, i) => {
      if (i === datalistSteps.length - 1)
        return <option value={value} label="MAX" style={{ color: '#6F767E', fontWeight: 'bold', fontSize: '13px' }} />
      return (
        <option
          value={value}
          label={`${value.toFixed(2)}x`}
          style={{ color: '#6F767E', fontWeight: 'bold', fontSize: '13px' }}
        />
      )
    })
  })()

  const { toastError, toastSuccess, toastInfo } = useToast()
  const [isPending, setIsPending] = useState(false)

  const bnbVaultAddress = getWbnbAddress()
  const depositContract = useVault(bnbVaultAddress)
  const handleDeposit = async (bnbMsgValue) => {
    const callOptionsBNB = {
      gasLimit: 380000,
      value: bnbMsgValue,
    }
    // setIsPending(true)
    try {
      toastInfo(t('Transaction Pending...'), t('Please Wait!'))
      const tx = await callWithGasPrice(depositContract, 'deposit', [bnbMsgValue], callOptionsBNB)
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Successful!'), t('Your deposit was successfull'))
        history.push('/farms')
      }
    } catch (error) {
      toastError(t('Unsuccessful'), t('Something went wrong your deposit request. Please try again...'))
    } finally {
      // setIsPending(false)
    }
  }

  const handleFarm = async (id, address, amount, loan, maxReturn, dataWorker) => {
    const callOptions = {
      gasLimit: 3800000,
    }
    const callOptionsBNB = {
      gasLimit: 3800000,
      value: amount,
    }

    setIsPending(true)
    try {
      toastInfo(t('Pending Request...'), t('Please Wait!'))
      const tx = await callWithGasPrice(
        contract,
        'work',
        [id, address, amount, loan, maxReturn, dataWorker],
        symbolName === 'BNB' ? callOptionsBNB : callOptions,
      )
      const receipt = await tx.wait()
      if (receipt.status) {
        console.info('receipt', receipt)
        toastSuccess(t('Successful!'), t('Your request was successfull'))
        history.push('/singleAssets')
      }
    } catch (error) {
      console.info('error', error)
      toastError('Unsuccessful', 'Something went wrong your request. Please try again...')
    } finally {
      setIsPending(false)
      setTokenInput('')
    }
  }

  const handleConfirm = async () => {
    const id = positionId
    const AssetsBorrowed = adjustData ? assetsBorrowed : debtValueNumber.toNumber()
    const loan = getDecimalAmount(new BigNumber(AssetsBorrowed), 18)
      .toString()
      .replace(/\.(.*?\d*)/g, '') // 815662939548462.2--- >  815662939548462
    const maxReturn = 0
    const abiCoder = ethers.utils.defaultAbiCoder
    let amount
    // let workerAddress
    let farmingTokenAmount
    let strategiesAddress
    let dataStrategy
    let dataWorker
    // let wrapFlag = false
    // base token is base token
    if (vault.toUpperCase() === vaultAddress.toUpperCase()) {
      // single base token
      // if (Number(tokenInputValue) !== 0 && Number(quoteTokenInputValue) === 0) {
      if (inputSymbol === tokenValueSymbol) {
        console.info('base + single + token input ')
        strategiesAddress = strategies.StrategyAddAllBaseToken
        dataStrategy = ethers.utils.defaultAbiCoder.encode(['uint256', 'uint256'], ['1', '221'])
        dataWorker = ethers.utils.defaultAbiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      } else {
        console.info('base + single + quote token input ')
        // farmingTokenAmount = quoteTokenInputValue || '0'
        farmingTokenAmount = getDecimalAmount(new BigNumber(tokenInputValue || 0), 18)
          .toString()
          .replace(/\.(.*?\d*)/g, '')
        strategiesAddress = strategies.StrategyAddTwoSidesOptimal
        dataStrategy = abiCoder.encode(['uint256', 'uint256', 'uint256'], [farmingTokenAmount, '1', '212']) // [param.farmingTokenAmount, param.minLPAmount])
        dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      }
      amount = getDecimalAmount(new BigNumber(quoteTokenInputValue || 0), 18)
        .toString()
        .replace(/\.(.*?\d*)/g, '')
    } else {
      // farm token is base token
      // if (Number(tokenInputValue) !== 0 && Number(quoteTokenInputValue) === 0) {
      //   console.info('farm + single + token input ')
      //   strategiesAddress = QuoteTokenInfo.strategies.StrategyAddAllBaseToken
      //   dataStrategy = ethers.utils.defaultAbiCoder.encode(['uint256', 'uint256'], ['1', '221'])
      //   dataWorker = ethers.utils.defaultAbiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      // } else {
      //   console.info('farm + single +1 quote token input ')
      //   wrapFlag = true
      //   // farmingTokenAmount = quoteTokenInputValue || '0'
      //   farmingTokenAmount = getDecimalAmount(new BigNumber(quoteTokenInputValue || 0), 18)
      //     .toString()
      //     .replace(/\.(.*?\d*)/g, '')
      //   strategiesAddress = QuoteTokenInfo.strategies.StrategyAddTwoSidesOptimal
      //   dataStrategy = abiCoder.encode(['uint256', 'uint256', 'uint256'], [farmingTokenAmount, '1', '212']) // [param.farmingTokenAmount, param.minLPAmount])
      //   dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      // }
      // amount = getDecimalAmount(new BigNumber(tokenInputValue || 0), 18)
      //   .toString()
      //   .replace(/\.(.*?\d*)/g, '')
    }

    if (
      lpSymbolName.toUpperCase().includes('BNB') &&
      // wrapFlag &&
      inputSymbol.toUpperCase().replace('WBNB', 'BNB') === 'BNB'
    ) {
      const bnbMsgValue = getDecimalAmount(new BigNumber(tokenInputValue || 0), 18)
        .toString()
        .replace(/\.(.*?\d*)/g, '')
      handleDeposit(bnbMsgValue)
    }

    handleFarm(id, workerAddress, amount, loan, maxReturn, dataWorker)
  }

  const handleFarmConvertTo = async (id, address, amount, loan, maxReturn, dataWorker) => {
    const callOptions = {
      gasLimit: 3800000,
    }
    const callOptionsBNB = {
      gasLimit: 3800000,
      value: amount,
    }
    setIsPending(true)
    try {
      toastInfo(t('Pending Request...'), t('Please Wait!'))
      const tx = await callWithGasPrice(
        contract,
        'work',
        [id, address, amount, loan, maxReturn, dataWorker],
        symbolName === 'BNB' ? callOptionsBNB : callOptions,
      )
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Successful!'), t('Your request was successfull'))
        history.push('/singleAssets')
      }
    } catch (error) {
      console.info('error', error)
      toastError(t('Unsuccessful'), t('Something went wrong your request. Please try again...'))
    } finally {
      setIsPending(false)
    }
  }

  const handleConfirmConvertTo = async () => {
    if (percentageToClose === 100) {
      handleConfirmConvertToAll()
    } else {
      handleConfirmConvertToPartial()
    }
  }

  const handleConfirmConvertToAll = async () => {
    const id = positionId
    const amount = 0
    const loan = 0
    const abiCoder = ethers.utils.defaultAbiCoder
    const maxReturn = ethers.constants.MaxUint256
    const receive = Number(minimumReceived) > 0 ? Number(minimumReceived) : 0
    const minbasetoken = getDecimalAmount(new BigNumber(receive), 18)
      .toString()
      .replace(/\.(.*?\d*)/g, '')
    const dataStrategy = abiCoder.encode(['uint256'], [minbasetoken])
    const dataWorker = abiCoder.encode(['address', 'bytes'], [strategyLiquidateAddress, dataStrategy])
    handleFarmConvertTo(id, workerAddress, amount, loan, maxReturn, dataWorker)
  }

  const handleConfirmConvertToPartial = async () => {
    const id = positionId
    const amount = 0
    const loan = 0
    const abiCoder = ethers.utils.defaultAbiCoder
    let receive = 0
    let closeRationum
    let maxDebtRepay
    let maxReturn
    let maxDebtRepaymentValue
    if (Number(targetPositionLeverage) === 1) {
      receive = Number(minimumReceived) > 0 ? Number(minimumReceived) : 0
      closeRationum = closeRatio
      maxDebtRepay = Number(UpdatedDebt) > 0 ? Number(UpdatedDebt) : 0
      maxReturn = ethers.constants.MaxUint256
      maxDebtRepaymentValue = ethers.constants.MaxUint256
    } else {
      receive = 0
      closeRationum = closeRatioValue
      maxDebtRepay = Number(UpdatedDebt) > 0 ? Number(UpdatedDebt) : 0
      const maxDebtRepayment = getDecimalAmount(new BigNumber(maxDebtRepay), 18)
        .toString()
        .replace(/\.(.*?\d*)/g, '') // Number(maxDebtRepay).toString()
      maxReturn = maxDebtRepayment // ethers.utils.parseEther(maxDebtRepayment)
      maxDebtRepaymentValue = maxDebtRepayment // ethers.utils.parseEther(maxDebtRepayment)    try
    }
    const returnLpTokenValue = (lpAmount * closeRationum).toString()
    // const maxDebtRepayment = Number(maxDebtRepay).toString()
    const minbasetoken = getDecimalAmount(new BigNumber(receive), 18)
      .toString()
      .replace(/\.(.*?\d*)/g, '')
    // const maxReturn = ethers.utils.parseEther(maxDebtRepayment);
    const dataStrategy = abiCoder.encode(
      ['uint256', 'uint256', 'uint256'],
      [returnLpTokenValue, maxDebtRepaymentValue, minbasetoken],
    )
    const dataWorker = abiCoder.encode(['address', 'bytes'], [partialCloseLiquidateAddress, dataStrategy])
    
    handleFarmConvertTo(id, workerAddress, amount, loan, maxReturn, dataWorker)
  }

  const isAddCollateralConfirmDisabled = (() => {
    if (
      currentPositionLeverage > targetPositionLeverage ||
      (currentPositionLeverage === 1 && targetPositionLeverage === 1)
    ) {
      return Number(tokenInputValue) === 0 && Number(quoteTokenInputValue) === 0
    }
    if (currentPositionLeverage === 1 && targetPositionLeverage > currentPositionLeverage) {
      return new BigNumber(UpdatedDebt).lt(minimumDebt)
    }
    if (targetPositionLeverage > currentPositionLeverage) {
      return false
    }
    return true
  })()

  const iscConvertToConfirmDisabled = (() => {
    if (targetPositionLeverage === 1 && currentPositionLeverage === 1) {
      return Number(percentageToClose) === 0
    }
    if (targetPositionLeverage === 1 && currentPositionLeverage !== 1) {
      return false
    }
    if (targetPositionLeverage !== 1) {
      return new BigNumber(new BigNumber(debtValueNumber).minus(UpdatedDebt)).lt(minimumDebt)
    }
    return true
  })()

  const showNotice = (() => {
    if (currentPositionLeverage === 1 && targetPositionLeverage > currentPositionLeverage) {
      return new BigNumber(UpdatedDebt).lt(minimumDebt)
    }
    if (targetPositionLeverage < currentPositionLeverage && targetPositionLeverage !== 1 && isRepayDebt) {
      return new BigNumber(new BigNumber(debtValueNumber).minus(UpdatedDebt)).lt(minimumDebt)
    }
    return false
  })()

  const { isXxl } = useMatchBreakpoints()

  return (
    <Page>
      <TitleText mx="auto">{t('Adjust Position')}</TitleText>
      <Section>
        {/* <Text bold>{t('Current Position Leverage:')} {currentPositionLeverage.toPrecision(3)}x</Text> */}
        <Flex alignItems="center" justifyContent="space-between" flexWrap="wrap" style={{ border: 'none' }}>
          <MainText mb="10px">
            {t('Current Position Leverage:')} {currentPositionLeverage}x
          </MainText>
          <CurrentPostionToken>
            <MainText mr="15px">{`${symbolName.replace('wBNB', 'BNB')}#${positionId}`}</MainText>
            <Box width={isXxl ? 24 : 18} height={isXxl ? 24 : 18} mr="10px">
              <TokenPairImage
                primaryToken={token}
                secondaryToken={quoteToken}
                width={isXxl ? 24 : 18}
                height={isXxl ? 24 : 18}
              />
            </Box>
            <Box>
              <MainText>{lpSymbolName.toUpperCase().replace('WBNB', 'BNB')}</MainText>
              <SubText>{data.farmData.lpExchange}</SubText>
            </Box>
          </CurrentPostionToken>
        </Flex>
        <Flex border="none!important" alignItems="center">
          <MainText>{t('Target Position Leverage')}</MainText>
          <PositionX ml="auto">
            <SubText textAlign="center" lineHeight="24px">
              {new BigNumber(targetPositionLeverage).toFixed(2, 1)}x
            </SubText>
          </PositionX>
        </Flex>
        <Flex>
          <Box style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
            <MoveBox move={margin}>
              <Text color="#7B3FE4" bold>
                {targetPositionLeverage.toFixed(2)}x
              </Text>
            </MoveBox>
            <Box ref={targetRef} style={{ width: '100%', position: 'relative' }}>
              <ArrowDropDownIcon
                width={32}
                style={{
                  position: 'absolute',
                  top: '-12px',
                  fill: '#7B3FE4',
                  left:
                    ((Math.min(currentPositionLeverage, leverage) - 1) / (leverage - 1)) * (moveVal.width - 14) - 10,
                }}
              />
              <RangeInput
                type="range"
                min="1.0"
                max={leverage}
                step="0.01"
                name="leverage"
                value={targetPositionLeverage}
                onChange={handleSliderChange}
                list="leverage"
                style={{ width: '100%' }}
              />
            </Box>
            <Flex justifyContent="space-between" mt="-22px" mb="10px">
              <div
                className="middle"
                style={{ borderRadius: '50%', width: '12px', height: '12px', background: '#7B3FE4' }}
              />
              {targetPositionLeverage < 1.5 ? (
                <div style={{ borderRadius: '50%', width: '12px', height: '12px', background: 'rgb(189,159,242)' }} />
              ) : (
                <div
                  className="middle"
                  style={{ borderRadius: '50%', width: '12px', height: '12px', background: '#7B3FE4' }}
                />
              )}
              {targetPositionLeverage < 2 ? (
                <div style={{ borderRadius: '50%', width: '12px', height: '12px', background: 'rgb(189,159,242)' }} />
              ) : (
                <div
                  className="middle"
                  style={{ borderRadius: '50%', width: '12px', height: '12px', background: '#7B3FE4' }}
                />
              )}
              {targetPositionLeverage < 2.5 ? (
                <div style={{ borderRadius: '50%', width: '12px', height: '12px', background: 'rgb(189,159,242)' }} />
              ) : (
                <div
                  className="middle"
                  style={{ borderRadius: '50%', width: '12px', height: '12px', background: '#7B3FE4' }}
                />
              )}
              <div
                className="middle"
                style={{ borderRadius: '50%', width: '12px', height: '12px', background: 'rgb(189,159,242)' }}
              />
            </Flex>
            <Text>
              <datalist
                style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '5px' }}
                id="leverage"
              >
                {datalistOptions}
              </datalist>
            </Text>
          </Box>
        </Flex>

        {/* default always show add collateral */}
        {targetPositionLeverage === currentPositionLeverage && targetPositionLeverage !== 1 ? (
          isRepayDebt ? (
            <>
              <MainText>
                {t('You can customize your position with ')}{' '}
                <MainText
                  as="span"
                  onClick={() => setIsRepayDebt(false)}
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                  color="#7B3FE4"
                >
                  {t('Adding collateral')}
                </MainText>
              </MainText>
              <Flex justifyContent="space-between" mt="10px">
                <MainText>
                  {t(`You're repaying debt`)}
                  <span className="iconContainer">
                    <InfoIcon color="#6f767e" />
                  </span>
                </MainText>
                <SubText>
                  {t('Balance:')}{' '}
                  <SubText as="span" fontWeight="500">{`${formatDisplayedBalance(
                    userInputBalance,
                    inputValue?.decimalsDigits,
                  )} ${inputSymbol}`}</SubText>
                </SubText>
              </Flex>

              <Flex justifyContent="space-between">
                <MainText>{t('APY')}</MainText>
                {apy ? (
                  <Flex alignItems="center">
                    <ValueText>{(apy * 100).toFixed(2)}%</ValueText>
                    <ChevronRightIcon />
                    <ValueText>{(adjustedApy * 100).toFixed(2)}%</ValueText>
                  </Flex>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
              </Flex>
              <Flex justifyContent="space-between">
                <MainText>{t('Updated Position Value Assets')}</MainText>
                {adjustData ? (
                  <ValueText>
                    {farmingTokenInPosition.toFixed(2)} {quoteTokenValueSymbol} + {baseTokenInPosition.toFixed(2)}{' '}
                    {tokenValueSymbol}
                  </ValueText>
                ) : (
                  <ValueText>
                    0.00 {quoteTokenValueSymbol} + 0.00 {tokenValueSymbol}
                  </ValueText>
                )}
              </Flex>
            </>
          ) : (
            <>
              {' '}
              <MainText>
                {t('You can customize your position by partially')}{' '}
                <MainText
                  as="span"
                  onClick={() => setIsRepayDebt(true)}
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                  color="#7B3FE4"
                >
                  {t('Repaying Debt')}
                </MainText>
              </MainText>
              <Box>
                <Flex justifyContent="space-between" mt="30px" alignItems="center">
                  <MainText>
                    {t(`You're adding collateral`)}
                    <span className="iconContainer">
                      <InfoIcon color="#6f767e" />
                    </span>
                  </MainText>
                  <SubText>
                    {t('Balance:')}{' '}
                    <SubText as="span" fontWeight="500">{`${formatDisplayedBalance(
                      userInputBalance,
                      inputValue?.decimalsDigits,
                    )} ${inputSymbol}`}</SubText>
                  </SubText>
                </Flex>
                <BalanceInputWrapper alignItems="center" flex="1" padding="0" mt="16px">
                  <Box width={24} height={24} mr="5px">
                    <TokenImage token={inputValue} width={24} height={24} />
                  </Box>
                  <NumberInput
                    placeholder="0.00"
                    value={tokenInput}
                    onChange={handleTokenInput}
                    style={{ background: 'transparent' }}
                  />
                  <MainText>{inputSymbol}</MainText>
                </BalanceInputWrapper>
              </Box>
              <Flex justifyContent="space-between">
                <MainText>{t('APY')}</MainText>
                {apy ? (
                  <Flex alignItems="center">
                    <ValueText>{(apy * 100).toFixed(2)}%</ValueText>
                    <ChevronRightIcon />
                    <ValueText>{(adjustedApy * 100).toFixed(2)}%</ValueText>
                  </Flex>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
              </Flex>
              <Flex justifyContent="space-between">
                <MainText>{t('Updated Position Value Assets')}</MainText>
                {adjustData ? (
                  <ValueText>
                    {baseTokenInPosition.toFixed(2)} {tokenValueSymbol} + {farmingTokenInPosition.toFixed(2)}{' '}
                    {quoteTokenValueSymbol}
                  </ValueText>
                ) : (
                  <ValueText>
                    0.00 {tokenValueSymbol} + 0.00 {quoteTokenValueSymbol}
                  </ValueText>
                )}
              </Flex>
            </>
          )
        ) : null}

        {/* if current >= max lvg, can only go left choose between add collateral or repay debt */}
        {targetPositionLeverage < currentPositionLeverage && targetPositionLeverage !== 1 ? (
          isRepayDebt ? (
            <>
              <MainText>
                {t('You can customize your position with ')}{' '}
                <MainText
                  color="#7B3FE4"
                  as="span"
                  onClick={() => setIsRepayDebt(false)}
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                  {t('Adding collateral')}
                </MainText>
              </MainText>

              <Flex justifyContent="space-between" mt="10px">
                <MainText>
                  {t(`You're repaying debt`)}
                  <span className="iconContainer">
                    <InfoIcon color="#6f767e" />
                  </span>
                </MainText>
                <SubText>
                  {t('Balance:')}{' '}
                  <SubText as="span" fontWeight="500">{`${formatDisplayedBalance(
                    userInputBalance,
                    inputValue?.decimalsDigits,
                  )} ${inputSymbol}`}</SubText>
                </SubText>
              </Flex>

              <Flex justifyContent="space-between">
                <MainText>{t('APY')}</MainText>
                {apy ? (
                  <Flex alignItems="center">
                    <ValueText>{(apy * 100).toFixed(2)}%</ValueText>
                    <ChevronRightIcon />
                    <ValueText>{(adjustedApy * 100).toFixed(2)}%</ValueText>
                  </Flex>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
              </Flex>
              <Flex justifyContent="space-between">
                <MainText>{t('Updated Position Value Assets')}</MainText>
                {adjustData ? (
                  <ValueText>
                    {remainFarm?.toFixed(3)} {quoteTokenValueSymbol} + {remainBase?.toFixed(3)} {tokenValueSymbol}
                    {/* {baseTokenInPosition.toFixed(2)} {tokenValueSymbol} + {farmingTokenInPosition.toFixed(2)}{' '}
                    {quoteTokenValueSymbol} */}
                  </ValueText>
                ) : (
                  <ValueText>
                    0.00 {quoteTokenValueSymbol} + 0.00 {tokenValueSymbol}
                  </ValueText>
                )}
              </Flex>
            </>
          ) : (
            <>
              <MainText>
                {t('You can customize your position by partially')}{' '}
                <MainText
                  color="#7B3FE4"
                  as="span"
                  onClick={() => setIsRepayDebt(true)}
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                  {t('Repaying Debt')}
                </MainText>
              </MainText>
              <Box>
                <Flex justifyContent="space-between" mt="30px" alignItems="center">
                  <MainText>
                    {t(`You're adding collateral`)}
                    <span className="iconContainer">
                      <InfoIcon color="#6f767e" />
                    </span>
                  </MainText>
                  <SubText>
                    {t('Balance:')}{' '}
                    <SubText as="span" fontWeight="500">{`${formatDisplayedBalance(
                      userInputBalance,
                      inputValue?.decimalsDigits,
                    )} ${inputSymbol}`}</SubText>
                  </SubText>
                </Flex>
                <BalanceInputWrapper alignItems="center" flex="1" padding="0" mt="16px">
                  <Box width={24} height={24} mr="5px">
                    <TokenImage token={inputValue} width={40} height={40} />
                  </Box>
                  <NumberInput
                    placeholder="0.00"
                    value={tokenInput}
                    onChange={handleTokenInput}
                    style={{ background: 'transparent' }}
                  />
                  <MainText>{inputSymbol}</MainText>
                </BalanceInputWrapper>
              </Box>
              <Flex justifyContent="space-between">
                <MainText>{t('APY')}</MainText>
                {apy ? (
                  <Flex alignItems="center">
                    <ValueText>{(apy * 100).toFixed(2)}%</ValueText>
                    <ChevronRightIcon />
                    <ValueText>{(adjustedApy * 100).toFixed(2)}%</ValueText>
                  </Flex>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
              </Flex>
              <Flex justifyContent="space-between">
                <MainText>{t('Updated Position Value Assets')}</MainText>
                {adjustData ? (
                  <ValueText>
                    {baseTokenInPosition.toFixed(2)} {tokenValueSymbol} + {farmingTokenInPosition.toFixed(2)}{' '}
                    {quoteTokenValueSymbol}
                  </ValueText>
                ) : (
                  <ValueText>
                    0.00 {tokenValueSymbol} + 0.00 {quoteTokenValueSymbol}
                  </ValueText>
                )}
              </Flex>
            </>
          )
        ) : null}

        {/* if target > current */}
        {targetPositionLeverage > currentPositionLeverage ? (
          <>
            <Flex justifyContent="space-between" alignItems="center" mt="30px">
              <MainText>
                {t(`You're borrowing more:`)}
                <span className="iconContainer">
                  <InfoIcon color="#6F767E" />
                </span>
              </MainText>
              <SubText>
                {t('Balance:')}{' '}
                <SubText as="span" fontWeight="500">
                  {assetsBorrowed?.toFixed(2)} {inputSymbol}
                </SubText>
              </SubText>
            </Flex>
            <Flex justifyContent="space-between">
              <MainText>{t('APY')}</MainText>
              {apy ? (
                <Flex alignItems="center">
                  <ValueText>{(apy * 100).toFixed(2)}%</ValueText>
                  <ChevronRightIcon />
                  <ValueText>{(adjustedApy * 100).toFixed(2)}%</ValueText>
                </Flex>
              ) : (
                <Skeleton width="80px" height="16px" />
              )}
            </Flex>
            <Flex justifyContent="space-between">
              <MainText>{t('Position Value')}</MainText>
              {adjustData ? (
                <ValueText>
                  {baseTokenInPosition.toFixed(2)} {tokenValueSymbol} + {farmingTokenInPosition.toFixed(2)}{' '}
                  {quoteTokenValueSymbol}
                </ValueText>
              ) : (
                <ValueText>
                  0.00 {tokenValueSymbol} + 0.00 {quoteTokenValueSymbol}
                </ValueText>
              )}
            </Flex>
          </>
        ) : null}

        {/* if target is 1 */}
        {targetPositionLeverage === 1 ? (
          isRepayDebt ? (
            <>
              <MainText>
                {t('You can customize your position by')}{' '}
                <MainText
                  color="#7B3FE4"
                  as="span"
                  onClick={() => setIsRepayDebt(false)}
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                  {t('Adding collateral')}
                </MainText>
              </MainText>
              <Flex justifyContent="space-between" mt="10px">
                <MainText>
                  {t(`You're repaying debt`)}
                  <span className="iconContainer">
                    <InfoIcon color="#6F767E" />
                  </span>
                </MainText>
                <SubText>
                  {t('Balance:')}{' '}
                  <SubText as="span" fontWeight="500">{`${formatDisplayedBalance(
                    userInputBalance,
                    inputValue?.decimalsDigits,
                  )} ${inputSymbol}`}</SubText>
                </SubText>
              </Flex>

              <MainText>{t('What percentage would you like to close? (After repaying all debt)')}</MainText>
              <Flex mt="30px">
                <Box style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
                  <MoveBox1 move={margin1}>
                    <MainText color="#83BF6E">{percentageToClose}%</MainText>
                  </MoveBox1>
                  <Box ref={targetRef1} style={{ width: '100%', position: 'relative' }}>
                    <RangeInput1
                      type="range"
                      min="0.0"
                      max="100"
                      step="1"
                      name="leverage"
                      value={percentageToClose}
                      onChange={(e) => setPercentageToClose(Number(e.target.value))}
                      list="leverage"
                      style={{ width: '100%' }}
                    />
                  </Box>
                  <datalist
                    style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '5px' }}
                    id="leverage"
                  >
                    <option value={0} label="0%" style={{ color: '#6F767E', fontWeight: 'bold', fontSize: '13px' }} />
                    <option value={25} label="25%" style={{ color: '#6F767E', fontWeight: 'bold', fontSize: '13px' }} />
                    <option value={50} label="50%" style={{ color: '#6F767E', fontWeight: 'bold', fontSize: '13px' }} />
                    <option value={75} label="75%" style={{ color: '#6F767E', fontWeight: 'bold', fontSize: '13px' }} />
                    <option
                      value={100}
                      label="100%"
                      style={{ color: '#6F767E', fontWeight: 'bold', fontSize: '13px' }}
                    />
                  </datalist>
                </Box>
              </Flex>
              <Flex justifyContent="space-between">
                <MainText>{t('APY')}</MainText>
                {apy ? (
                  <Flex alignItems="center">
                    <ValueText>{(apy * 100).toFixed(2)}%</ValueText>
                    <ChevronRightIcon />
                    <ValueText>{(adjustedApy * 100).toFixed(2)}%</ValueText>
                  </Flex>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
              </Flex>
              <Flex justifyContent="space-between">
                <MainText>{t('Updated Position Value Assets')}</MainText>
                {adjustData ? (
                  <ValueText>
                    {remainFarm?.toFixed(3)} {quoteTokenValueSymbol} + {remainBase?.toFixed(3)} {tokenValueSymbol}
                    {/* {baseTokenInPosition.toFixed(2)} {tokenValueSymbol} + {farmingTokenInPosition.toFixed(2)}{' '}
                    {quoteTokenValueSymbol} */}
                  </ValueText>
                ) : (
                  <ValueText>
                    0.00 {quoteTokenValueSymbol} + 0.00 {tokenValueSymbol}
                  </ValueText>
                )}
              </Flex>
            </>
          ) : (
            <>
              <MainText>
                {t('You can customize your position by ')}{' '}
                <MainText
                  color="#7B3FE4"
                  as="span"
                  onClick={() => setIsRepayDebt(true)}
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                  {t('Partially Closing Your Position')}
                </MainText>
              </MainText>
              <Box>
                <Flex justifyContent="space-between" mt="30px" alignItems="center">
                  <MainText>
                    {t(`You're adding collateral`)}
                    <span className="iconContainer">
                      <InfoIcon color="#6F767E" />
                    </span>
                  </MainText>
                  <SubText>
                    {t('Balance:')}{' '}
                    <SubText as="span" fontWeight="500">{`${formatDisplayedBalance(
                      userInputBalance,
                      inputValue?.decimalsDigits,
                    )} ${inputSymbol}`}</SubText>
                  </SubText>
                </Flex>
                <BalanceInputWrapper alignItems="center" flex="1" padding="0" mt="16px">
                  <Box width={24} height={24} mr="5px">
                    <TokenImage token={inputValue} width={24} height={24} />
                  </Box>
                  <NumberInput
                    placeholder="0.00"
                    value={tokenInput}
                    onChange={handleTokenInput}
                    style={{ background: 'transparent' }}
                  />
                  <MainText>{inputSymbol}</MainText>
                </BalanceInputWrapper>
              </Box>
              <Flex justifyContent="space-between">
                <MainText>{t('APY')}</MainText>
                {apy ? (
                  <Flex alignItems="center">
                    <ValueText>{(apy * 100).toFixed(2)}%</ValueText>
                    <ChevronRightIcon />
                    <ValueText>{(adjustedApy * 100).toFixed(2)}%</ValueText>
                  </Flex>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
              </Flex>
              <Flex justifyContent="space-between">
                <MainText>{t('Updated Position Value Assets')}</MainText>
                {adjustData ? (
                  <ValueText>
                    {baseTokenInPosition.toFixed(2)} {tokenValueSymbol} + {farmingTokenInPosition.toFixed(2)}{' '}
                    {quoteTokenValueSymbol}
                  </ValueText>
                ) : (
                  <ValueText>
                    0.00 {tokenValueSymbol} + 0.00 {quoteTokenValueSymbol}
                  </ValueText>
                )}
              </Flex>
            </>
          )
        ) : null}
        <Flex>
          {targetPositionLeverage > currentPositionLeverage ? (
            <AdjPosBtn
              onClick={handleConfirm}
              disabled={isAddCollateralConfirmDisabled || !account || isPending}
              isLoading={isPending}
              endIcon={isPending ? <AutoRenewIcon spin color="primary" /> : null}
              mx="auto"
            >
              {isPending ? t('Adjusting Position') : t('Adjust Position')}
            </AdjPosBtn>
          ) : isRepayDebt ? (
            <AdjPosBtn
              onClick={handleConfirmConvertTo}
              disabled={iscConvertToConfirmDisabled || !account || isPending}
              isLoading={isPending}
              endIcon={isPending ? <AutoRenewIcon spin color="primary" /> : null}
              mx="auto"
            >
              {isPending ? t('Adjusting Position') : t('Adjust Position')}
            </AdjPosBtn>
          ) : (
            <AdjPosBtn
              onClick={handleConfirm}
              disabled={isAddCollateralConfirmDisabled || !account || isPending}
              isLoading={isPending}
              endIcon={isPending ? <AutoRenewIcon spin color="primary" /> : null}
              mx="auto"
            >
              {isPending ? t('Adjusting Position') : t('Adjust Position')}
            </AdjPosBtn>
          )}
        </Flex>
        <MainText mx="auto" color="red" textAlign="center" mt="10px">
          {showNotice
            ? t('Minimum Debt Size: %minimumDebt% %name%', {
              minimumDebt: minimumDebt.toNumber(),
              name: tokenValueSymbol.toUpperCase().replace('WBNB', 'BNB'),
            })
            : null}
        </MainText>
      </Section>
    </Page>
  )
}

export default AdjustPositionSA

const CurrentPostionToken = styled(Flex)`
  border: 1px solid #efefef;
  box-sizing: border-box;
  border-radius: 12px;
  align-items: center;
  padding: 10px 20px;
`

const PositionX = styled(Box)`
  width: 65px;
  padding: 4px 10px;
  border: 1px solid #efefef;
  border-radius: 10px;
`
