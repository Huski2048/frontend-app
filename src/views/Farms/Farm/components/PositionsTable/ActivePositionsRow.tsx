/* eslint-disable no-restricted-properties */
import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'config/index'
import { useLocation } from 'react-router-dom'
import { useCakePrice, useFarmMasterChefData, useFarmTokensLpData, useFarmPancakeLpData, useHuskiPrice, useFarmFromWorker, useWorkerKillFactor } from 'state/leverage/hooks'
import { usePoolVaultData, usePoolFairLaunchData } from 'state/pool/hooks'
import { getHuskyRewards, getYieldFarming, getDrop, getDisplayApr, getApy, getApr } from '../../../helpers'
import { useTradeFeesFromPid } from '../../../../../state/graph/hooks'
import NameCell from './Cells/NameCell'
import ApyCell from './Cells/ApyCell'
import PoolCell from './Cells/PoolCell'
import ActionCell from './Cells/ActionCell'
import PositionValueCell from './Cells/PositionValueCell'
import DebtCell from './Cells/DebtCell'
import EquityCell from './Cells/EquityCell'
import DebtRatioCell from './Cells/DebtRatioCell'
import LiquidationThresholdCell from './Cells/LiquidationThresholdCell'
import SafetyBufferCell from './Cells/SafetyBufferCell'
import StrategyCell from './Cells/StrategyCell'
import ProfitsCell from './Cells/ProfitsCell'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  padding: 0 24px;
  min-height: 90px;
  &:hover {
    background: ${({ theme }) => (theme.isDark ? '#272B30' : '#F7F7F8')};
  }
  &:active {
    background: ${({ theme }) => (theme.isDark ? '#272B30' : '#F7F7F8')};
  }
  ${({ theme }) => theme.screen.tablet} {
    min-height: 80px;
  }
  ${({ theme }) => theme.screen.phone} {
    flex-direction: column;
  }
  //cursor: pointer;
