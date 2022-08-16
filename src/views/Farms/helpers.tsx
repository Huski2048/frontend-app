/* eslint-disable no-restricted-properties */
import BigNumber from 'bignumber.js'
import {
  BIG_TEN,
  BIG_ZERO,
  CAKE_PER_YEAR,
  DEFAULT_TOKEN_DECIMAL,
  BLOCKS_PER_YEAR,
  LIQUIDATION_REWARDS,
  REINVEST_MINUTE,
  TRADE_FEE,
  CLOSE_POS_FEE,
  PANCAKE_TRADING_FEE,
  MAXIMUM_SOLD_PERCENTAGE,
  MINIMUM_RECEIVED_PERCENTAGE
} from 'config'
import { getPoolApr } from 'utils/apr'
import {
  dichotomybasetoken,
  dichotomyfarmingtoken,
  RunLogic,
  RunLogic1,
  adjustRun,
  adjustPositionRepayDebt
} from 'utils/service'

export const getApr = (yieldFarmData, tradeFee, huskyRewards, interestRatePerYear, lvg) => {
  return getPoolApr(yieldFarmData, tradeFee, huskyRewards, interestRatePerYear, lvg)
}

export const getApy = (yieldFarmData, tradeFee, huskyRewards, interestRatePerYear, lvg) => {
  const totalapr = getApr(yieldFarmData, tradeFee, huskyRewards, interestRatePerYear, lvg)
  // eslint-disable-next-line no-restricted-properties
  const totalapy = Math.pow(1 + totalapr / 365, 365) - 1
  return totalapy * 100
  
}
export const getDisplayApr = (cakeRewardsApr?: number) => {
  if (cakeRewardsApr) {
    return cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  return null
}


export const getHuskyRewards = (
  vaultDebtVal,
  debtPoolRewardPerBlock,
  tokenPriceUsd,
  huskiPriceBusd) => {
  // const { token, tokenPriceUsd, quoteTokenPriceUsd } = farm
  // const { vaultDebtVal } = usePoolVaultData(farm.pool.pid)
  // const { debtPoolRewardPerBlock } = usePoolFairLaunchData(farm.pool.pid)

  const vaultDebtValue = new BigNumber(vaultDebtVal)
  const poolHuskyPerBlock = new BigNumber(debtPoolRewardPerBlock)
  const busdTokenPrice: any = tokenPriceUsd
  const huskiPrice: any = huskiPriceBusd;

  const huskyRewards = BLOCKS_PER_YEAR.times(poolHuskyPerBlock.times(huskiPrice)).div((vaultDebtValue.times(busdTokenPrice)))
  return huskyRewards.toNumber();
}

export const getYieldFarming = (
  quoteTokenPriceUsd,
  poolWeight,
  lpTotalInQuoteToken,
  cakePrice: BigNumber) => {
  // const { quoteTokenPriceUsd } = farm
  // const { poolWeight } = useFarmMasterChefData(farm.pid, farm.pool.pid)
  // const { lpTotalInQuoteToken } = useFarmTokensLpData(farm.pid, farm.pool.pid)

  const poolLiquidityUsd = new BigNumber(lpTotalInQuoteToken).times(quoteTokenPriceUsd)
  const yearlyCakeRewardAllocation = CAKE_PER_YEAR.times(new BigNumber(poolWeight))
  const yieldFarmingApr = cakePrice && Number(poolLiquidityUsd) !== 0 ? yearlyCakeRewardAllocation.times(cakePrice).div(poolLiquidityUsd).times(100) : BIG_ZERO
  return yieldFarmingApr.toNumber();
}

export const getTvl = (
  tokenPriceUsd,
  quoteTokenPriceUsd,
  totalSupply,
  tokenAmountTotal,
  quoteTokenAmountTotal,
  workerInfo) => {
  // const { switchFlag, tokenPriceUsd, quoteTokenPriceUsd } = farm
  // const { totalSupply } = useFarmPancakeLpData(farm.pid, farm.pool.pid)
  // const { tokenAmountTotal, quoteTokenAmountTotal } = useFarmTokensLpData(farm.pid, farm.pool.pid)
  // const { workerInfo } = useFarmMasterChefData(farm.pid, farm.pool.pid)

  const lptotalSupply = new BigNumber(totalSupply)
  const tokenPriceInUsd = new BigNumber(tokenPriceUsd)
  const quoteTokenPriceInUsd = new BigNumber(quoteTokenPriceUsd)
  const tokensLPOne = new BigNumber(workerInfo).div(DEFAULT_TOKEN_DECIMAL)
  const lpTokenRatio = new BigNumber(workerInfo).div(lptotalSupply)
  const tokenNumOne = new BigNumber(tokenAmountTotal).times(lpTokenRatio)
  const quoteTokenNumOne = new BigNumber(quoteTokenAmountTotal).times(lpTokenRatio)
  const tokenTvl = new BigNumber(tokenNumOne).times(tokenPriceInUsd)
  const quoteTokenTvl = new BigNumber(quoteTokenNumOne).times(quoteTokenPriceInUsd)
  // const tokenTvl = new BigNumber(tokenAmountTotal).times(tokenPriceInUsd).times(lpTokenRatio)
  // const quoteTokenTvl = new BigNumber(quoteTokenAmountTotal).times(quoteTokenPriceInUsd).times(lpTokenRatio)
  const totalTvlOne = BigNumber.sum(tokenTvl, quoteTokenTvl)

  // const tokensLPAnother = new BigNumber(quoteTokenUserInfoLP).div(DEFAULT_TOKEN_DECIMAL)
  // const lpTokenRatioAnother = new BigNumber(quoteTokenUserInfoLP).div(lptotalSupply)
  // const tokenNumAnother = new BigNumber(tokenAmountTotal).times(lpTokenRatioAnother)
  // const quoteTokenNumAnother = new BigNumber(quoteTokenAmountTotal).times(lpTokenRatioAnother)
  // const tokenTvlAnother = new BigNumber(tokenNumAnother).times(tokenPriceInUsd)
  // const quoteTokenTvlAnother = new BigNumber(quoteTokenNumAnother).times(quoteTokenPriceInUsd)
  // const totalTvlAnother = BigNumber.sum(tokenTvlAnother, quoteTokenTvlAnother)

  // let tokensLP
  // let totalTvl
  // let tokenNum
  // let quoteTokenNum

  // if (switchFlag === 0) {
  //   tokensLP = BigNumber.sum(tokensLPOne, tokensLPAnother)
  //   totalTvl = BigNumber.sum(totalTvlOne, totalTvlAnother)
  //   tokenNum = BigNumber.sum(tokenNumOne, tokenNumAnother)
  //   quoteTokenNum = BigNumber.sum(quoteTokenNumOne, quoteTokenNumAnother)
  // } else {
  const tokensLP = tokensLPOne
  const totalTvl = totalTvlOne
  const tokenNum = tokenNumOne
  const quoteTokenNum = quoteTokenNumOne
  // }

  // console.log({
  //   tokenUserInfoLP, tokenNum, lpSymbol, totalTvl, 
  //   totalTvlOne, totalTvlAnother, tokensLPOne, tokensLPAnother,
  //   lptotalSupply, tokenAmountTotal, quoteTokenAmountTotal,
  //   tokenPriceUsd, quoteTokenPriceUsd, tokensLP, lpTokenRatio
  // })
  return { tokensLP, tokenNum, quoteTokenNum, totalTvl };
}

export const getLeverageFarmingData = (
  token,
  totalSupply,
  tokenAmountTotal,
  quoteTokenAmountTotal,
  leverage,
  tokenInput,
  quoteTokenInput,
  symbol?: string) => {
  // const { token } = farm
  // const { totalSupply } = useFarmPancakeLpData(farm.pid, farm.pool.pid)
  // const { tokenAmountTotal, quoteTokenAmountTotal } = useFarmTokensLpData(farm.pid, farm.pool.pid)
  const lptotalSupply = totalSupply

  let tokenAmountTotalNum
  let quoteTokenAmountTotalNum
  let tokenInputNum
  let quoteTokenInputNum
  if (symbol === token.symbol) {
    tokenInputNum = Number(tokenInput || 0);
    quoteTokenInputNum = Number(quoteTokenInput || 0);
    tokenAmountTotalNum = tokenAmountTotal;
    quoteTokenAmountTotalNum = quoteTokenAmountTotal;
  } else {
    tokenInputNum = Number(quoteTokenInput || 0);
    quoteTokenInputNum = Number(tokenInput || 0);
    tokenAmountTotalNum = quoteTokenAmountTotal;
    quoteTokenAmountTotalNum = tokenAmountTotal;
  }

  const lptotalSupplyNum = new BigNumber(lptotalSupply).dividedBy(BIG_TEN.pow(18)).toNumber()
  // console.log({ leverage, lptotalSupplyNum, lptotalSupply, tokenAmountTotal, quoteTokenAmountTotal, tokenInputNum, quoteTokenInputNum, 'tokenAmountTotalNum': parseFloat(tokenAmountTotalNum), 'quoteTokenAmountTotalNum': parseFloat(quoteTokenAmountTotalNum) })
  const farmdata1 = dichotomybasetoken(
    leverage, 
    TRADE_FEE, 
    tokenInputNum, 
    quoteTokenInputNum, 
    0, 0, 0, 
    parseFloat(tokenAmountTotalNum), 
    parseFloat(quoteTokenAmountTotalNum), 
    true, 
    lptotalSupplyNum)
  // console.info('======farmdata==11====', farmdata1);

  const farmdata2 = dichotomyfarmingtoken(
    leverage, 
    TRADE_FEE, 
    tokenInputNum, 
    quoteTokenInputNum, 
    0, 0, 0, 
    parseFloat(tokenAmountTotalNum), 
    parseFloat(quoteTokenAmountTotalNum), 
    true, 
    lptotalSupplyNum)
  // console.info('======farmdata===22===', farmdata2);

  let farmdata = [0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
  if (farmdata1[0] === 0 && farmdata1[1][3] === 0 && farmdata1[2] === 0) {
    farmdata = farmdata2;
  } else {
    farmdata = farmdata1;
  }

  return farmdata
}

export const getAdjustData = (
  token,
  totalSupply,
  tokenAmountTotal,
  quoteTokenAmountTotal,
  data,
  leverage,
  tokenInput,
  quoteTokenInput,
  tokenName?: string) => {// , flag?: boolean
  // const { token } = farm
  // const { totalSupply } = useFarmPancakeLpData(farm.pid, farm.pool.pid)
  // const { tokenAmountTotal, quoteTokenAmountTotal } = useFarmTokensLpData(farm.pid, farm.pool.pid)
  const lptotalSupply = totalSupply
  const { lpAmount } = data

  let tokenAmountTotalNum
  let quoteTokenAmountTotalNum
  let tokenInputNum
  let quoteTokenInputNum
  if (token?.symbol?.toUpperCase() === tokenName?.toUpperCase() || tokenName?.toUpperCase() === token?.symbol.toUpperCase().replace('WBNB', 'BNB')) {
    tokenInputNum = Number(tokenInput || 0);
    quoteTokenInputNum = Number(quoteTokenInput || 0);
    tokenAmountTotalNum = tokenAmountTotal;
    quoteTokenAmountTotalNum = quoteTokenAmountTotal;
  } else {
    tokenInputNum = Number(tokenInput || 0);
    quoteTokenInputNum = Number(quoteTokenInput || 0);
    tokenAmountTotalNum = quoteTokenAmountTotal;
    quoteTokenAmountTotalNum = tokenAmountTotal;
  }

  const lptotalSupplyNum = new BigNumber(lptotalSupply)
  const lptotalSupplyNumber = new BigNumber(lptotalSupply).dividedBy(BIG_TEN.pow(18)).toNumber()
  const baseTokenAmount = Number(tokenAmountTotalNum) / Number(lptotalSupplyNum) * lpAmount
  const farmTokenAmount = Number(quoteTokenAmountTotalNum) / Number(lptotalSupplyNum) * lpAmount

  const debtValueData = data.debtValue
  // const baseTokenAmount = new BigNumber(tokenAmountTotalNum).div(new BigNumber(lptotalSupply)).times(lpAmount)
  // const farmTokenAmount = new BigNumber(quoteTokenAmountTotalNum).div(new BigNumber(lptotalSupply)).times(lpAmount)
  const debtValue = new BigNumber(debtValueData).dividedBy(BIG_TEN.pow(18))

  const basetokenlp = baseTokenAmount// .toNumber()
  const farmingtokenlp = farmTokenAmount// .toNumber()
  const basetokenlpborrowed = debtValue.toNumber()

  // const tradeFee = 0.0025
  // const ClosePosFee = 5 / 100 / 100;
  // const PancakeTradingFee = 0.25 / 100;
  const ClosePositionPercentage = 0;

  const currentLeverage = 1 + basetokenlpborrowed / (2 * basetokenlp - basetokenlpborrowed)

  let farmingData;
  let repayDebtData = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  if (leverage.toPrecision(3) > currentLeverage.toPrecision(3)) {// right

    tokenInputNum = 0
    quoteTokenInputNum = 0

    const farmdata1 = dichotomybasetoken(leverage, TRADE_FEE, tokenInputNum, quoteTokenInputNum, basetokenlp, farmingtokenlp, basetokenlpborrowed, parseFloat(tokenAmountTotalNum), parseFloat(quoteTokenAmountTotalNum), true, lptotalSupplyNumber)

    const farmdata2 = dichotomyfarmingtoken(leverage, TRADE_FEE, tokenInputNum, quoteTokenInputNum, basetokenlp, farmingtokenlp, basetokenlpborrowed, parseFloat(tokenAmountTotalNum), parseFloat(quoteTokenAmountTotalNum), true, lptotalSupplyNumber)


    if (farmdata1[0] === 0 && farmdata1[1][3] === 0 && farmdata1[2] === 0 && farmdata2[0] === 0 && farmdata2[1][3] === 0 && farmdata2[2] === 0) {
      const { data: fData, repayDebt } = adjustRun(leverage, TRADE_FEE, tokenInputNum, quoteTokenInputNum, basetokenlp, farmingtokenlp, basetokenlpborrowed, parseFloat(tokenAmountTotalNum), parseFloat(quoteTokenAmountTotalNum), false, leverage, ClosePositionPercentage, CLOSE_POS_FEE, PANCAKE_TRADING_FEE, lptotalSupplyNumber)
      farmingData = fData;
      repayDebtData = repayDebt

    } else if (farmdata1[0] === 0 && farmdata1[1][3] === 0 && farmdata1[2] === 0) {
      farmingData = farmdata2;
    } else {
      farmingData = farmdata1;
    }


  } else {// left

    const farmdata1 = dichotomybasetoken(leverage, TRADE_FEE, tokenInputNum, quoteTokenInputNum, basetokenlp, farmingtokenlp, basetokenlpborrowed, parseFloat(tokenAmountTotalNum), parseFloat(quoteTokenAmountTotalNum), false, lptotalSupplyNumber)
    farmingData = farmdata1;
    if (farmdata1[0] === 0 && farmdata1[1][3] === 0 && farmdata1[2] === 0) {
      const farmdata2 = dichotomyfarmingtoken(leverage, TRADE_FEE, tokenInputNum, quoteTokenInputNum, basetokenlp, farmingtokenlp, basetokenlpborrowed, parseFloat(tokenAmountTotalNum), parseFloat(quoteTokenAmountTotalNum), false, lptotalSupplyNumber)
      farmingData = farmdata2;
      if (farmdata2[1][10] > leverage) {
        const basetokenlpnew = farmdata2[1][2] + tokenInputNum + farmdata2[1][3] + farmdata2[1][6]
        const farmingtokenlpnew = quoteTokenInputNum - farmdata2[0] + farmdata2[1][7]
        const basetokenlpborrowednew = basetokenlpborrowed + farmdata2[1][3]

        const repayDebt = adjustPositionRepayDebt(basetokenlpnew, farmingtokenlpnew, basetokenlpborrowednew, parseFloat(tokenAmountTotalNum), parseFloat(quoteTokenAmountTotalNum), leverage, ClosePositionPercentage, CLOSE_POS_FEE, PANCAKE_TRADING_FEE)

        repayDebtData = repayDebt
      }
    } else if (farmdata1[1][10] > leverage) {


      const basetokenlpnew = tokenInputNum + farmdata1[1][3] - farmdata1[0] + farmdata1[1][6]
      const farmingtokenlpnew = farmdata1[1][2] + quoteTokenInputNum + farmdata1[1][7]
      const basetokenlpborrowednew = basetokenlpborrowed + farmdata1[1][3]
      const repayDebt = adjustPositionRepayDebt(basetokenlpnew, farmingtokenlpnew, basetokenlpborrowednew, parseFloat(tokenAmountTotalNum), parseFloat(quoteTokenAmountTotalNum), leverage, ClosePositionPercentage, CLOSE_POS_FEE, PANCAKE_TRADING_FEE)

      repayDebtData = repayDebt
    } else {
      farmingData = farmdata1
    }


  }

  return { farmingData, repayDebtData }
}

const mathematics1 = 0.1;
const mathematics2 = 4 / 55;
const mathematics3 = 92 / 5;
const mathematics1B = 3 / 40;
const mathematics2B = 3 / 55;
const mathematics3B = 94 / 5;

export const getBorrowingInterest = (
  token,
  totalToken,
  vaultDebtVal) => {
  // const { token } = farm
  // const { totalToken, vaultDebtVal } = usePoolVaultData(farm.pool.pid)

  // let totalTokenValue
  // let vaultDebtValue
  // let tokenSymbol
  const totalTokenValue = totalToken
  const vaultDebtValue = vaultDebtVal
  const tokenSymbol = token?.symbol.toUpperCase()

  const utilization = parseInt(totalTokenValue) > 0 ? parseInt(vaultDebtValue) / parseInt(totalTokenValue) : 0;

  let lendRate = 0;

  if (tokenSymbol === 'WBNB' || tokenSymbol === 'BNB' || tokenSymbol === 'BUSD' || tokenSymbol === 'USDT' || tokenSymbol === 'HUSKI' || tokenSymbol === 'ALPACA') {
    if (utilization < 0.4) {
      lendRate = mathematics1B * utilization * 100;
    } else if (utilization > 0.95) {
      lendRate = mathematics3B * utilization * 100 - 1740;
    } else {
      lendRate = mathematics2B * utilization * 100 + 12 / 11;
    }
  } else if (tokenSymbol === 'BTCB' || tokenSymbol === 'ETH') {
    if (utilization < 0.4) {
      lendRate = mathematics1 * utilization * 100;
    } else if (utilization > 0.95) {
      lendRate = mathematics3 * utilization * 100 - 1780;
    } else {
      lendRate = mathematics2 * utilization * 100 + 9 / 11;
    }
  }

  const borrowingInterest = lendRate / (utilization * 100) / (1 - 0.16)
  return { borrowingInterest };
}


export const getAdjustPositionRepayDebt = (
  totalSupply,
  tokenAmountTotal,
  quoteTokenAmountTotal,
  data,
  leverage,
  ClosePositionPercentage,
  tokenName?: string,
  isConvertTo?) => {
  // const { tokenAmountTotal, quoteTokenAmountTotal } = useFarmTokensLpData(farm.pid, farm.pool.pid)
  // const { totalSupply } = useFarmPancakeLpData(farm.pid, farm.pool.pid)
  const lptotalSupply = totalSupply
  // const { quoteToken } = TokenInfo
  // let tokenAmountTotalValue
  // let quoteTokenAmountTotalValue
  // if (tokenName?.toUpperCase() === quoteToken?.symbol.toUpperCase() || tokenName?.toUpperCase() === quoteToken?.symbol.replace('wBNB', 'BNB').toUpperCase()) {
  //   tokenAmountTotalValue = quoteTokenAmountTotal
  //   quoteTokenAmountTotalValue = tokenAmountTotal
  // } else {
  const tokenAmountTotalValue = tokenAmountTotal
  const quoteTokenAmountTotalValue = quoteTokenAmountTotal
  // }

  const { lpAmount } = data
  const debtValueData = data.debtValue
  const lptotalSupplyNum = new BigNumber(lptotalSupply)
  const baseTokenAmount = Number(tokenAmountTotalValue) / Number(lptotalSupplyNum) * lpAmount
  const farmTokenAmount = Number(quoteTokenAmountTotalValue) / Number(lptotalSupplyNum) * lpAmount
  // const baseTokenAmount = new BigNumber(tokenAmountTotalValue).div(new BigNumber(lptotalSupply)).times(lpAmount)
  // const farmTokenAmount = new BigNumber(quoteTokenAmountTotalValue).div(new BigNumber(lptotalSupply)).times(lpAmount)
  const debtValue = new BigNumber(debtValueData).dividedBy(BIG_TEN.pow(18))
  const basetokenlp = baseTokenAmount // .toNumber()
  const farmingtokenlp = farmTokenAmount // .toNumber()
  const basetokenlpborrowed = debtValue.toNumber()

  const ClosePosFee = CLOSE_POS_FEE // 5 / 100 / 100; // 咱们是万5， alpaca是0
  const PancakeTradingFee = PANCAKE_TRADING_FEE // 0.25 / 100;
  const basetokenBegin = parseFloat(tokenAmountTotalValue)
  const farmingtokenBegin = parseFloat(quoteTokenAmountTotalValue)

  // const MinimumReceivedPercentage = 1 - 5 / 1000
  // const MaximumSoldPercentage = 1 + 4 / 1000

  const num0 = (leverage - 1) / leverage * (basetokenlp + farmingtokenlp / farmingtokenBegin * basetokenBegin)
  const num1 = (basetokenlp * (1 - ClosePosFee) - num0)
  const num2 = num0 - basetokenlpborrowed + basetokenBegin
  const num3 = farmingtokenlp * (1 - ClosePosFee) * (1 - PancakeTradingFee)
  const numA = num1 * num3
  const numB = (num1 * farmingtokenBegin + num3 * num2)
  const numC = (num2 - basetokenBegin) * farmingtokenBegin
  let rationum
  rationum = (0 - numB + (numB ** 2 - 4 * numA * numC) ** 0.5) / 2 / numA

  let activeTradingFees
  let activePriceImpact
  let needCloseBase
  let needCloseFarm
  let remainBase
  let remainFarm
  let remainBorrowBase = 0;
  let remainLeverage = 1;
  let amountToTrade = 0;
  let willReceive = 0
  let minimumReceived = 0
  let willTokenReceive = 0
  let willQuoteTokenReceive = 0
  let minimumTokenReceive = 0
  let minimumQuoteTokenReceive = 0
  let bastokennum
  let closeRatio

  if (leverage > 1) {
    closeRatio = rationum
    activeTradingFees = amountToTrade * PancakeTradingFee * basetokenBegin / farmingtokenBegin / (2 * basetokenlp - basetokenlpborrowed)
    activePriceImpact = farmingtokenlp * rationum * (1 - PancakeTradingFee) / (farmingtokenlp * rationum * (1 - PancakeTradingFee) + farmingtokenBegin)
    needCloseBase = basetokenlp * rationum
    needCloseFarm = farmingtokenlp * rationum
    const repaydebtnum = basetokenlp * rationum * (1 - ClosePosFee) + basetokenBegin - farmingtokenBegin * basetokenBegin / (farmingtokenlp * rationum * (1 - ClosePosFee) * (1 - PancakeTradingFee) + farmingtokenBegin)
    remainBase = basetokenlp * (1 - rationum)
    remainFarm = farmingtokenlp * (1 - rationum)
    remainBorrowBase = basetokenlpborrowed - repaydebtnum
    remainLeverage = (basetokenlpborrowed - repaydebtnum) / (basetokenlp * (1 - rationum) + farmingtokenlp * (1 - rationum) / farmingtokenBegin * basetokenBegin - (basetokenlpborrowed - repaydebtnum)) + 1
  } else if (Number(leverage) === 1) {

    if (isConvertTo) {
      const params1 = farmingtokenlp * (1 - ClosePosFee) * (1 - PancakeTradingFee)
      const paramsa = 0 - basetokenlp * (1 - ClosePosFee) * params1 * (1 - ClosePositionPercentage)
      const paramsb = basetokenlpborrowed * params1 * (1 - ClosePositionPercentage) - basetokenBegin * params1 - basetokenlp * (1 - ClosePosFee) * (params1 * ClosePositionPercentage + farmingtokenBegin)
      const paramsc = basetokenlpborrowed * (params1 * ClosePositionPercentage + farmingtokenBegin)
      if (paramsa === 0) {
        rationum = paramsc / paramsb
      } else {
        rationum = (0 - paramsb - (paramsb ** 2 - 4 * paramsa * paramsc) ** 0.5) / 2 / paramsa
      }
      closeRatio = rationum + (1 - rationum) * ClosePositionPercentage
      needCloseBase = basetokenlp * (rationum + (1 - rationum) * ClosePositionPercentage)
      needCloseFarm = farmingtokenlp * (rationum + (1 - rationum) * ClosePositionPercentage)
      remainBase = basetokenlp * (1 - rationum) * (1 - ClosePositionPercentage)
      remainFarm = farmingtokenlp * (1 - rationum) * (1 - ClosePositionPercentage)
      amountToTrade = farmingtokenlp * (rationum + (1 - rationum) * ClosePositionPercentage) * (1 - ClosePosFee)
      activeTradingFees = amountToTrade * PancakeTradingFee * basetokenBegin / farmingtokenBegin / (2 * basetokenlp - basetokenlpborrowed)
      activePriceImpact = amountToTrade * (1 - PancakeTradingFee) / (amountToTrade * (1 - PancakeTradingFee) + farmingtokenBegin)
      bastokennum = basetokenlp * (rationum + (1 - rationum) * ClosePositionPercentage) * (1 - ClosePosFee) + (basetokenBegin - basetokenBegin * farmingtokenBegin / (amountToTrade * (1 - PancakeTradingFee) + farmingtokenBegin))
      willReceive = bastokennum - basetokenlpborrowed
      minimumReceived = bastokennum * MINIMUM_RECEIVED_PERCENTAGE - basetokenlpborrowed

    } else {
      closeRatio = rationum + (1 - rationum) * ClosePositionPercentage
      needCloseBase = basetokenlp * (rationum + (1 - rationum) * ClosePositionPercentage)
      needCloseFarm = farmingtokenlp * (rationum + (1 - rationum) * ClosePositionPercentage)
      const remainingdebt = basetokenlpborrowed - basetokenlp * (rationum + (1 - rationum) * ClosePositionPercentage) * (1 - ClosePosFee)
      if (remainingdebt <= 0) {
        amountToTrade = 0
      } else {
        amountToTrade = (basetokenBegin * farmingtokenBegin / (basetokenBegin - remainingdebt) - farmingtokenBegin) / (1 - PancakeTradingFee)
      }
      remainBase = basetokenlp * (1 - rationum) * (1 - ClosePositionPercentage)
      remainFarm = farmingtokenlp * (1 - rationum) * (1 - ClosePositionPercentage)
      // print('偿还全部债务：', basetokenlpborrowed, basetoken_name)
      activeTradingFees = amountToTrade * PancakeTradingFee * basetokenBegin / farmingtokenBegin / (2 * basetokenlp - basetokenlpborrowed)
      activePriceImpact = amountToTrade * (1 - PancakeTradingFee) / (amountToTrade * (1 - PancakeTradingFee) + farmingtokenBegin)
      bastokennum = basetokenlp * (rationum + (1 - rationum) * ClosePositionPercentage) * (1 - ClosePosFee) + (basetokenBegin - basetokenBegin * farmingtokenBegin / (amountToTrade * (1 - PancakeTradingFee) + farmingtokenBegin))

      if (remainingdebt <= 0) {
        willTokenReceive = -remainingdebt
        willQuoteTokenReceive = farmingtokenlp * (rationum + (1 - rationum) * ClosePositionPercentage) * (1 - ClosePosFee)
        minimumTokenReceive = -remainingdebt
        minimumQuoteTokenReceive = farmingtokenlp * (rationum + (1 - rationum) * ClosePositionPercentage) * (1 - ClosePosFee)
      } else {
        willTokenReceive = 0
        willQuoteTokenReceive = farmingtokenlp * (rationum + (1 - rationum) * ClosePositionPercentage) * (1 - ClosePosFee) - amountToTrade
        minimumTokenReceive = 0
        minimumQuoteTokenReceive = farmingtokenlp * (rationum + (1 - rationum) * ClosePositionPercentage) * (1 - ClosePosFee) - amountToTrade * MAXIMUM_SOLD_PERCENTAGE
      }
    }

  }

  if (activePriceImpact < 0.000001) {
    activePriceImpact = 0
  }
  if (activeTradingFees < 0.000001) {
    activeTradingFees = 0
  }

  return {
    needCloseBase, needCloseFarm, remainBase, remainFarm, remainBorrowBase, activePriceImpact, activeTradingFees, remainLeverage, willReceive,
    amountToTrade, minimumReceived, willTokenReceive, willQuoteTokenReceive, minimumTokenReceive, minimumQuoteTokenReceive, closeRatio
  };
}


export const getPriceImpact = (
  token,
  tokenAmountTotal,
  quoteTokenAmountTotal,
  tokenInput,
  tokenName?: string) => {
  // const { token } = farm
  // const { tokenAmountTotal, quoteTokenAmountTotal } = useFarmTokensLpData(farm.pid, farm.pool.pid)

  let tokenAmountTotalNum
  let tokenInputNum
  if (token?.symbol?.toLowerCase() === tokenName?.toLowerCase() || token?.symbol?.replace('wBNB', 'BNB').toLowerCase() === tokenName?.toLowerCase()) {
    tokenInputNum = Number(tokenInput);
    tokenAmountTotalNum = tokenAmountTotal;
  } else {
    tokenInputNum = Number(tokenInput);
    tokenAmountTotalNum = quoteTokenAmountTotal;
  }

  const baseTokenEnd = new BigNumber(tokenInputNum).plus(new BigNumber(tokenAmountTotalNum))
  const priceImpact = new BigNumber(tokenInputNum).div(new BigNumber(baseTokenEnd))

  return priceImpact.toNumber()
}

export const getDrop = (
  totalSupply,
  token,
  liquidationThreshold,
  tokenAmountTotal,
  quoteTokenAmountTotal,
  data) => {
  const { lpAmount } = data
  // const { token, liquidationThreshold, quoteTokenLiquidationThreshold } = farm
  // const { tokenAmountTotal, quoteTokenAmountTotal } = useFarmTokensLpData(farm.pid, farm.pool.pid)
  // const { totalSupply } = useFarmPancakeLpData(farm.pid, farm.pool.pid)
  const lptotalSupply = totalSupply

  // let tokenAmountTotalNum
  // let quoteTokenAmountTotalNum
  // let liquidationRisk
  // if (token?.symbol?.toUpperCase() === tokenName?.toUpperCase() || tokenName?.toUpperCase() === token?.symbol.replace('wBNB', 'BNB').toUpperCase()) {
  // tokenAmountTotalNum = tokenAmountTotal;
  // quoteTokenAmountTotalNum = quoteTokenAmountTotal;
  // liquidationRisk = liquidationThreshold
  // } else {
  //   tokenAmountTotalNum = quoteTokenAmountTotal;
  //   quoteTokenAmountTotalNum = tokenAmountTotal;
  //   liquidationRisk = quoteTokenLiquidationThreshold
  // }

  const liquidationThresholdData = parseInt(liquidationThreshold) / 100 / 100
  const lptotalSupplyNum = new BigNumber(lptotalSupply)
  const baseTokenAmount = Number(tokenAmountTotal) / Number(lptotalSupplyNum) * lpAmount
  const farmTokenAmount = Number(quoteTokenAmountTotal) / Number(lptotalSupplyNum) * lpAmount

  const debtValueData = data.debtValue
  const debtValue = new BigNumber(debtValueData).dividedBy(BIG_TEN.pow(18))

  const basetokenlp = baseTokenAmount
  const farmingtokenlp = farmTokenAmount
  const basetokenlpborrowed = debtValue.toNumber()

  const liquidationPrice = farmingtokenlp * basetokenlp / (basetokenlpborrowed / liquidationThresholdData / 2) ** 2

  const dropValue = 1 / liquidationPrice / basetokenlp * farmingtokenlp

  const drop = (1 - dropValue) * 100

  // console.log({ drop1, dropValue, basetokenlp, farmingtokenlp, basetokenlpborrowed, drop, TokenInfo, lptotalSupply, tokenAmountTotal, quoteTokenAmountTotal, liquidationThreshold, quoteTokenLiquidationThreshold })
  return drop
}

export const getDropFarm = (
  token, quoteToken, liquidationThreshold, quoteTokenLiquidationThreshold,
  debtValueData, basetokenlp, farmingtokenlp, tokenName?: string) => {
  // const { token, quoteToken, liquidationThreshold, quoteTokenLiquidationThreshold } = farm
  let liquidationRisk
  let baseToken
  let farmToken
  let priceChange

  if (token?.symbol?.toUpperCase() === 'BUSD' || token?.symbol?.toUpperCase() === 'USDT' || token?.symbol?.toUpperCase() === 'USDC' ||
    quoteToken?.symbol?.toUpperCase() === 'BUSD' || quoteToken?.symbol?.toUpperCase() === 'USDT' || quoteToken?.symbol?.toUpperCase() === 'USDC'
  ) {
    // U 放 后
    if (token?.symbol?.toUpperCase() === 'BUSD' || token?.symbol?.toUpperCase() === 'USDT' || token?.symbol?.toUpperCase() === 'USDC') {
      liquidationRisk = liquidationThreshold
      baseToken = token?.symbol?.toUpperCase().replace("WBNB", "BNB")
      farmToken = quoteToken?.symbol?.toUpperCase().replace("WBNB", "BNB")
      const liquidationThresholdData = parseInt(liquidationRisk) / 100 / 100
      const liquidationPrice = debtValueData === 0 ? 0 : farmingtokenlp * basetokenlp / (debtValueData / liquidationThresholdData / 2) ** 2
      priceChange = 1 / liquidationPrice / basetokenlp * farmingtokenlp * 100 - 100
    }

    if (quoteToken?.symbol?.toUpperCase() === 'BUSD' || quoteToken?.symbol?.toUpperCase() === 'USDT' || quoteToken?.symbol?.toUpperCase() === 'USDC') {
      liquidationRisk = quoteTokenLiquidationThreshold
      baseToken = quoteToken?.symbol?.toUpperCase().replace("WBNB", "BNB")
      farmToken = token?.symbol?.toUpperCase().replace("WBNB", "BNB")
      const liquidationThresholdData = parseInt(liquidationRisk) / 100 / 100
      const liquidationPrice = debtValueData === 0 ? 0 : farmingtokenlp * basetokenlp / (debtValueData / liquidationThresholdData / 2) ** 2
      priceChange = liquidationPrice / farmingtokenlp * basetokenlp * 100 - 100
    }

  } else {
    // base在后
    // eslint-disable-next-line no-lonely-if
    if (token?.symbol?.toUpperCase() === tokenName?.toUpperCase() || tokenName?.toUpperCase() === token?.symbol.replace('wBNB', 'BNB').toUpperCase()) {
      liquidationRisk = liquidationThreshold
      baseToken = token?.symbol?.toUpperCase().replace("WBNB", "BNB")
      farmToken = quoteToken?.symbol?.toUpperCase().replace("WBNB", "BNB")
      const liquidationThresholdData = parseInt(liquidationRisk) / 100 / 100
      const liquidationPrice = debtValueData === 0 ? 0 : farmingtokenlp * basetokenlp / (debtValueData / liquidationThresholdData / 2) ** 2
      priceChange = 1 / liquidationPrice / basetokenlp * farmingtokenlp * 100 - 100
    } else {
      liquidationRisk = quoteTokenLiquidationThreshold
      baseToken = quoteToken?.symbol?.toUpperCase().replace("WBNB", "BNB")
      farmToken = token?.symbol?.toUpperCase().replace("WBNB", "BNB")
      const liquidationThresholdData = parseInt(liquidationRisk) / 100 / 100
      const liquidationPrice = debtValueData === 0 ? 0 : farmingtokenlp * basetokenlp / (debtValueData / liquidationThresholdData / 2) ** 2
      priceChange = liquidationPrice / farmingtokenlp * basetokenlp * 100 - 100
    }

  }

  // if (token?.symbol?.toUpperCase() === tokenName?.toUpperCase() || tokenName?.toUpperCase() === token?.symbol.replace('wBNB', 'BNB').toUpperCase()) {
  //   liquidationRisk = liquidationThreshold
  // } else {
  //   liquidationRisk = quoteTokenLiquidationThreshold
  // }

  // const liquidationThresholdData = parseInt(liquidationRisk) / 100 / 100
  // const liquidationPrice = debtValueData === 0 ? 0 : farmingtokenlp * basetokenlp / (debtValueData / liquidationThresholdData / 2) ** 2

  // let priceChange
  // priceChange = liquidationPrice / farmingtokenlp * basetokenlp * 100 - 100
  // let priceChangeText
  // if (priceChange >= 0) {
  //   priceChangeText = '涨'
  // } else {
  //   priceChangeText = '跌'
  // }
  // let priceChangeAbs
  // priceChangeAbs = Math.abs(priceChange)
  // console.info('当basetoken_name相对于farmingtoken_name', priceChangeText, priceChangeAbs, '% 时触发清算')

  // console.info('\n若价格改为farmingtoken以basetoken计价\n')

  // priceChange = 1 / liquidationPrice / basetokenlp * farmingtokenlp * 100 - 100
  // if (priceChange >= 0) {
  //   priceChangeText = '涨'
  // } else {
  //   priceChangeText = '跌'
  // }
  // priceChangeAbs = Math.abs(priceChange)

  // console.info('farmingtoken_name相对于basetoken_name', priceChangeText, priceChangeAbs, '% 时触发清算')


  // if (token?.symbol?.toUpperCase() === tokenName?.toUpperCase() || tokenName?.toUpperCase() === token?.symbol.replace('wBNB', 'BNB').toUpperCase()) {
  //   priceChange = 1 / liquidationPrice / basetokenlp * farmingtokenlp * 100 - 100
  // } else {
  //   priceChange = liquidationPrice / farmingtokenlp * basetokenlp * 100 - 100
  // }

  // 

  const decreasePct = priceChange.toFixed(2)

  return { decreasePct, baseToken, farmToken }
}

export const getRiseDropFarm = (
  // token, 
  liquidationThreshold, 
  // quoteTokenLiquidationThreshold,
  debtValueData,
   basetokenlp, 
   farmingtokenlp) => {

  // const { token, liquidationThreshold, quoteTokenLiquidationThreshold } = farm

  // let liquidationRisk
  // let priceChange

  // if (token?.symbol?.toUpperCase() === tokenName?.toUpperCase() || tokenName?.toUpperCase() === token?.symbol.replace('wBNB', 'BNB').toUpperCase()) {
  //   liquidationRisk = quoteTokenLiquidationThreshold
  //   const liquidationThresholdData = parseInt(liquidationRisk) / 100 / 100
  //   const liquidationPrice = debtValueData === 0 ? 0 : farmingtokenlp * basetokenlp / (debtValueData / liquidationThresholdData / 2) ** 2
  //   priceChange = liquidationPrice / farmingtokenlp * basetokenlp * 100 - 100
  // } else {
    const liquidationRisk = liquidationThreshold
    const liquidationThresholdData = parseInt(liquidationRisk) / 100 / 100
    const liquidationPrice = debtValueData === 0 ? 0 : farmingtokenlp * basetokenlp / (debtValueData / liquidationThresholdData / 2) ** 2
    const priceChange = 1 / liquidationPrice / basetokenlp * farmingtokenlp * 100 - 100
  // }

  const decreasePct = Number(priceChange.toFixed(2))

  return { decreasePct }
}

export const getDropFarmName = (token, quoteToken, tokenName?: string) => {
  // const { token, quoteToken } = farm
  let baseToken
  let farmToken

  if (token?.symbol?.toUpperCase() === 'BUSD' || token?.symbol?.toUpperCase() === 'USDT' || token?.symbol?.toUpperCase() === 'USDC' ||
    quoteToken?.symbol?.toUpperCase() === 'BUSD' || quoteToken?.symbol?.toUpperCase() === 'USDT' || quoteToken?.symbol?.toUpperCase() === 'USDC'
  ) {
    // U put it in the back
    if (token?.symbol?.toUpperCase() === 'BUSD' || token?.symbol?.toUpperCase() === 'USDT' || token?.symbol?.toUpperCase() === 'USDC') {
      baseToken = token?.symbol?.toUpperCase().replace("WBNB", "BNB")
      farmToken = quoteToken?.symbol?.toUpperCase().replace("WBNB", "BNB")
    }

    if (quoteToken?.symbol?.toUpperCase() === 'BUSD' || quoteToken?.symbol?.toUpperCase() === 'USDT' || quoteToken?.symbol?.toUpperCase() === 'USDC') {
      baseToken = quoteToken?.symbol?.toUpperCase().replace("WBNB", "BNB")
      farmToken = token?.symbol?.toUpperCase().replace("WBNB", "BNB")
    }

  } else {
    // base in the back 
    // eslint-disable-next-line no-lonely-if
    if (token?.symbol?.toUpperCase() === tokenName?.toUpperCase() || tokenName?.toUpperCase() === token?.symbol.replace('wBNB', 'BNB').toUpperCase()) {
      baseToken = token?.symbol?.toUpperCase().replace("WBNB", "BNB")
      farmToken = quoteToken?.symbol?.toUpperCase().replace("WBNB", "BNB")
    } else {
      baseToken = quoteToken?.symbol?.toUpperCase().replace("WBNB", "BNB")
      farmToken = token?.symbol?.toUpperCase().replace("WBNB", "BNB")
    }

  }

  return { baseToken, farmToken }
}
export const getProfitOrLossLeft = (
  pool,
  totalSupply,
  tokenAmountTotal,
  quoteTokenAmountTotal,
  data) => {
  // const { pool } = farm
  // const { totalSupply } = useFarmPancakeLpData(farm.pid, farm.pool.pid)
  // const { tokenAmountTotal, quoteTokenAmountTotal } = useFarmTokensLpData(farm.pid, farm.pool.pid)
  const lptotalSupply = totalSupply
  const { lpAmount } = data

  // let tokenAmountTotalNum
  // let quoteTokenAmountTotalNum

  // if (vault.toUpperCase() === pool.address.toUpperCase()) {
  const tokenAmountTotalNum = tokenAmountTotal;
  const quoteTokenAmountTotalNum = quoteTokenAmountTotal;
  // } else {
  //   tokenAmountTotalNum = quoteTokenAmountTotal;
  //   quoteTokenAmountTotalNum = tokenAmountTotal;
  // }

  const lptotalSupplyNum = new BigNumber(lptotalSupply)
  // kaicang position assets
  const baseTokenAmountLeft = Number(tokenAmountTotalNum) / Number(lptotalSupplyNum) * lpAmount
  const farmTokenAmountLeft = Number(quoteTokenAmountTotalNum) / Number(lptotalSupplyNum) * lpAmount
  const lpAmountLeft = 10
  const totalPositionValueLeft = 10
  const debtValueLeft = 10
  const equityValueTokenLeft = 10
  const equityValueUsdLeft = 10
  const entryBasePrice = 10
  const entryFarmPrice = 10

  return {
    lpAmountLeft, baseTokenAmountLeft, farmTokenAmountLeft, totalPositionValueLeft, debtValueLeft,
    equityValueTokenLeft, equityValueUsdLeft, entryBasePrice, entryFarmPrice
  }
}

export const getProfitOrLossRight = (
  quoteTokenPriceUsd, tokenPriceUsd, token, quoteToken, pool,
  totalSupply, tokenAmountTotal, quoteTokenAmountTotal,
  data) => {
  // const { quoteTokenPriceUsd, tokenPriceUsd, token, quoteToken, pool } = farm
  // const { totalSupply } = useFarmPancakeLpData(farm.pid, farm.pool.pid)
  // const { tokenAmountTotal, quoteTokenAmountTotal } = useFarmTokensLpData(farm.pid, farm.pool.pid)
  const lptotalSupply = totalSupply
  const { lpAmount, debtValue } = data

  // let tokenAmountTotalNum
  // let quoteTokenAmountTotalNum

  // if (token?.symbol?.toUpperCase() === tokenName?.toUpperCase() || tokenName?.toUpperCase() === token?.symbol.replace('wBNB', 'BNB').toUpperCase()) {
  // if (vault.toUpperCase() === pool.address.toUpperCase()) {
  const tokenAmountTotalNum = tokenAmountTotal;
  const quoteTokenAmountTotalNum = quoteTokenAmountTotal;
  // } else {
  //   tokenAmountTotalNum = quoteTokenAmountTotal;
  //   quoteTokenAmountTotalNum = tokenAmountTotal;
  // }

  const lptotalSupplyNum = new BigNumber(lptotalSupply)
  const lpAmountBigNumberRight = new BigNumber(lpAmount).dividedBy(BIG_TEN.pow(18))
  const lpAmountRight = Number(lpAmountBigNumberRight)

  const baseTokenAmountRight = Number(tokenAmountTotalNum) / Number(lptotalSupplyNum) * lpAmount
  const farmTokenAmountRight = Number(quoteTokenAmountTotalNum) / Number(lptotalSupplyNum) * lpAmount

  const debtValueBigNumberRight = new BigNumber(debtValue).dividedBy(BIG_TEN.pow(18))
  const debtValueRight = Number(debtValueBigNumberRight)

  // let currentBasePrice
  // let currentFarmPrice
  // let baseToken
  // let farmToken
  // if (vault.toUpperCase() === pool.address.toUpperCase()) {
  const currentBasePrice = tokenPriceUsd
  const currentFarmPrice = quoteTokenPriceUsd
  const baseToken = token.symbol.replace('wBNB', 'BNB')
  const farmToken = quoteToken.symbol.replace('wBNB', 'BNB')
  // } else {
  //   currentBasePrice = quoteTokenPriceUsd
  //   currentFarmPrice = tokenPriceUsd
  //   baseToken = quoteToken.symbol.replace('wBNB', 'BNB')
  //   farmToken = token.symbol.replace('wBNB', 'BNB')
  // }

  const totalPositionValueRight = baseTokenAmountRight * currentBasePrice + farmTokenAmountRight * currentFarmPrice

  const equityValueTokenRight = baseTokenAmountRight * 2 - debtValueRight
  const equityValueUsdRight = equityValueTokenRight * currentBasePrice

  // console.log({
  //   baseTokenAmountRight, farmTokenAmountRight, lpAmountRight, totalPositionValueRight, debtValueRight, currentBasePrice,
  //    currentFarmPrice, equityValueTokenRight, equityValueUsd
  // })
  return {
    lpAmountRight, baseTokenAmountRight, farmTokenAmountRight, totalPositionValueRight, debtValueRight,
    equityValueTokenRight, equityValueUsdRight, currentBasePrice, currentFarmPrice, baseToken, farmToken
  }
}


export const getRunLogic = (riskKillThreshold, lpApr, leverage, Token0Name, Token1Name, tokenName) => {

  const RiskKillThreshold = Number(riskKillThreshold) / 10000 // 清算风险度
  const LiquidationRewards = LIQUIDATION_REWARDS // 清算罚金
  const ReinvestMinute = REINVEST_MINUTE // 复投时长（分钟）0为按日复投
  // const Token0Name = 'BNB' // token0名称
  // const Token1Name = 'USD' // token1名称
  const BorrowingInterestList = 0
  const LPAPRList = lpApr // 0.5 // LP历史日均年化
  const BaseTokenName = tokenName // 填Token0Name 或 Token1Name
  const LeverageOpen = leverage // 初始杠杆
  const DayNum = 90 // priceList.length // 时间长度（天） 换成价格list的长度

  const profitLossRatioSheet1Token0 = []
  const profitLossRatioSheet1Token1 = []
  const priceRiseFall = []

  for (let m = 1; m <= 300; m++) {
    const PriceList = [];
    for (let n = 1; n <= DayNum; n++) {
      PriceList.push(1000 + 1000 * n * (m / 100 - 1) / DayNum)
    }

    const dataList = RunLogic(RiskKillThreshold, LiquidationRewards, ReinvestMinute, Token0Name, Token1Name, BorrowingInterestList,
      LPAPRList, PriceList, BaseTokenName, LeverageOpen, DayNum)
    profitLossRatioSheet1Token0.push(dataList[6])
    profitLossRatioSheet1Token1.push(dataList[5])
    const priceRise = Math.round((m / 100 - 1) * 100)
    priceRiseFall.push(priceRise)

  }
  return { priceRiseFall, profitLossRatioSheet1Token0, profitLossRatioSheet1Token1 }

}


export const getRunLogic1 = (priceList, quoteTokenPriceList, riskKillThreshold, borrowingInterest, lpApr, leverage, Token0Name, Token1Name, tokenName) => {
  const RiskKillThreshold = Number(riskKillThreshold) / 10000  // 清算风险度
  const LiquidationRewards = LIQUIDATION_REWARDS // 清算罚金
  const ReinvestMinute = REINVEST_MINUTE // 复投时长（分钟）0为按日复投
  // const Token0Name = 'BNB' // token0名称
  // const Token1Name = 'USD' // token1名称
  const BorrowingInterestList = borrowingInterest // 0.05
  const LPAPRList = lpApr // LP历史日均年化
  const PriceList = [] // 历史日均价格 token0_usd / token1_usd

  for (let i = 0; i < priceList.length; i++) {
    const priceRatio = priceList[i] / quoteTokenPriceList[i]
    PriceList.push(priceRatio)
  }

  // 注意三个List的长度一致
  const BaseTokenName = tokenName // 填Token0Name 或 Token1Name
  const LeverageOpen = leverage // 初始杠杆
  const DayNum = PriceList.length // 时间长度（天）
  // console.log({ PriceList,quoteTokenPriceList,  priceList,  'riskKillThreshold-------':Number(riskKillThreshold),RiskKillThreshold, borrowingInterest, lpApr, leverage, Token0Name, Token1Name, tokenName })
  const { profitLossRatioToken0, profitLossRatioToken1 } = RunLogic1(RiskKillThreshold, LiquidationRewards, ReinvestMinute, Token0Name, Token1Name, BorrowingInterestList,
    LPAPRList, PriceList, BaseTokenName, LeverageOpen, DayNum)

  // console.log({ profitLossRatioToken0, profitLossRatioToken1 })
  return { profitLossRatioToken0, profitLossRatioToken1 }
}

export const getSingle7Days = (
  quoteTokenPriceUsd, poolWeight, lpTotalInQuoteToken,
  cakePrice, tradefee, dateList) => {
  // const { quoteTokenPriceUsd } = farm
  // const { poolWeight } = useFarmMasterChefData(farm.pid, farm.pool.pid)
  // const { lpTotalInQuoteToken } = useFarmTokensLpData(farm.pid, farm.pool.pid)

  const poolWeightBigNumber: any = new BigNumber(poolWeight)
  const poolLiquidityUsd = new BigNumber(lpTotalInQuoteToken).times(quoteTokenPriceUsd)
  const yearlyCakeRewardAllocation = CAKE_PER_YEAR.times(poolWeightBigNumber)
  // const yieldFarmingApr = yearlyCakeRewardAllocation.times(cakePrice).div(poolLiquidityUsd).times(100)
  const singleDate = []
  let singleApy = []
  let tradefeeapr
  let yieldFarmingApr
  let apr
  let apy
  if (tradefee.length === 0 || cakePrice.length === 0) {
    singleApy = [0, 0, 0, 0, 0, 0, 0]
  } else {
    const priceLen = cakePrice.length
    for (let i = 0; i < tradefee.length; i++) {
      tradefeeapr = tradefee[i] * 365 / 100
      yieldFarmingApr = yearlyCakeRewardAllocation.times(cakePrice[priceLen - (i + 1)]).div(poolLiquidityUsd)
      apr = Number(tradefeeapr) + Number(yieldFarmingApr)
      apy = ((Math.pow(1 + apr / 365, 365) - 1) * 100).toFixed(2)
      singleApy.push(apy)

      if (dateList.length !== 0) {
        const date = dateList[priceLen - (i + 1)]
        const dateIndex = date.indexOf(['/'])
        const dateValue = date.substring(dateIndex + 1, date.length)
        singleDate.push(dateValue)
      }

    }

  }

  const singleApyList = []
  const singleDateList = []
  for (let i = 0; i < singleApy.length; i++) {
    singleApyList.unshift(singleApy[i])
    singleDateList.unshift(singleDate[i])
  }

  return { singleApyList, singleDateList }

}