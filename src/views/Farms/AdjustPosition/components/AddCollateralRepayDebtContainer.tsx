import React from 'react'
import { Box, Flex } from 'husky-uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import AddColateral from './AddColateral'
import RepayDebt from './RepayDebt'
import { useAddCollateralContext } from '../context'

interface HeaderProps {
  active: boolean
}
interface Props {
  targetPositionLeverage: number
  userQuoteTokenBalance: any
  userTokenBalance: any
  quoteTokenName: any
  tokenName: any
  quoteToken: any
  token: any
  tokenInput: number | string
  quoteTokenInput: number | string
  setTokenInput: any
  setQuoteTokenInput: any
  currentPositionLeverage: number
  symbolName: string
  tokenPrice: string
  quoteTokenPrice: string
  baseTokenAmountValue: any
  farmTokenAmountValue: any
  minimizeTradingValues: any
}

const Header = styled(Flex)`
  background: ${({ theme }) => (theme.isDark ? '#111315' : '#f4f4f4')};
  border-radius: 8px;
  padding: 4px;
  ${({ theme }) => theme.mediaQueries.xxl} {
    border-radius: 12px;
  }
`
const HeaderTab = styled.div<HeaderProps>`
  flex: 1 0 50%;
  box-shadow: ${({ active, theme }) =>
    active
      ? theme.isDark
        ? '0px 4px 8px -4px rgba(0, 0, 0, 0.25), inset 0px -1px 1px rgba(0, 0, 0, 0.04), inset 0px 2px 0px rgba(255, 255, 255, 0.06)'
        : '0px 4px 8px -4px rgba(0, 0, 0, 0.25), inset 0px -1px 1px rgba(0, 0, 0, 0.04), inset 0px 2px 0px rgba(255, 255, 255, 0.25)'
      : ''};
  background-color: ${({ active, theme }) => (active ? (theme.isDark ? '#272B30' : '#FFFFFF') : 'transparent')};
  padding: 4px;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: 700;
  line-height: 24px;
  color: ${({ theme, active }) => (active ? (theme.isDark ? 'white' : '#1A1D1F') : '#6F767E')};
  ${({ theme }) => theme.mediaQueries.xxl} {
    border-radius: 12px;
    font-size: 14px;
    padding: 11px;
  }
`

const AddCollateralRepayDebtContainer: React.FC<Props> = ({
  targetPositionLeverage,
  userQuoteTokenBalance,
  userTokenBalance,
  quoteTokenName,
  tokenName,
  quoteToken,
  token,
  tokenInput,
  quoteTokenInput,
  setTokenInput,
  setQuoteTokenInput,
  currentPositionLeverage,
  baseTokenAmountValue,
  farmTokenAmountValue,
  minimizeTradingValues,
}) => {
  const { isAddCollateral, handleIsAddCollateral } = useAddCollateralContext()
  const { t } = useTranslation()

  return (
    <Box>
      <Header>
        <HeaderTab active={isAddCollateral} onClick={() => handleIsAddCollateral(true)}>
          {t('Add Collateral')}
        </HeaderTab>
        <HeaderTab active={!isAddCollateral} onClick={() => handleIsAddCollateral(false)}>
          {currentPositionLeverage === 1 ? t('Partially Close Your Position') : t('Repay Debt')}
        </HeaderTab>
      </Header>
      <Box>
        <AddColateral
          userQuoteTokenBalance={userQuoteTokenBalance}
          userTokenBalance={userTokenBalance}
          quoteTokenName={quoteTokenName}
          tokenName={tokenName}
          quoteToken={quoteToken}
          token={token}
          tokenInput={tokenInput}
          quoteTokenInput={quoteTokenInput}
          setTokenInput={setTokenInput}
          setQuoteTokenInput={setQuoteTokenInput}
        />

        <RepayDebt
          currentPositionLeverage={currentPositionLeverage}
          targetPositionLeverage={targetPositionLeverage}
          minimizeTradingValues={minimizeTradingValues}
          quoteTokenName={quoteTokenName}
          tokenName={tokenName}
          baseTokenAmountValue={baseTokenAmountValue}
          farmTokenAmountValue={farmTokenAmountValue}
        />
      </Box>
    </Box>
  )
}

export default AddCollateralRepayDebtContainer
