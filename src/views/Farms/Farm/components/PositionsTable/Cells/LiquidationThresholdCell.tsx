import React from 'react'
import styled from 'styled-components'
import {
  useMatchBreakpoints,
  Skeleton,
  Flex,
} from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import { BigText } from 'components/Text/Text';
import BaseCell, { CellContent } from './BaseCell'

interface Props {
  liquidationThreshold: number
  noDebt?: boolean
}

export const SLiquidationThresholdCell = styled(BaseCell)`
  flex: 1 0 80px;
  ${({ theme }) => theme.screen.tablet} {
    display: none
  }
  ${({ theme }) => theme.screen.phone} {
    flex: 1;
    padding: 10px 0px
  }
`

const LiquidationThresholdCell: React.FC<Props> = ({ liquidationThreshold, noDebt }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { t } = useTranslation()

  if (noDebt) {
    return (
      <SLiquidationThresholdCell role="cell">
        <CellContent>
          {(isMobile || isTablet) && (
            <BigText textAlign="left">
              {t('Liquidation Threshold')}
            </BigText>
          )}
          <BigText>{t('No Debt')}</BigText>
        </CellContent>
      </SLiquidationThresholdCell>
    )
  }
  return (
    <SLiquidationThresholdCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Flex alignItems="center">
            <BigText textAlign="left">
              {t('Liquidation Threshold')}
            </BigText>
          </Flex>
        )}
        {liquidationThreshold ? (
          <BigText>
            {liquidationThreshold}%
          </BigText>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </SLiquidationThresholdCell>
  )
}

export default LiquidationThresholdCell
