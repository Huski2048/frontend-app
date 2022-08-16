/* eslint-disable array-callback-return */
/* eslint-disable no-restricted-properties */
import React, { useState, useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import Page from 'components/Layout/Page'
import {
  Box,
  Button,
  Flex,
  Text,
  ChevronRightIcon,
  AutoRenewIcon,
  useMatchBreakpoints,
} from 'husky-uikit'
import styled, { useTheme } from 'styled-components'
import { useCakePrice, useFarmMasterChefData, useFarmTokensLpData, useFarmPancakeLpData, useHuskiPrice, useFarmFromWorker } from 'state/leverage/hooks'
import { usePoolVaultData, usePoolFairLaunchData, usePoolVaultConfigData } from 'state/pool/hooks'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { getAddress } from 'utils/addressHelpers'
import { getBalanceAmount, getDecimalAmount } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { TRADE_FEE, BIG_TEN } from 'config'
import { ethers } from 'ethers'
import { useTranslation } from 'contexts/Localization'
import { useVault } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useWeb3React } from '@web3-react/core'
import { TokenImage, TokenPairImage } from 'components/TokenImage'
import { useTradeFeesFromPid } from 'state/graph/hooks'
import DebtRatioProgress from 'components/DebRatioProgress'
import InfoItem from 'components/InfoItem'
import { getHuskyRewards, getYieldFarming, getAdjustData, getAdjustPositionRepayDebt } from '../helpers'
import AddCollateralRepayDebtContainer from './components/AddCollateralRepayDebtContainer'
import { PercentageToCloseContext, AddCollateralContext, ConvertToContext } from './context'
import RepayDebtDetails from './components/RepayDebtDetails'
import NormalDetails from './components/NormalDetails'
import LeverageSlider from './components/LeverageSlider'

interface LocationParams {
  data: any
  liquidationThresholdData: number
}

const Section = styled(Box)`
  &:first-of-type {
    background-color: ${({ theme }) => theme.colors.disabled};
  }
  background-color: ${({ theme }) => theme.card.background}!important;
  box-shadow: ${({ theme }) => theme.card.boxShadow};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 0.5rem 1.5rem;
  &:not(:first-child) {
    > ${Flex} {
      padding: 1.3rem 0;
      &:not(:last-child) {
        border-bottom: 1px solid #a41ff81a;
      }
    }
  }
  &:first-child {
    > ${Flex} {
      padding: 1.3rem 0;
      &:not(:last-child) {
        border-bottom: 1px solid #a41ff81a;
      }
    }
  }
  input[type='range'].unstyledRangeInput {
    -webkit-appearance: auto;
  }
`