`

const ActivePositionsRow = ({ data }) => {
  const { pathname } = useLocation()

  const { positionId, debtValue, lpAmount, positionValueBase, worker } = data
  const farmData = useFarmFromWorker(worker)
  const {
    lpSymbol,
    tokenPriceUsd,
    quoteTokenPriceUsd,
    token,
    workerAddress,
    config,
    quoteToken,
    pool,
    pid
  } = farmData

  const { vaultDebtVal } = usePoolVaultData(pool.pid)
  const { debtPoolRewardPerBlock } = usePoolFairLaunchData(pool.pid)
  const { totalSupply } = useFarmPancakeLpData(pid, pool.pid)
  const { tokenAmountTotal, quoteTokenAmountTotal, lpTotalInQuoteToken } = useFarmTokensLpData(pid, pool.pid)
  const { poolWeight } = useFarmMasterChefData(pid, pool.pid)
  const killFactor = useWorkerKillFactor(config, workerAddress)
  const liquidationThreshold = killFactor

  // let symbolName
  // let lpSymbolName
  // let tokenValue
  // let quoteTokenValue
  // let baseAmount
  // let liquidationThresholdValue

  // if (vault.toUpperCase() === pool.address.toUpperCase()) {
  const symbolName = token?.symbol.replace('wBNB', 'BNB')
  // const lpSymbolName = token.name
  // const tokenValue = token
  // const quoteTokenValue = quoteToken
  const baseAmount = new BigNumber(tokenAmountTotal).div(new BigNumber(totalSupply)).times(lpAmount)
  // } else {
  //   symbolName = quoteToken?.symbol.replace('wBNB', 'BNB')
  //   lpSymbolName = QuoteTokenInfo?.name
  //   tokenValue = quoteToken
  //   quoteTokenValue = token
  //   baseAmount = new BigNumber(quoteTokenAmountTotal).div(new BigNumber(totalSupply)).times(lpAmount)
  //   liquidationThresholdValue = quoteTokenLiquidationThreshold
  // }

  const totalPositionValueInToken = new BigNumber(positionValueBase).dividedBy(BIG_TEN.pow(18))
  const debtValueNumber = new BigNumber(debtValue).dividedBy(BIG_TEN.pow(18))
  const debtRatio = new BigNumber(debtValueNumber).div(new BigNumber(totalPositionValueInToken))
  const leverage = new BigNumber(baseAmount)
    .times(2)
    .div(new BigNumber(baseAmount).times(2).minus(new BigNumber(debtValueNumber)))

  const huskyPrice = useHuskiPrice()
  const cakePrice = useCakePrice()
  const huskyRewards = getHuskyRewards(
    vaultDebtVal,
    debtPoolRewardPerBlock,
    tokenPriceUsd, 
    huskyPrice)
  const yieldFarmData = getYieldFarming(
    quoteTokenPriceUsd,
    poolWeight,
    lpTotalInQuoteToken, new BigNumber(cakePrice))
  const dropData = getDrop(
    totalSupply,
    token, 
    liquidationThreshold,
    tokenAmountTotal, 
    quoteTokenAmountTotal, 
    data)
  const { interestRatePerYear } = usePoolVaultData(farmData.pool.pid)
  const { tradingFee: tradeFee } = useTradeFeesFromPid(farmData.pid)
  const liquidationThresholdData = Number(liquidationThreshold) / 100
  const debtRatioRound: any = debtRatio ? debtRatio.toNumber() * 100 : 0
  const safetyBuffer = Math.round(liquidationThresholdData - debtRatioRound)

  return (
    <>
      <StyledRow role="row">
        <NameCell name={symbolName} positionId={positionId} />
        <PoolCell
          pool={lpSymbol.replace(' PancakeswapWorker', '').toUpperCase().replace('WBNB', 'BNB')}
          quoteToken={quoteToken}
          token={token}
          exchange={farmData.lpExchange}
        />
        {pathname.includes('singleAssets') ? <StrategyCell strategy={null} /> : null}
        <PositionValueCell position={totalPositionValueInToken} name={symbolName} />
        {pathname.includes('farms') ? (
          <DebtCell
            debt={debtValueNumber}
            name={symbolName}
          />
        ) : null}
        <EquityCell equity={totalPositionValueInToken.toNumber() - debtValueNumber.toNumber()} name={symbolName} />
        <ApyCell
          apr={getApr(yieldFarmData, tradeFee, huskyRewards, interestRatePerYear, leverage.toNumber()) * 100}
          dailyApr={(getApr(yieldFarmData, tradeFee, huskyRewards, interestRatePerYear, leverage.toNumber()) / 365) * 100}
          apy={getDisplayApr(getApy(yieldFarmData, tradeFee, huskyRewards, interestRatePerYear, leverage.toNumber()))}
          yieldFarming={yieldFarmData * leverage.toNumber()}
          tradingFees={tradeFee * 365 * leverage.toNumber()}
          huskyRewards={huskyRewards * 100 * (leverage.toNumber() - 1)}
          borrowingInterest={Number(interestRatePerYear) * 100 * (leverage.toNumber() - 1)}
        />

        {pathname.includes('farms') ? (
          <>
            <DebtRatioCell debtRatio={debtRatio} />
            <LiquidationThresholdCell
              liquidationThreshold={liquidationThresholdData}
              noDebt={debtValueNumber.toNumber() === 0 && debtRatio.toNumber() === 0}
            />{' '}
          </>
        ) : null}
        <SafetyBufferCell
          liquidationThresholdData={liquidationThresholdData}
          debtRatioRound={debtRatioRound}
          safetyBuffer={safetyBuffer}
          tokenName={token.symbol}
          quoteTokenName={quoteToken.symbol}
          priceDrop={new BigNumber(dropData).toFixed(2, 1)}
          noDebt={debtValueNumber.toNumber() === 0 && debtRatio.toNumber() === 0}
        />
        {pathname.includes('farms') ? <ProfitsCell data={data} /> : null}
        <ActionCell
          posData={{ data, liquidationThresholdData }}
          name={lpSymbol.replace(' PancakeswapWorker', '')}
          positionId={positionId}
        />
      </StyledRow>
    </>
  )
}

export default ActivePositionsRow
