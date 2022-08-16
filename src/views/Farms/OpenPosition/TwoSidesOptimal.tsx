import React, { useState, useCallback } from 'react'
import { useLocation } from 'react-router'
import Page from 'components/Layout/Page'
import {
  Box,
  Flex,
  Text,
} from 'husky-uikit'
import styled from 'styled-components'
import { TokenImage } from 'components/TokenImage'
import { useCakePrice, useFarmMasterChefData, useFarmTokensLpData, useFarmPancakeLpData, useHuskiPrice, useFarmFromLpPid, useWorkerKillFactor } from 'state/leverage/hooks'
import { usePoolVaultData, usePoolFairLaunchData, usePoolVaultConfigData } from 'state/pool/hooks'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { getAddress } from 'utils/addressHelpers'
import { getBalanceAmount, getDecimalAmount } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import Select from 'components/Select/Select'
import { ethers } from 'ethers'
import { useTranslation } from 'contexts/Localization'
import { useVault, useERC20 } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useWeb3React } from '@web3-react/core'
import tokens from 'config/constants/tokens'
import { isUndefined } from 'lodash'
import { BigText, NormalText } from 'components/Text/Text'
import { BIG_TEN } from 'config'
import { getHuskyRewards, getYieldFarming, getLeverageFarmingData, getRiseDropFarm, getApr, getDisplayApr, getApy } from '../helpers'
import { useTradeFeesFromPid } from '../../../state/graph/hooks'
import FarmButton from './components/FarmButton'
import DebtProgress from './components/DebtProgress'
import FarmDetails from './components/FarmDetails'
import FarmInputs from './components/FarmInputs'

interface FarmingParams {
  pid: number
  selectedLeverage: number
  selectedBorrowing?: string
  farmingType?: string
}

const SPage = styled(Page)`
  padding-top: 0px;
  /* padding: 20px 0px; */
  /* max-width: 1440px; */
`

const SmText = styled(Text) <{ isDark?: boolean }>`
  color: ${({ isDark }) => (isDark ? '#6F767E' : '#6F767E')};
  font-size: 12px;
  ${({ theme }) => theme.screen.tablet} {
    font-size: 9px;
  }
`

const SSelect = styled(Select)`
  width: 100%;
  background: red;
  & > div {
    width: 100%;
  }
`
const SFlex2 = styled(Flex)`
  width: 100%;
  & > div {
    width: 100%;
  }
`

const SectionLeft = styled(Box)`
  &.gray {
    background-color: ${({ theme }) => theme.colors.input};
  }
  background-color: ${({ theme }) => theme.card.background};
  box-shadow: ${({ theme }) => theme.card.boxShadow};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 1rem;
  ${({ theme }) => theme.mediaQueries.lg} {
    margin-right: 10px;
  }
  > ${Flex} {
    padding: 1.2rem 0;
  }

  input[type='range'] {
    -webkit-appearance: none;
  }
  flex: 1 0 398px;
  width: initial !important;
  ${({ theme }) => theme.screen.pc} {
    /* width: 640px; */
    padding: 16px 20px;
  }
  ${({ theme }) => theme.screen.tablet} {
    /* width: 398px; */
    padding: 14px 14px;
  }
`

const SText1 = styled(Text)`
  margin: 0 0 20px 0;
  option {
    font-size: 13px;
  }
  ${({ theme }) => theme.screen.tablet} {
    font-size: 10px;
  }
`

const SectionRight = styled(Flex)`
  flex: 1 0 328px;
  width: initial !important;
`

