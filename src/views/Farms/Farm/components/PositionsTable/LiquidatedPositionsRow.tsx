import React from 'react'
import styled from 'styled-components'
// import NameCellPosition from './Cells/NameCellPosition'
import PoolCellPosition from './Cells/PoolCellPosition'
import PositionValueCell from './Cells/PositionValueCell'
import LiquidatedEquityCell from './Cells/LiquidatedEquityCell'
import LiquidationFeeCell from './Cells/LiquidationFeeCell'
import AssetsReturnedCell from './Cells/AssetsReturnedCell'
import TxRecordCell from './Cells/TxRecordCell'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  padding: 0 24px;
  min-height: 90px;

  :hover {
    background-color: #F7F7F8;
  }
  ${({ theme }) => theme.screen.tablet} {
    min-height: 80px;
  }
  ${({ theme }) => theme.screen.tablet} {
    flex-direction: column
  }
`

// this is for test
const LiquidatedPositionsRow = ({ token, quoteToken }) => {
  
  return (
    <>
      <StyledRow role="row">
        <PoolCellPosition pool="HUSKI_BNB" quoteToken={quoteToken} token={token} />
        <PositionValueCell position={null} name="BNB" />
        <LiquidatedEquityCell liqEquity="10BNB" />
        <LiquidationFeeCell fee="0.53BNB" />
        <AssetsReturnedCell assetsReturned="1.53BNB" />
        <TxRecordCell />
      </StyledRow>
      <StyledRow role="row">
        <PoolCellPosition pool="HUSKI_BNB" quoteToken={quoteToken} token={token} />
        <PositionValueCell position={null} name="BNB" />
        <LiquidatedEquityCell liqEquity="10BNB" />
        <LiquidationFeeCell fee="0.53BNB" />
        <AssetsReturnedCell assetsReturned="1.53BNB" />
        <TxRecordCell />
      </StyledRow>
    </>
  )
}

export default LiquidatedPositionsRow
