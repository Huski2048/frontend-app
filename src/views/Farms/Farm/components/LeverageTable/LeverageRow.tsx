/* eslint-disable no-restricted-properties */
import React, { useState } from 'react'
import styled from 'styled-components'
import { usePoolVaultData } from 'state/pool/hooks'
import { useFarmMasterChefData, useFarmTokensLpData, useFarmPancakeLpData } from 'state/leverage/hooks'
import { getApy, getDisplayApr, getTvl } from '../../../helpers'
import PoolCell from './Cells/PoolCell'
import ApyCell from './Cells/ApyCell'
import ActionCell from './Cells/ActionCell'
import LeverageCell from './Cells/LeverageCell'
import TvlCell from './Cells/TvlCell'
import Borrowing from './Cells/Borrowing'


const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  padding: 10px 24px;
  height: 90px;
  margin-top: 10px;
  flex-direction: row;
  &:hover {
    background: ${({ theme }) => (theme.isDark ? '#272B30' : '#F7F7F8')};
  }
  &:active {
    background: ${({ theme }) => (theme.isDark ? '#272B30' : '#F7F7F8')};
  }
  ${({ theme }) => theme.screen.tablet} {
    height: 80px;
  }
  ${({ theme }) => theme.screen.phone} {
    flex-direction: column;
    padding: 10px 20px;
    height: auto;
    border-bottom: 1px solid ${({ theme }) => theme.color.tableLine};
  }
`

const LeverageRow = ({ farmData1, farmData2 }) => {
  const [borrowingAsset, setBorrowingAsset] = useState(farmData1?.token?.symbol)
  const farmData = farmData1.token.symbol === borrowingAsset ? farmData1 : farmData2
  const { lpSymbol, leverage, yieldFarmData, tradingFee, huskyRewards } = farmData

  const { interestRatePerYear } = usePoolVaultData(farmData.pool.pid)
  const { totalSupply } = useFarmPancakeLpData(farmData.pid, farmData.pool.pid)
  const { tokenAmountTotal, quoteTokenAmountTotal } = useFarmTokensLpData(farmData.pid, farmData.pool.pid)
  const { workerInfo } = useFarmMasterChefData(farmData.pid, farmData.pool.pid)
  const { tokensLP, tokenNum, quoteTokenNum, totalTvl } = getTvl(
    farmData.tokenPriceUsd,
    farmData.quoteTokenPriceUsd,
    totalSupply,
    tokenAmountTotal,
    quoteTokenAmountTotal,
    workerInfo)

  const getLeverageWithHighestApy = () => {
    const lvgArray = []
    for (let i = 1; i < leverage / 0.5; i++) {
      lvgArray.push(1 + 0.5 * (-1 + i))
    }
    // which lvg has highest apy
    const apyArray = lvgArray.map((lvg) => getApy(yieldFarmData, tradingFee, huskyRewards, interestRatePerYear, lvg))
    const maxApy = Math.max(...apyArray)
    const index = apyArray.indexOf(maxApy)
    const leveragewithHighestApy = lvgArray[index]

    return leveragewithHighestApy
  }
  const lvgWithHighestApy = getLeverageWithHighestApy()

  const [childLeverage, setChildLeverage] = useState(lvgWithHighestApy || leverage)
  React.useEffect(() => {
    if (lvgWithHighestApy) {
      setChildLeverage(lvgWithHighestApy)
    }
  }, [lvgWithHighestApy])

  const onChildValueChange = (val) => {
    setChildLeverage(val)
  }
  
  const onBorrowingAssetChange = (asset) => {
    setBorrowingAsset(asset)
  }
  return (
    <>
      <StyledRow role="row">
        <PoolCell pool={lpSymbol.replace(' LP', '')} farmData={farmData} />
        <ApyCell
          apyAtOne={getDisplayApr(getApy(yieldFarmData, tradingFee, huskyRewards, interestRatePerYear, 1))}
          apy={getDisplayApr(getApy(yieldFarmData, tradingFee, huskyRewards, interestRatePerYear, childLeverage))}
          yieldFarming={yieldFarmData * childLeverage}
          tradingFees={tradingFee * 365 * childLeverage}
          huskyRewards={huskyRewards * 100 * (childLeverage - 1)}
          borrowingInterest={Number(interestRatePerYear) * 100 * (childLeverage - 1)}
        />
        <TvlCell
          tvl={totalTvl.toNumber()}
          farmData={farmData}
          lpTokens={tokensLP}
          tokenNum={tokenNum}
          quoteTokenNum={quoteTokenNum}
        />
        <Borrowing
          quoteToken={farmData.quoteToken}
          token={farmData.token}
          switchFlag={farmData.switchFlag}
          onBorrowingAssetChange={onBorrowingAssetChange}
        />
        <LeverageCell leverage={leverage} onChange={onChildValueChange} childLeverage={childLeverage} />
        <ActionCell
          farmData={farmData}
          selectedLeverage={childLeverage}
          selectedBorrowing={borrowingAsset}
        />
      </StyledRow>
    </>
  )
}

export default LeverageRow