const SectionWrapper = styled(Page)`
  display: flex;
  justify-content: center;
  min-height: unset;
  flex-direction: column;
  padding: 20px 5px;
  margin-right: 0px;
  margin: 0 auto;
  width: 100%;
  ${({ theme }) => theme.screen.pc} {
    flex-direction: row;
    justify-content: space-between;
  }
  ${({ theme }) => theme.screen.tablet} {
    flex-direction: row;
    justify-content: space-between;
  }
  /* > .main {
    ${({ theme }) => theme.mediaQueries.lg} {
      width: 36rem;
    }
  } */
  > .sideSection {
    flex-direction: column;
    gap: 1rem;
    ${({ theme }) => theme.screen.pc} {
      width: 528px;
    }
  }
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

const TwoSidesOptimal = () => {
  BigNumber.config({ EXPONENTIAL_AT: 1e9 }) // with this numbers from BigNumber won't be written in scientific notation (exponential)

  const {
    state: { pid, selectedLeverage, selectedBorrowing, farmingType },
  } = useLocation<FarmingParams>()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const farmsData = useFarmFromLpPid(pid)
  const [radio, setRadio] = useState(selectedBorrowing)
  const farmData = farmsData[0].token.symbol === radio ? farmsData[0] : farmsData[1]
  const { vaultDebtVal } = usePoolVaultData(farmData.pool.pid)
  const { minDebtSize } = usePoolVaultConfigData(farmData.pool.pid)
  const { debtPoolRewardPerBlock } = usePoolFairLaunchData(farmData.pool.pid)
  const { totalSupply } = useFarmPancakeLpData(farmData.pid, farmData.pool.pid)
  const { tokenAmountTotal, quoteTokenAmountTotal, lpTotalInQuoteToken } = useFarmTokensLpData(farmData.pid, farmData.pool.pid)
  const { poolWeight } = useFarmMasterChefData(farmData.pid, farmData.pool.pid)
  const tokenAddress = getAddress(farmData.token.address)
  const quoteTokenAddress = getAddress(farmData.quoteToken.address)
  const tokenContract = useERC20(tokenAddress)
  const quoteTokenApproveContract = useERC20(quoteTokenAddress)
  const vaultAddress = getAddress(farmData.pool.address)
  const vaultContract = useVault(vaultAddress)

  const { leverage } = farmData
  const [leverageValue, setLeverageValue] = useState(selectedLeverage)
  const [isApproved, setIsApproved] = useState(true)

  const datalistSteps = []
  const datalistOptions = (() => {
    for (let i = 1; i < leverage / 0.5; i++) {
      datalistSteps.push(`${(1 + 0.5 * (-1 + i)).toFixed(2)}x`)
    }
    return datalistSteps.map((value, i) => {
      if (i === datalistSteps.length - 1)
        return <option value={value} label="MAX" style={{ color: '#6F767E', fontWeight: 'bold' }} key={value}/>

      return <option value={value} label={value} style={{ color: '#6F767E', fontWeight: 'bold' }} key={value}/>
    })
  })()

  const { balance: bnbBalance } = useGetBnbBalance()
  const { balance: tokenBalance } = useTokenBalance(getAddress(farmData.token.address))
  const userTokenBalance = getBalanceAmount(
    farmData?.token?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : tokenBalance,
  )
  const { balance: quoteTokenBalance } = useTokenBalance(getAddress(farmData.quoteToken.address))
  const userQuoteTokenBalance = getBalanceAmount(
    farmData?.quoteToken?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : quoteTokenBalance,
  )

  const huskyPrice = useHuskiPrice()
  const cakePrice = useCakePrice()
  const huskyRewards = getHuskyRewards(
    vaultDebtVal,
    debtPoolRewardPerBlock,
    farmData.tokenPriceUsd,
    huskyPrice)
  const yieldFarmData = getYieldFarming(
    farmData.quoteTokenPriceUsd,
    poolWeight,
    lpTotalInQuoteToken, new BigNumber(cakePrice))

  const [quoteTokenInput, setQuoteTokenInput] = useState<string>()
  const [tokenInput, setTokenInput] = useState<string>()

  const leverageFarmingData = getLeverageFarmingData(
    farmData.token,
    totalSupply,
    tokenAmountTotal,
    quoteTokenAmountTotal, leverageValue, tokenInput, quoteTokenInput, radio)
  const farmingData = leverageFarmingData ? leverageFarmingData[1] : []

  const { interestRatePerYear } = usePoolVaultData(farmData.pool.pid)
  const { tradingFee: tradeFee } = useTradeFeesFromPid(farmData.pid)

  const totalAprDisplay = Number(getDisplayApr(getApr(yieldFarmData, tradeFee, huskyRewards, interestRatePerYear, leverageValue) * 100))

  const { callWithGasPrice } = useCallWithGasPrice()

  let tradingFee = farmingData?.[5] * 100
  if (isUndefined(tradingFee) || tradingFee < 0 || tradingFee > 1) {
    tradingFee = 0
  }

  let priceImpact = farmingData?.[4]
  if (priceImpact < 0.0000001 || priceImpact > 1) {
    priceImpact = 0
  }

  const bnbInput =
    farmData?.token?.symbol.toUpperCase().replace('WBNB', 'BNB') === 'BNB' ? tokenInput : quoteTokenInput

  const killFactor = useWorkerKillFactor(farmData.config, farmData.workerAddress)
  const principal = 1
  const maxValue = 1 - principal / farmData?.leverage
  const debtRatio = 1 - principal / leverageValue
  const liquidationThreshold = Number(killFactor) / 100

  const minimumDebt = new BigNumber(minDebtSize).div(BIG_TEN.pow(18))
  const debtValueData = farmingData ? farmingData[3] : 0
  const baseTokenAmount = farmingData ? farmingData[8] : 0
  const farmTokenAmount = farmingData ? farmingData[9] : 0

  const { decreasePct } = getRiseDropFarm(
    liquidationThreshold,
    debtValueData,
    baseTokenAmount,
    farmTokenAmount
  )
  const baseTokenSymbol = farmData.token.symbol
  const quoteTokenSymbol = farmData.quoteToken.symbol
  let priceChangeText = 'increases'
  if (decreasePct >= 0) {
    priceChangeText = 'increases'
  } else {
    priceChangeText = 'decreases'
  }
  const priceChangeAbs = Math.abs(decreasePct)

  const getDots = (): React.ReactNode => {
    const dot = []
    const steps = leverage / 0.5 - 1
    for (let i = 1; i <= steps; i++) {
      const value = 1 + 0.5 * (-1 + i)
      dot.push(
        <Box
          key={i}
          borderRadius="50%"
          width="12px"
          height="12px"
          background={Number(leverageValue) >= value ? '#7B3FE4' : 'rgb(189,159,242)'}
        />,
      )
    }
    return dot
  }

  const handleSliderChange = (e) => {
    const value = e?.target?.value
    setLeverageValue(value)
  }

  const setApprovedState = useCallback(() => {
    if (Number(tokenInput || 0) !== 0
      && Number(tokenInput || 0) > Number(farmData.userData.tokenAllowance)) {
        setIsApproved(false)
        return
    } 
    
    if (Number(quoteTokenInput || 0) !== 0
      && Number(quoteTokenInput || 0) > Number(farmData.userData.quoteTokenAllowance)) {
        setIsApproved(false)
        return
    }

    setIsApproved(true)
  },
  [tokenInput, quoteTokenInput, farmData],
  )

  const handleTokenInput = useCallback(
    (event) => {
      // check if input is a number and includes decimals
      if (event.target.value.match(/^[0-9]*[.,]?[0-9]{0,18}$/)) {
        const input = event.target.value
        const finalValue = new BigNumber(input).gt(userTokenBalance) ? userTokenBalance.toString() : input
        setTokenInput(finalValue)
      } else {
        event.preventDefault()
      }
      setApprovedState()
    },
    [userTokenBalance, setApprovedState],
  )

  const handleQuoteTokenInput = useCallback(
    (event) => {
      // check if input is a number and includes decimals
      if (event.target.value.match(/^[0-9]*[.,]?[0-9]{0,18}$/)) {
        const input = event.target.value
        const finalValue = new BigNumber(input).gt(userQuoteTokenBalance) ? userQuoteTokenBalance.toString() : input
        setQuoteTokenInput(finalValue)
      } else {
        event.preventDefault()
      }
      setApprovedState()
    },
    [userQuoteTokenBalance, setApprovedState],
  )

  const [quoteTokenButtonIndex, setQuoteTokenButtonIndex] = useState(null)
  const setQuoteTokenInputToFraction = (index) => {
    setQuoteTokenButtonIndex(index)
    switch (index) {
      case 0:
        setQuoteTokenInput(userQuoteTokenBalance.times(0.25).toString())
        break;
      case 1:
        setQuoteTokenInput(userQuoteTokenBalance.times(0.5).toString())
        break;
      case 2:
        setQuoteTokenInput(userQuoteTokenBalance.times(0.75).toString())
        break;
      case 3:
        setQuoteTokenInput(userQuoteTokenBalance.toString())
        break;
      default:
        setQuoteTokenInput('0')
        break;
    }
  }

  const [tokenButtonIndex, setTokenButtonIndex] = useState(null)
  const setTokenInputToFraction = (index) => {
    setTokenButtonIndex(index)
    switch (index) {
      case 0:
        setTokenInput(userTokenBalance.times(0.25).toString())
        break;
      case 1:
        setTokenInput(userTokenBalance.times(0.5).toString())
        break;
      case 2:
        setTokenInput(userTokenBalance.times(0.75).toString())
        break;
      case 3:
        setTokenInput(userTokenBalance.toString())
        break;
      default:
        setTokenInput('0')
        break;
    }
  }

  const options = () => {
    if (farmData?.switchFlag) {
      return [
        {
          label:
            selectedBorrowing === farmData?.token?.symbol
              ? farmData?.token.symbol.toUpperCase().replace('WBNB', 'BNB')
              : farmData?.quoteToken?.symbol.toUpperCase().replace('WBNB', 'BNB'),
          value:
            selectedBorrowing === farmData?.token?.symbol
              ? farmData?.token.symbol
              : farmData?.quoteToken?.symbol,
          icon: (
            <Box width={20} height={20}>
              <TokenImage
                token={
                  selectedBorrowing === farmData?.token?.symbol
                    ? farmData?.token
                    : farmData?.quoteToken
                }
                width={20}
                height={20}
              />
            </Box>
          ),
        },
        {
          label:
            selectedBorrowing === farmData?.token?.symbol
              ? farmData?.quoteToken.symbol.toUpperCase().replace('WBNB', 'BNB')
              : farmData?.token?.symbol.toUpperCase().replace('WBNB', 'BNB'),
          value:
            selectedBorrowing === farmData?.token?.symbol
              ? farmData?.quoteToken.symbol
              : farmData?.token?.symbol,
          icon: (
            <Box width={20} height={20}>
              <TokenImage
                token={
                  selectedBorrowing === farmData?.token?.symbol
                    ? farmData?.quoteToken
                    : farmData?.token
                }
                width={20}
                height={20}
              />
            </Box>
          ),
        },
      ]
    }

    return [
      {
        label: farmData?.token?.symbol.toUpperCase().replace('WBNB', 'BNB'),
        value: farmData?.token?.symbol,
        icon: (
          <Box width={20} height={20}>
            <TokenImage token={farmData?.token} width={20} height={20} />
          </Box>
        ),
      },
      {
        label: farmData?.token?.symbol.toUpperCase().replace('WBNB', 'BNB'),
        value: farmData?.token?.symbol,
        icon: (
          <Box width={20} height={20}>
            <TokenImage token={farmData?.token} width={20} height={20} />
          </Box>
        ),
      },
    ]
  }

  const debtProgressOptions = () => {
    return {
      debtRatio,
      liquidationThreshold,
      maxValue,
      quoteTokenSymbol,
      baseTokenSymbol,
      priceChangeText,
      priceChangeAbs
    }
  }

  const farmDetailsOptions = () => {
    return {
      totalApr: totalAprDisplay,
      noLeverageApy: getApy(yieldFarmData, tradeFee, huskyRewards, interestRatePerYear, 1),
      targetLeverageApy: getApy(yieldFarmData, tradeFee, huskyRewards, interestRatePerYear, leverageValue),
      assetBorrowed: isUndefined(farmingData) || isUndefined(farmingData[3]) ? 0 : farmingData[3],
      tokenInputNum: Number(tokenInput || 0),
      quoteTokenInputNum: Number(quoteTokenInput || 0),
      priceImpact: isUndefined(farmingData) || isUndefined(farmingData[4]) ? 0 : farmingData[4] * 100,
      tokenPosValue: isUndefined(farmingData) || isUndefined(farmingData[8]) ? 0 : farmingData[8],
      quoteTokenPosValue: isUndefined(farmingData) || isUndefined(farmingData[9]) ? 0 : farmingData[9],
      tradingFee,
      baseTokenSymbol,
      quoteTokenSymbol
    }
  }

  const farmBtnOptions = () => {
    return {
      approved: isApproved,
      disabled: (!account ||
        (tokenInput === undefined && quoteTokenInput === undefined) ||
        (Number(tokenInput) === 0 && Number(quoteTokenInput) === 0) ||
        (Number(leverageValue) !== 1 ? new BigNumber(farmingData[3]).lt(minimumDebt) : false)),
      ltMinimumDebt: new BigNumber(farmingData[3]).lt(minimumDebt),
      isBnbInput: isUndefined(bnbInput) ? 0 : bnbInput.length > 0,
      leverage: leverageValue,
      miniDebt: minimumDebt,
      symbol: farmData?.token.symbol,
    }
  }
  const onApprove = async () => {
    let contract
    if (Number(tokenInput || 0) !== 0
      && Number(tokenInput || 0) > Number(farmData.userData.tokenAllowance)) {
      contract = tokenContract
    } else if (Number(quoteTokenInput || 0) !== 0
      && Number(quoteTokenInput || 0) > Number(farmData.userData.quoteTokenAllowance)) {
      contract = quoteTokenApproveContract
    }
    const tx = await contract.approve(vaultAddress, ethers.constants.MaxUint256)
    return tx.wait()
  }

  const onFarm = async () => {
    const abiCoder = ethers.utils.defaultAbiCoder
    const AssetsBorrowed = farmingData ? farmingData[3] : 0
    const minLPAmountValue = farmingData ? farmingData[12] : 0

    const maxReturn = 0
    let farmingTokenAmount
    let strategiesAddress
    let dataStrategy
    let dataWorker

    const minLPAmount = getDecimalAmount(new BigNumber(minLPAmountValue), 18)
      .toString()
      .replace(/\.(.*?\d*)/g, '') // minLPAmountValue.toString()
    if (Number(tokenInput || 0) !== 0 && Number(quoteTokenInput || 0) === 0) {
      console.info('base + single + token input ')
      strategiesAddress = farmData.strategies.StrategyAddAllBaseToken
      dataStrategy = ethers.utils.defaultAbiCoder.encode(['uint256', 'uint256'], ['1', '1'])
      dataWorker = ethers.utils.defaultAbiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
    } else {
      console.info('base + all ')
      farmingTokenAmount = getDecimalAmount(new BigNumber(quoteTokenInput || 0), 18)
        .toString()
        .replace(/\.(.*?\d*)/g, '') // (quoteTokenInput || 0)?.toString()

      strategiesAddress = farmData.strategies.StrategyAddTwoSidesOptimal
      dataStrategy = abiCoder.encode(['uint256', 'uint256', 'uint256'], [farmingTokenAmount, minLPAmount, '1'])
      dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
    }
    const amount = getDecimalAmount(new BigNumber(tokenInput || 0), 18)
      .toString()
      .replace(/\.(.*?\d*)/g, '')
    const loan = getDecimalAmount(new BigNumber(AssetsBorrowed), 18)
      .toString()
      .replace(/\.(.*?\d*)/g, '')
    const callOptions = {
      gasLimit: 3800000,
      value: radio.localeCompare(tokens.wbnb.symbol) === 0 ? amount : 0,
    }
    const tx = await callWithGasPrice(
      vaultContract,
      'work',
      [0, farmData?.workerAddress, amount, loan, maxReturn, dataWorker],
      callOptions,
    )
    return tx.wait()
  }

  return (
    <SPage>
      <Text bold fontSize="3" color="secondary" mx="auto">
        {t(
          `Farming ${baseTokenSymbol
            .toUpperCase()
            .replace('WBNB', 'BNB')
            .replace(' PANCAKESWAPWORKER', '')} Pools`,
        )}
      </Text>
      <SectionWrapper>
        <SectionLeft>
          <Flex>
            <BigText>{t('Collateral')}</BigText>
          </Flex>
          <Flex>
            <SmText>
              {t('To form a yield farming position,assets deposited will be converted to LPs based on a 50:50 ratio.')}
            </SmText>
          </Flex>

          <Flex flexDirection="column" justifyContent="space-between" flex="1" paddingTop="0!important">
            <FarmInputs
              token={farmData.quoteToken}
              balance={userQuoteTokenBalance}
              tokenInput={quoteTokenInput}
              buttonMenuIndex={quoteTokenButtonIndex}
              onTokenInput={handleQuoteTokenInput}
              onTokenInputToFraction={setQuoteTokenInputToFraction} />
            <FarmInputs
              token={farmData?.token}
              balance={userTokenBalance}
              tokenInput={tokenInput}
              buttonMenuIndex={tokenButtonIndex}
              onTokenInput={handleTokenInput}
              onTokenInputToFraction={setTokenInputToFraction} />

            <Flex alignItems="center" justifyContent="space-between" mt="20px" mb="20px">
              <NormalText>{t('Target Position Leverage')}</NormalText>
              <NormalText>{new BigNumber(leverageValue)?.toFixed(2, 1)}X</NormalText>
            </Flex>
            <Box>
              {/* <MoveBox move={margin}>
                <SmTextPur>{leverageValue}x</SmTextPur>
              </MoveBox> */}
              <Box style={{ width: '100%', position: 'relative' }}>
                <RangeInput
                  type="range"
                  min="1.0"
                  max={leverage}
                  step="0.01"
                  name="leverage"
                  value={leverageValue}
                  onChange={handleSliderChange}
                  list="leverage"
                  style={{ width: '100%' }}
                />
              </Box>
              {/*  NOTE: 3 is not the max value leverage can have, some go up to 6, 
              so you I'm dinamically generating the dots based on the leverage (farmData.leverage) */}
              <Flex justifyContent="space-between" mt="-22px" mb="10px">
                {getDots()}
              </Flex>
              <SText1>
                <datalist style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }} id="leverage">
                  {datalistOptions}
                </datalist>
              </SText1>
            </Box>
          </Flex>

          <Box>
            <Text fontWeight="500" color="textFarm" fontSize="12px">
              {t('Which asset would you like to borrow?')}
            </Text>
            <SFlex2 mt="20px">
              <SSelect options={options()} onChange={(option) => setRadio(option.value)} />
            </SFlex2>
          </Box>
        </SectionLeft>

        <SectionRight className="sideSection">
          {farmingType === 'single' ? null : <DebtProgress options={debtProgressOptions()} />}
          <FarmDetails options={farmDetailsOptions()} />
          <FarmButton options={farmBtnOptions()} onApprove={() => onApprove()} onFarm={() => onFarm()} />
        </SectionRight>
      </SectionWrapper>

    </SPage>
  )
}

export default TwoSidesOptimal