const BorrowingMoreContainer = styled(Flex)`
  border: 1px solid #efefef;
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 10px;
  gap: 1.2rem;
  input {
    border: none;
    box-shadow: none;
    &:focus:not(:disabled) {
      box-shadow: none;
    }
  }
`
const MainText = styled(Text)`
  font-size: 12px;
  ${({ theme }) => theme.mediaQueries.xxl} {
    font-size: 14px;
  }
  span {
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

const AdjustPosition = () => {
  BigNumber.config({ EXPONENTIAL_AT: 1e9 })
  const {
    state: { data, liquidationThresholdData },
  } = useLocation<LocationParams>()
  const history = useHistory()

  const { t } = useTranslation()
  const [quoteTokenInput, setQuoteTokenInput] = useState<string>()
  const [tokenInput, setTokenInput] = useState<string>()

  const { positionId, debtValue, lpAmount, positionValueBase, worker } = data
  const farmData = useFarmFromWorker(worker)
  const {
    lpSymbol,
    tokenPriceUsd,
    quoteTokenPriceUsd,
    leverage,
    workerAddress,
    strategies,
    token,
    quoteToken,
    pool,
    pid
  } = farmData
  const vaultAddress = getAddress(pool.address)
  const vaultContract = useVault(vaultAddress)
  const { callWithGasPrice } = useCallWithGasPrice()
  const { vaultDebtVal, interestRatePerYear } = usePoolVaultData(pool.pid)
  const { debtPoolRewardPerBlock } = usePoolFairLaunchData(pool.pid)
  const { totalSupply } = useFarmPancakeLpData(pid, pool.pid)
  const { tokenAmountTotal, quoteTokenAmountTotal, lpTotalInQuoteToken } = useFarmTokensLpData(pid, pool.pid)
  const { poolWeight } = useFarmMasterChefData(pid, pool.pid)
  const { minDebtSize } = usePoolVaultConfigData(pool.pid)
  const { balance: bnbBalance } = useGetBnbBalance()
  const { balance: tokenBalance } = useTokenBalance(getAddress(token.address))
  const { balance: quoteTokenBalance } = useTokenBalance(getAddress(quoteToken.address))
  const { tradingFee: tradeFee } = useTradeFeesFromPid(farmData.pid)

  const lptotalSupplyNum = new BigNumber(totalSupply)
  const symbolName = token?.symbol.replace('wBNB', 'BNB')
  const lpSymbolName = lpSymbol.replace(' PancakeswapWorker', '')
  const tokenSymbol = token?.symbol.replace('wBNB', 'BNB')
  const quoteTokenSymbol = quoteToken?.symbol.replace('wBNB', 'BNB')
  const baseTokenAmount = (Number(tokenAmountTotal) / Number(lptotalSupplyNum)) * lpAmount
  const farmTokenAmount = (Number(quoteTokenAmountTotal) / Number(lptotalSupplyNum)) * lpAmount
  const basetokenBegin = parseInt(tokenAmountTotal)
  const farmingtokenBegin = parseInt(quoteTokenAmountTotal)
  // workerAddress = address
  const withdrawMinimizeTradingAddress = strategies.StrategyPartialCloseMinimizeTrading
  const partialCloseLiquidateAddress = strategies.StrategyPartialCloseLiquidate
  const strategyLiquidateAddress = strategies.StrategyLiquidate
  const strategyWithdrawMinimizeTradingAddress = strategies.StrategyWithdrawMinimizeTrading
  const contract = vaultContract
  const tokenInputValue = tokenInput || 0 // formatNumber(tokenInput)
  const quoteTokenInputValue = quoteTokenInput || 0 // formatNumber(quoteTokenInput)
  const userTokenBalance = getBalanceAmount(token?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : tokenBalance)
  const userQuoteTokenBalance = getBalanceAmount(
    quoteToken?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : quoteTokenBalance,
  )
  const minimumDebt = new BigNumber(minDebtSize).div(new BigNumber(BIG_TEN).pow(18))
  const borrowingInterest = interestRatePerYear

  const totalPositionValueInToken = new BigNumber(positionValueBase).dividedBy(BIG_TEN.pow(18)) // positionValueBaseNumber
  const debtValueNumber = new BigNumber(debtValue).dividedBy(BIG_TEN.pow(18))
  const debtRatio = new BigNumber(debtValueNumber).div(new BigNumber(totalPositionValueInToken))
  const lvgAdjust = new BigNumber(baseTokenAmount)
    .times(2)
    .div(new BigNumber(baseTokenAmount).times(2).minus(new BigNumber(debtValueNumber)))
  const currentPositionLeverage = Number(lvgAdjust.toFixed(3, 1))
  const [targetPositionLeverage, setTargetPositionLeverage] = useState<number>(currentPositionLeverage)

  const { farmingData, repayDebtData } = getAdjustData(
    token,
    totalSupply,
    tokenAmountTotal,
    quoteTokenAmountTotal,
    data,
    targetPositionLeverage,
    tokenInputValue,
    quoteTokenInputValue,
    symbolName,
  )
  const adjustData = farmingData ? farmingData[1] : []

  const leverageAfter = new BigNumber(adjustData[10]).toFixed(2, 1)

  const [isAddCollateral, setIsAddCollateral] = useState(false)
  let assetsBorrowed
  let baseTokenInPosition
  let quoteTokenInPosition
  let updatedDebt
  let closeRatioValue // the ratio of position to close

  if (adjustData?.[3] === 0 && adjustData?.[11] === 0) {
    // use adjustData is ok ,add farmingData to strengthen the validation  && farmingData[0] === 0
    // use repayDebtData
    assetsBorrowed = repayDebtData?.[4]
    baseTokenInPosition = repayDebtData?.[2]
    quoteTokenInPosition = repayDebtData?.[3]
    updatedDebt = Number(debtValueNumber) - repayDebtData?.[4]
    closeRatioValue = repayDebtData?.[8]
  } else {
    assetsBorrowed = adjustData?.[3]
    baseTokenInPosition = adjustData?.[8]
    quoteTokenInPosition = adjustData?.[9]
    updatedDebt =
      isAddCollateral || targetPositionLeverage >= currentPositionLeverage
        ? adjustData?.[3] + Number(debtValueNumber)
        : Number(debtValueNumber) - repayDebtData?.[4]
    closeRatioValue = repayDebtData?.[8]
  }

  const UpdatedDebtData = new BigNumber(debtValueNumber).minus(updatedDebt)
  let UpdatedDebtValue = Number(UpdatedDebtData)
  if (UpdatedDebtValue < 0.000001) {
    UpdatedDebtValue = 0
  }

  let tradingFees = adjustData?.[5]
  if (tradingFees < 0 || tradingFees > 1 || tradingFees.toString() === 'NaN') {
    tradingFees = 0
  }
  let priceImpact = adjustData?.[4]
  if (priceImpact < 0.000001 || priceImpact > 1) {
    priceImpact = 0
  }

  if (assetsBorrowed < 0.000001) {
    assetsBorrowed = 0
  }

  const { isDark } = useTheme()
  // for apr
  const huskyPrice = useHuskiPrice()
  const cakePrice = useCakePrice()
  const yieldFarmData = getYieldFarming(
    quoteTokenPriceUsd,
    poolWeight,
    lpTotalInQuoteToken,
    new BigNumber(cakePrice))
  const huskyRewards = getHuskyRewards(
    vaultDebtVal,
    debtPoolRewardPerBlock,
    tokenPriceUsd,
    huskyPrice) * 100

  const yieldFarmAPR = yieldFarmData * Number(currentPositionLeverage)
  const tradingFeesAPR = Number(tradeFee) * 365 * Number(currentPositionLeverage)
  const huskiRewardsAPR = huskyRewards * (currentPositionLeverage - 1)
  const borrowingInterestAPR = borrowingInterest.times(currentPositionLeverage - 1)
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
  const adjustBorrowingInterestAPR = borrowingInterest.times(targetPositionLeverage - 1)
  const adjustedApr: number =
    Number(adjustedYieldFarmAPR) +
    Number(adjustedTradingFeesAPR) +
    Number(adjustHuskiRewardsAPR) -
    Number(adjustBorrowingInterestAPR)
  const adjustedApy = Math.pow(1 + adjustedApr / 100 / 365, 365) - 1

  const { toastError, toastSuccess, toastInfo } = useToast()
  const [isPending, setIsPending] = useState(false)
  const { account } = useWeb3React()

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
        toastSuccess(t('Successful!'), t('Your request was successfull'))
        history.push('/farms')
      }
    } catch (error) {
      console.info('error', error)
      toastError(t('Unsuccessful'), t('Something went wrong your request. Please try again...'))
    } finally {
      setIsPending(false)
      setTokenInput('')
      setQuoteTokenInput('')
    }
  }

  const handleConfirm = async () => {
    const id = positionId
    const abiCoder = ethers.utils.defaultAbiCoder
    const AssetsBorrowed = adjustData ? assetsBorrowed : debtValueNumber.toNumber()
    const loan = getDecimalAmount(new BigNumber(AssetsBorrowed), 18)
      .toString()
      .replace(/\.(.*?\d*)/g, '')
    // const minLPAmountValue = adjustData ? adjustData?.[12] : 0
    // const minLPAmount = minLPAmountValue.toString()
    // const minLPAmount = getDecimalAmount(new BigNumber(minLPAmountValue), 18)
    //   .toString()
    //   .replace(/\.(.*?\d*)/g, '')
    const maxReturn = 0

    let farmingTokenAmount
    let strategiesAddress
    let dataStrategy
    let dataWorker
    if (Number(tokenInputValue) !== 0 && Number(quoteTokenInputValue) === 0) {
      console.info('base + single + token input ')
      strategiesAddress = strategies.StrategyAddAllBaseToken
      dataStrategy = ethers.utils.defaultAbiCoder.encode(['uint256', 'uint256'], ['1', '1'])
      dataWorker = ethers.utils.defaultAbiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
    } else if (Number(tokenInputValue) === 0 && Number(quoteTokenInputValue) !== 0) {
      console.info('base + single + quote token input ')
      farmingTokenAmount = getDecimalAmount(new BigNumber(quoteTokenInputValue || 0), 18)
        .toString()
        .replace(/\.(.*?\d*)/g, '')
      strategiesAddress = strategies.StrategyAddTwoSidesOptimal
      dataStrategy = abiCoder.encode(['uint256', 'uint256', 'uint256'], [farmingTokenAmount, '1', '1'])
      dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
    } else {
      console.info('base + all ')
      farmingTokenAmount = getDecimalAmount(new BigNumber(quoteTokenInputValue || 0), 18)
        .toString()
        .replace(/\.(.*?\d*)/g, '')
      strategiesAddress = strategies.StrategyAddTwoSidesOptimal
      dataStrategy = abiCoder.encode(['uint256', 'uint256', 'uint256'], [farmingTokenAmount, '1', '1']) // [param.farmingTokenAmount, param.minLPAmount])
      dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
    }

    const amount = getDecimalAmount(new BigNumber(tokenInputValue || 0), 18)
      .toString()
      .replace(/\.(.*?\d*)/g, '')

    handleFarm(id, workerAddress, amount, loan, maxReturn, dataWorker)
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

    handleFarm(id, workerAddress, amount, loan, maxReturn, dataWorker)
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
      maxDebtRepay = Number(updatedDebt) > 0 ? Number(updatedDebt) : 0
      maxReturn = ethers.constants.MaxUint256
      maxDebtRepaymentValue = ethers.constants.MaxUint256
    } else {
      receive = 0
      closeRationum = closeRatioValue
      maxDebtRepay = Number(updatedDebt) > 0 ? Number(updatedDebt) : 0
      const maxDebtRepayment = getDecimalAmount(new BigNumber(maxDebtRepay), 18)
        .toString()
        .replace(/\.(.*?\d*)/g, '') // Number(maxDebtRepay).toString()
      maxReturn = maxDebtRepayment // ethers.utils.parseEther(maxDebtRepayment)
      maxDebtRepaymentValue = maxDebtRepayment // ethers.utils.parseEther(maxDebtRepayment)    try
    }

    const returnLpTokenValue = (lpAmount * closeRationum).toString()
    // const maxReturn = ethers.constants.MaxUint256;
    // const maxReturn = ethers.utils.parseEther(maxDebtRepayment);
    const minbasetoken = getDecimalAmount(new BigNumber(receive), 18)
      .toString()
      .replace(/\.(.*?\d*)/g, '') // Number(receive).toString()
    // const minbasetokenvalue = getDecimalAmount(new BigNumber((minbasetoken)), 18).toString()
    const dataStrategy = abiCoder.encode(
      ['uint256', 'uint256', 'uint256'],
      [returnLpTokenValue, maxDebtRepaymentValue, minbasetoken],
    )
    const dataWorker = abiCoder.encode(['address', 'bytes'], [partialCloseLiquidateAddress, dataStrategy])

    handleFarm(id, workerAddress, amount, loan, maxReturn, dataWorker)
  }

  const handleConfirmMinimize = async () => {
    if (percentageToClose === 100) {
      handleConfirmMinimizeAll()
    } else {
      handleConfirmMinimizePartial()
    }
  }

  const handleConfirmMinimizeAll = async () => {
    const id = positionId
    const amount = 0
    const loan = 0
    const abiCoder = ethers.utils.defaultAbiCoder
    const maxReturn = ethers.constants.MaxUint256
    const minfarmtoken = Number(minimumQuoteTokenReceive) > 0 ? Number(minimumQuoteTokenReceive) : 0 // (Number(convertedQuoteTokenValue) * 0.995).toString()
    const minfarmtokenValue = getDecimalAmount(new BigNumber(minfarmtoken), 18)
      .toString()
      .replace(/\.(.*?\d*)/g, '')
    const dataStrategy = abiCoder.encode(['uint256'], [minfarmtokenValue])
    const dataWorker = abiCoder.encode(['address', 'bytes'], [strategyWithdrawMinimizeTradingAddress, dataStrategy])

    handleFarm(id, workerAddress, amount, loan, maxReturn, dataWorker)
  }

  const handleConfirmMinimizePartial = async () => {
    const id = positionId
    const amount = 0
    const loan = 0
    const minfarmtoken = Number(minimumQuoteTokenReceive) > 0 ? Number(minimumQuoteTokenReceive) : 0
    const abiCoder = ethers.utils.defaultAbiCoder
    // const maxDebtRepay = Number(updatedDebt) > 0 ? Number(updatedDebt) : 0
    const closeRationum = closeRatio
    const returnLpTokenValue = (lpAmount * closeRationum).toString()
    // const maxDebtRepayment = Number(maxDebtRepay).toString()
    // const maxReturn = ethers.utils.parseEther(maxDebtRepayment);
    const maxReturn = ethers.constants.MaxUint256
    const minfarmtokenvalue = getDecimalAmount(new BigNumber(minfarmtoken), 18)
      .toString()
      .replace(/\.(.*?\d*)/g, '') // minfarmtoken.toString()
    // const dataStrategy = abiCoder.encode(['uint256', 'uint256', 'uint256'], [returnLpTokenValue, ethers.utils.parseEther(maxDebtRepayment), ethers.utils.parseEther(minfarmtokenvalue)]);
    const dataStrategy = abiCoder.encode(
      ['uint256', 'uint256', 'uint256'],
      [returnLpTokenValue, ethers.constants.MaxUint256, minfarmtokenvalue],
    )
    const dataWorker = abiCoder.encode(['address', 'bytes'], [withdrawMinimizeTradingAddress, dataStrategy])

    handleFarm(id, workerAddress, amount, loan, maxReturn, dataWorker)
  }

  const handleSliderChange = (e) => {
    const value = e?.target?.value

    setTargetPositionLeverage(Number(value))
  }

  const [isConvertTo, setIsConvertTo] = useState<boolean>(true)
  const [percentageToClose, setPercentageToClose] = useState<number>(0)

  const {
    needCloseBase,
    needCloseFarm,
    remainBase,
    remainFarm,
    activePriceImpact,
    activeTradingFees,
    remainLeverage,
    amountToTrade,
    willReceive,
    minimumReceived,
    willTokenReceive,
    willQuoteTokenReceive,
    minimumTokenReceive,
    minimumQuoteTokenReceive,
    closeRatio,
  } = getAdjustPositionRepayDebt(
    totalSupply,
    tokenAmountTotal,
    quoteTokenAmountTotal,
    data,
    Number(tokenInput || quoteTokenInput ? leverageAfter : targetPositionLeverage),
    percentageToClose / 100,
    symbolName,
    isConvertTo,
  )

  const isAddCollateralConfirmDisabled = (() => {
    if (
      currentPositionLeverage > targetPositionLeverage ||
      (currentPositionLeverage === 1 && targetPositionLeverage === 1)
    ) {
      return Number(tokenInputValue) === 0 && Number(quoteTokenInputValue) === 0
    }
    if (currentPositionLeverage === 1 && targetPositionLeverage > currentPositionLeverage) {
      return new BigNumber(updatedDebt).lt(minimumDebt)
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
      return new BigNumber(UpdatedDebtValue).lt(minimumDebt)
    }
    return true
  })()

  // targetPositionLeverage === 1 && currentPositionLeverage === 1 ? Number(percentageToClose) === 0 : new BigNumber(UpdatedDebtValue).lt(minimumDebt)
  const isMinimizeTradingConfirmDisabled = (() => {
    if (targetPositionLeverage === 1 && currentPositionLeverage === 1) {
      return Number(percentageToClose) === 0
    }
    if (targetPositionLeverage === 1 && currentPositionLeverage !== 1) {
      return false
    }
    if (targetPositionLeverage !== 1) {
      return new BigNumber(UpdatedDebtValue).lt(minimumDebt)
    }
    return true
  })()

  const principal = 1
  const maxValue =
    1 -
    principal /
    (currentPositionLeverage > Number(farmData.leverage) ? currentPositionLeverage : farmData.leverage)
  const updatedDebtRatio =
    Number(targetPositionLeverage) === Number(currentPositionLeverage)
      ? debtRatio.toNumber()
      : 1 - principal / (remainLeverage || 1)

  // convert to
  const convertedAssetsValue =
    Number(needCloseBase) +
    basetokenBegin -
    (farmingtokenBegin * basetokenBegin) / (Number(needCloseFarm) * (1 - TRADE_FEE) + farmingtokenBegin)
  const convertedQuoteTokenValue = convertedAssetsValue - Number(debtValueNumber)

  // minimize trading
  let convertAmountToTrade = 0
  let convertedTokenValue
  // let tokenReceive = 0;
  if (Number(baseTokenAmount) >= Number(debtValueNumber)) {
    convertAmountToTrade = 0
  } else {
    convertAmountToTrade =
      ((basetokenBegin * farmingtokenBegin) / (basetokenBegin - Number(debtValueNumber) + Number(baseTokenAmount)) -
        farmingtokenBegin) /
      (1 - TRADE_FEE)
  }

  if (Number(baseTokenAmount) >= Number(debtValueNumber)) {
    convertedTokenValue = baseTokenAmount
  } else {
    convertedTokenValue = debtValueNumber
  }

  // if (Number(baseTokenAmount) >= Number(debtValueNumber)) {
  //   tokenReceive = Number(convertedTokenValue) - Number(debtValueNumber)
  // } else {
  //   tokenReceive = 0;
  // }

  // const convertedPositionValueMinimizeTrading = Number(farmTokenAmount) - convertAmountToTrade

  const datalistSteps = []
  const datalistOptions = (() => {
    const intervalValue = 0.1
    const listMaxValue = leverage < currentPositionLeverage ? currentPositionLeverage : leverage
    const listValue = (listMaxValue - 1) / (listMaxValue / intervalValue - 1 - 1)

    for (let i = 1; i < listMaxValue / intervalValue; i++) {
      datalistSteps.push(`${(1 + listValue * (i - 1)).toFixed(2)}`)
    }
    // datalistSteps.pop();
    return datalistSteps.map((value, i) => {
      if (i === datalistSteps.length - 1)
        return <option value={value} label="MAX" style={{ color: '#6F767E', fontWeight: 'bold', fontSize: '13px' }} />

      if (value * 10 % 5 === 0)
        return <option value={value} label={value + t('x')} style={{ color: '#6F767E', fontWeight: 'bold', fontSize: '13px' }} />

      return <option value={value} label=' ' style={{ color: '#6F767E', fontWeight: 'bold', fontSize: '13px' }} />
    })
  })()

  useEffect(() => {
    if (Number.isNaN(targetPositionLeverage)) {
      setTargetPositionLeverage(currentPositionLeverage)
    }
    if (currentPositionLeverage === 1 && targetPositionLeverage === 1) {
      setIsAddCollateral(false)
    }
  }, [setIsAddCollateral, targetPositionLeverage, currentPositionLeverage])

  const { isMobile, isTablet, isXxl } = useMatchBreakpoints()
  const isSmallScreen = isMobile || isTablet
  const shouldShowACRDContainer = (() => {
    if (targetPositionLeverage === 1 && currentPositionLeverage === 1) {
      return true
    }
    if (targetPositionLeverage === currentPositionLeverage && currentPositionLeverage !== 1) {
      return false
    }
    if (targetPositionLeverage > currentPositionLeverage) {
      return false
    }
    if (targetPositionLeverage < currentPositionLeverage) {
      return true
    }
    return false
  })()

  const showNotice = (() => {
    if (currentPositionLeverage === 1 && targetPositionLeverage > currentPositionLeverage) {
      return new BigNumber(updatedDebt).lt(minimumDebt)
    }
    if (targetPositionLeverage < currentPositionLeverage && targetPositionLeverage !== 1 && !isAddCollateral) {
      return new BigNumber(UpdatedDebtValue).lt(minimumDebt)
    }
    return false
  })()

  return (
    <AddCollateralContext.Provider value={{ isAddCollateral, handleIsAddCollateral: setIsAddCollateral }}>
      <ConvertToContext.Provider value={{ isConvertTo, handleIsConvertTo: setIsConvertTo }}>
        <PercentageToCloseContext.Provider
          value={{ percentage: percentageToClose, setPercentage: setPercentageToClose }}
        >
          <Page style={{ overflowX: 'hidden', minHeight: 'unset', paddingTop: '1rem' }}>
            <TitleText mx="auto">
              {t('Adjust Position')} {lpSymbolName.toUpperCase().replace('WBNB', 'BNB')}
            </TitleText>
            <Flex justifyContent="center" flexDirection={isSmallScreen ? 'column' : 'row'}>
              <Box width={isSmallScreen ? 'unset' : '60%'} maxWidth={850}>
                <Section>
                  <Flex alignItems="center" justifyContent="space-between" style={{ border: 'none' }} flexWrap="wrap">
                    <MainText mb="10px">
                      {t('Current Position Leverage')}: {new BigNumber(currentPositionLeverage).toFixed(2, 1)}x
                    </MainText>
                    <CurrentPostionToken>
                      <MainText mr="15px">{`${symbolName}#${positionId}`}</MainText>
                      <Box width={isXxl ? 24 : 18} height={isXxl ? 24 : 18} mr="10px">
                        <TokenPairImage
                          primaryToken={token}
                          secondaryToken={token}
                          width={isXxl ? 24 : 18}
                          height={isXxl ? 24 : 18}
                        />
                      </Box>
                      <Box>
                        <MainText>{lpSymbolName.toUpperCase().replace('WBNB', 'BNB')}</MainText>
                        <SubText>{farmData.lpExchange}</SubText>
                      </Box>
                    </CurrentPostionToken>
                  </Flex>
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    border="none!important"
                    paddingTop="0!important"
                  >
                    <MainText>
                      {t('Target Position Leverage')}:{' '}
                      {tokenInput || quoteTokenInput
                        ? leverageAfter
                        : new BigNumber(targetPositionLeverage).toFixed(2, 1)}
                      x
                    </MainText>
                    <PositionX ml="auto">
                      <SubText textAlign="center" lineHeight="24px">
                        {new BigNumber(targetPositionLeverage).toFixed(2, 1)}x
                      </SubText>
                    </PositionX>
                  </Flex>
                  
                  <LeverageSlider leverage={leverage} currentPositionLeverage={currentPositionLeverage}
                    targetPositionLeverage={targetPositionLeverage} datalistOptions={datalistOptions}
                    handleSliderChange={handleSliderChange} />

                  {showNotice ? (
                    <Flex width="100%" alignItems="center" justifyContent="center" border="none!important">
                      <MainText color="red">
                        {t(
                          'Your updated Debt Value is less than the minimum required debt which is %minimumDebt% %name%',
                          {
                            minimumDebt: minimumDebt.toNumber(),
                            name: tokenSymbol.toUpperCase().replace('WBNB', 'BNB'),
                          },
                        )}
                      </MainText>
                    </Flex>
                  ) : null}
                  {Number(targetPositionLeverage.toFixed(2)) > Number(currentPositionLeverage.toFixed(2)) && (
                    <Flex justifyContent="space-between" alignItems="center">
                      <Text>{t(`You're Borrowing More`)}</Text>
                      <BorrowingMoreContainer alignItems="center">
                        <Flex>
                          <Box width={24} height={24} mr="4px">
                            <TokenImage token={token} width={24} height={24} />
                          </Box>
                          <Text>{assetsBorrowed.toFixed(2)}</Text>
                        </Flex>
                        <Text>{symbolName}</Text>
                      </BorrowingMoreContainer>
                    </Flex>
                  )}
                  {shouldShowACRDContainer ? (
                    <AddCollateralRepayDebtContainer
                      currentPositionLeverage={Number(currentPositionLeverage)}
                      targetPositionLeverage={Number(targetPositionLeverage)}
                      userQuoteTokenBalance={userQuoteTokenBalance}
                      userTokenBalance={userTokenBalance}
                      quoteTokenName={
                        isAddCollateral ? quoteToken?.symbol.replace('wBNB', 'BNB') : quoteTokenSymbol
                      }
                      tokenName={isAddCollateral ? token?.symbol.replace('wBNB', 'BNB') : tokenSymbol}
                      quoteToken={isAddCollateral ? quoteToken : quoteToken}
                      token={isAddCollateral ? token : token}
                      tokenInput={tokenInput}
                      quoteTokenInput={quoteTokenInput}
                      setTokenInput={setTokenInput}
                      setQuoteTokenInput={setQuoteTokenInput}
                      symbolName={symbolName}
                      tokenPrice={tokenPriceUsd}
                      quoteTokenPrice={quoteTokenPriceUsd}
                      baseTokenAmountValue={baseTokenAmount}
                      farmTokenAmountValue={farmTokenAmount}
                      minimizeTradingValues={getAdjustPositionRepayDebt(
                        totalSupply,
                        tokenAmountTotal,
                        quoteTokenAmountTotal,
                        data,
                        Number(targetPositionLeverage),
                        percentageToClose / 100,
                        symbolName,
                      )}
                    />
                  ) : null}
                </Section>

                <Section mt="30px">
                  {
                    Number(targetPositionLeverage) <= Number(currentPositionLeverage)
                      ? isAddCollateral ?
                        <InfoItem
                          main={t('Collateral to be Added')}
                          value={(farmingData ? new BigNumber(tokenInputValue).toFixed(3, 1) + t(' ') + tokenSymbol
                            + t(' ') + t('+') + t(' ')
                            + new BigNumber(quoteTokenInputValue).toFixed(3, 1) + t(' ') + quoteTokenSymbol
                            : null)} />
                        : <InfoItem
                          main={t('Debt to be Repaid')}
                          value={(repayDebtData ? updatedDebt?.toFixed(3) + t(' ') + symbolName : null)} />
                      : null
                  }
                  {
                    Number(targetPositionLeverage) > Number(currentPositionLeverage)
                      ? <InfoItem
                        main={t('Debt Asset Borrowed')}
                        value={(adjustData ? assetsBorrowed?.toFixed(3) : debtValueNumber.toNumber().toPrecision(3)) + t(' ') + symbolName} />
                      : null
                  }
                  <InfoItem
                    main={t('Updated Debt')}
                    value={debtValueNumber.toNumber().toFixed(3) + t(' ') + symbolName}
                    toValue={isAddCollateral ? new BigNumber(updatedDebt)?.toFixed(3, 1) + t(' ') + symbolName : new BigNumber(debtValueNumber).minus(updatedDebt).toFixed(2, 1) + t(' ') + tokenSymbol} />

                  <InfoItem
                    main={t('Leverage (ratio)')}
                    value={debtRatio.times(100).toFixed(2, 1) + t('%') + t('(') + currentPositionLeverage + t('X)')}
                    toValue={(updatedDebtRatio * 100).toFixed(2) + t('%') + t('(') + (tokenInput || quoteTokenInput ? leverageAfter : Number(targetPositionLeverage).toFixed(2)) + t('X)')} />

                  <MainText>{t('My Debt Status')}</MainText>
                  <Flex height="130px" alignItems="center" style={{ border: 'none', paddingTop: 0 }}>
                    <DebtRatioProgress
                      debtRatio={updatedDebtRatio * 100}
                      liquidationThreshold={liquidationThresholdData}
                      max={maxValue * 100}
                    />
                  </Flex>

                  <Flex mx="auto" display="flex" justifyContent="center" paddingTop="0px!important">
                    {isAddCollateral && (
                      <AdjPosBtn
                        style={{ border: !isDark && '1px solid lightgray' }}
                        onClick={handleConfirm}
                        disabled={isAddCollateralConfirmDisabled || !account || isPending}
                        isLoading={isPending}
                        endIcon={isPending ? <AutoRenewIcon spin color="primary" /> : null}
                      >
                        {isPending ? t('Confirming') : t('Confirm')}
                      </AdjPosBtn>
                    )}
                    {!isAddCollateral && isConvertTo && (
                      <AdjPosBtn
                        style={{ border: !isDark && '1px solid lightgray' }}
                        onClick={handleConfirmConvertTo}
                        disabled={iscConvertToConfirmDisabled || !account || isPending}
                        isLoading={isPending}
                        endIcon={isPending ? <AutoRenewIcon spin color="primary" /> : null}
                      >
                        {isPending ? t('Confirming') : t('Confirm')}
                      </AdjPosBtn>
                    )}
                    {!isAddCollateral && !isConvertTo && (
                      <AdjPosBtn
                        onClick={handleConfirmMinimize}
                        disabled={isMinimizeTradingConfirmDisabled || !account || isPending}
                        isLoading={isPending}
                        endIcon={isPending ? <AutoRenewIcon spin color="primary" /> : null}
                      >
                        {isPending ? t('Confirming') : t('Confirm')}
                      </AdjPosBtn>
                    )}
                  </Flex>
                </Section>
              </Box>
              <Box
                width={isSmallScreen ? 'unset' : '38%'}
                mt={isSmallScreen ? '2rem' : 'unset'}
                maxWidth={isSmallScreen ? '100%' : 500}
                ml={isSmallScreen ? null : '40px'}
              >
                <Section mb="30px">
                  <InfoItem
                    main={t('Yields Farm APR')}
                    value={yieldFarmAPR ? yieldFarmAPR.toFixed(2) + t('%') : null}
                    toValue={adjustedYieldFarmAPR ? adjustedYieldFarmAPR.toFixed(2) + t('%') : null} />

                  <InfoItem
                    main={t('Trading Fees APR(7 DAYS average)')}
                    value={Number.isNaN(tradingFeesAPR) ? null : tradingFeesAPR.toFixed(2) + t('%')}
                    toValue={Number.isNaN(adjustedTradingFeesAPR) ? null : adjustedTradingFeesAPR.toFixed(2) + t('%')} />

                  <InfoItem
                    main={t('HUSKI Rewards APR')}
                    value={Number.isNaN(huskiRewardsAPR) ? null : huskiRewardsAPR.toFixed(2) + t('%')}
                    toValue={Number.isNaN(adjustHuskiRewardsAPR) ? null : adjustHuskiRewardsAPR.toFixed(2) + t('%')} />

                  <Flex justifyContent="space-between">
                    <MainText>{t('Borrowing Interest APR')}</MainText>
                    {adjustBorrowingInterestAPR ? (
                      <Flex alignItems="center">
                        <ValueText color="#FE7D5E">{borrowingInterestAPR.toFixed(2)}%</ValueText>
                        <ChevronRightIcon color="#FE7D5E" fontWeight="bold" />
                        <ValueText color="#FE7D5E">{adjustBorrowingInterestAPR.toFixed(2)}%</ValueText>
                      </Flex>
                    ) : (
                      <ValueText color="#FE7D5E">{borrowingInterestAPR.toFixed(2)}%</ValueText>
                    )}
                  </Flex>
                  <Flex flexDirection="column">
                    <InfoItem
                      main={t('APR')}
                      value={Number.isNaN(apr) ? null : apr.toFixed(2) + t('%')}
                      toValue={Number.isNaN(adjustedApr) ? null : adjustedApr.toFixed(2) + t('%')} />
                    <SubText>
                      {t('Yields Farm APR + Trading Fess APR + HUSKI Rewards APR - Borrowing Interest APR')}
                    </SubText>
                  </Flex>

                  <InfoItem
                    main={t('APY')}
                    value={Number.isNaN(apy) ? null : apy.toFixed(2) + t('%')}
                    toValue={Number.isNaN(adjustedApy) ? null : adjustedApy.toFixed(2) + t('%')} />
                </Section>

                {
                  !isAddCollateral && Number(targetPositionLeverage) <= Number(currentPositionLeverage.toFixed(2))
                    ? <RepayDebtDetails
                      options={
                        {
                          amountToTrade: Number(targetPositionLeverage) === 1 ? amountToTrade : (isConvertTo ? needCloseFarm : convertAmountToTrade),
                          activePriceImpact,
                          activeTradingFees,
                          convertedTokenValue,
                          convertedQuoteTokenValue,
                          convertedAssetsValue,
                          updatedDebt,
                          remainFarm,
                          remainBase,
                          willTokenReceive: Number(targetPositionLeverage) === 1 ? willTokenReceive : null,
                          willQuoteTokenReceive: Number(targetPositionLeverage) === 1 ? willQuoteTokenReceive : null,
                          willReceive: Number(targetPositionLeverage) === 1 ? willReceive : null,
                          minimumTokenReceive: Number(targetPositionLeverage) === 1 ? minimumTokenReceive : null,
                          minimumQuoteTokenReceive: Number(targetPositionLeverage) === 1 ? minimumQuoteTokenReceive : null,
                          minimumReceived: Number(targetPositionLeverage) === 1 ? minimumReceived : null,
                          tokenSymbol,
                          quoteTokenSymbol
                        }
                      }
                      isConvertTo={isConvertTo} />
                    : <NormalDetails
                      params={
                        {
                          tokenInputValue,
                          quoteTokenInputValue,
                          assetsBorrowed,
                          priceImpact,
                          tradingFees,
                          baseTokenInPosition,
                          quoteTokenInPosition,
                          tokenSymbol,
                          quoteTokenSymbol
                        }
                      }
                      isAddCollateral={isAddCollateral}
                      isAddLeverage={Number(targetPositionLeverage) > Number(currentPositionLeverage)} />
                }
              </Box>
            </Flex>
          </Page>
        </PercentageToCloseContext.Provider>
      </ConvertToContext.Provider>
    </AddCollateralContext.Provider>
  )
}

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
export default AdjustPosition
