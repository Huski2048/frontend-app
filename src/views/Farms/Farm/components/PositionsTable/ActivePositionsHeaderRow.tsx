import React from 'react'
import styled from 'styled-components'
import { Text, useTooltip, Flex } from 'husky-uikit'
import useTheme from 'hooks/useTheme'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './Cells/BaseCell'
import { SNameCell } from './Cells/NameCell'
import { SPoolCell } from './Cells/PoolCell'
import { SPositionValueCell } from './Cells/PositionValueCell'
import { SDebtCell } from './Cells/DebtCell'
import { SEquityCell } from './Cells/EquityCell'
import { SApyCell } from './Cells/ApyCell'
import { SDebtRatioCell } from './Cells/DebtRatioCell'
import { SLiquidationThresholdCell } from './Cells/LiquidationThresholdCell'
import { SSafetyBufferCell } from './Cells/SafetyBufferCell'
import { SActionCell } from './Cells/ActionCell'

const StyledRow = styled.div<{ isDark: boolean }>`
  background-color: transparent;
  margin: 0 24px 20px;
  padding: 0 0 22px 0;
  display: flex;
  /* flex-direction: column; */
  border-bottom: ${({ isDark }) => (isDark ? '1px solid #272B30' : '2px solid #efefef')};
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }
  ${Text} {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textSubtle};
  }
`

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  padding-bottom: 10px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
  ${CellContent} {
    flex-direction: row;
    justify-content: flex-start;
    align-items: start;
    ${({ theme }) => theme.mediaQueries.md} {
      flex-direction: column;
    }
  }
`
const ActivePositionsHeaderRow = () => {
  const { t } = useTranslation()
  const { pathname } = useLocation()

  const {
    tooltip: positionTooltip,
    tooltipVisible: positionTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t('Position value = Debt Value + Equity Value + Yield')}</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    tooltip: debtTooltip,
    tooltipVisible: debtTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t('Debt Value = Borrowed Asset + Borrowing Interest')}</Text>
      {/*   <Text>Borrowed Asset:</Text>
      <Text>Borrowing Interest: </Text> */}
    </>,
    { placement: 'top-start' },
  )
  const {
    tooltip: profitOrLossTooltip,
    tooltipVisible: profitOrLossTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t('Profit and loss information of your position')}</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    tooltip: equityTooltip,
    tooltipVisible: equityTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t('Equity Value = Position Value - Debt Value')}</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    tooltip: apyTooltip,
    tooltipVisible: apyTooltipVisible,
  } = useTooltip(
    <>
      <Flex justifyContent="space-between">
        <Text small>{t('Pancake Liquitity Rewards:')}</Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text small>{t('Pancake Trading Fee Rewards:')}</Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text small>{t('Huski Token Rewards:')}</Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text small>{t('Borrowing Interest:')}</Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text small>{t('APR:')}</Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text small>{t('APY:')}</Text>
      </Flex>
    </>,
    { placement: 'top-start' },
  )
  const {
    tooltip: debtRatioTooltip,
    tooltipVisible: debtRatioTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t('Debt Ratio = Debt Value / Position Value')}</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    tooltip: liquidationThresholdTooltip,
    tooltipVisible: liquidationThresholdTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t('When the debt ratio exceeds liquidation ratio, your position may be liquidated.')}</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    tooltip: safetyBufferTooltip,
    tooltipVisible: safetyBufferTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t('Risk Ratio = Liquidation Ratio - Debt Ratio')}</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    tooltip: profitLossTooltip,
    tooltipVisible: profitLossTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t('Profit and loss information of your position')}</Text>
    </>,
    { placement: 'top-start' },
  )
  const { isDark } = useTheme()
  return (
    <StyledRow isDark={isDark}>
      <SNameCell>
        <CellContent>
          <Text>{t('Name')}</Text>
        </CellContent>
      </SNameCell>
      <SPoolCell>
        <CellContent>
          <Text>{t('Pool')}</Text>
        </CellContent>
      </SPoolCell>
      {pathname.includes('singleAssets') ? (
        <StyledCell>
          <CellContent>
            <Text small>{t('Strategy')}</Text>
          </CellContent>
        </StyledCell>
      ) : null}
      <SPositionValueCell>
        <CellContent>
          <Flex alignItems="center">
            <Text>{t('Position')}</Text>
            {positionTooltipVisible && positionTooltip}
          </Flex>
        </CellContent>
      </SPositionValueCell>
      {pathname.includes('farms') ? (
        <SDebtCell>
          <CellContent>
            <Flex alignItems="center">
              <Text>{t('Debt')}</Text>
              {debtTooltipVisible && debtTooltip}
            </Flex>
          </CellContent>
        </SDebtCell>
      ) : null}
      <SEquityCell>
        <CellContent>
          <Flex alignItems="center">
            <Text>{t('Equity')}</Text>
            {equityTooltipVisible && equityTooltip}
          </Flex>
        </CellContent>
      </SEquityCell>
      <SApyCell>
        <CellContent>
          <Flex alignItems="center">
            <Text>{t('APY')}</Text>
            {apyTooltipVisible && apyTooltip}
          </Flex>
        </CellContent>
      </SApyCell>
      {pathname.includes('farms') ? (
        <>
          <SDebtRatioCell>
            <CellContent>
              <Flex alignItems="center">
                <Text>{t('Debt Ratio')}</Text>
                {debtRatioTooltipVisible && debtRatioTooltip}
              </Flex>
            </CellContent>
          </SDebtRatioCell>
          <SLiquidationThresholdCell>
            <CellContent>
              <Flex alignItems="left">
                <Text style={{ paddingRight: '40px' }}>{t('Liquidation Threshold')}</Text>
                {liquidationThresholdTooltipVisible && liquidationThresholdTooltip}
              </Flex>
            </CellContent>
          </SLiquidationThresholdCell>
        </>
      ) : null}
      <SSafetyBufferCell>
        <CellContent>
          <Flex>
            <Text>{t('Safety Buffer')}</Text>
            {safetyBufferTooltipVisible && safetyBufferTooltip}
          </Flex>
        </CellContent>
      </SSafetyBufferCell>
      {pathname.includes('farms') ? (
        <SDebtCell>
          <CellContent>
            <Flex alignItems="center">
              <Text>{t('Profit/Loss')}</Text>
              {profitOrLossTooltipVisible && profitOrLossTooltip}
            </Flex>
          </CellContent>
        </SDebtCell>
      ) : null}
      <SActionCell>
        <CellContent>
          <Flex>
            <Text>&nbsp;</Text>
            {profitLossTooltipVisible && profitLossTooltip}
          </Flex>
        </CellContent>
      </SActionCell>
    </StyledRow>
  )
}

export default ActivePositionsHeaderRow
