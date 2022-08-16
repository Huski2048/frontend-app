import React from 'react'
import styled from 'styled-components'
import { SmText } from 'components/Text/Text'
import { Text, useMatchBreakpoints, Skeleton } from 'husky-uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

export const SUtilizationCell = styled(BaseCell)`
  flex: 1 0 100px;
  ${({ theme }) => theme.screen.phone} {
    width: 100%;
    flex: 1;
  }
  ${CellContent} {
    ${({ theme }) => theme.screen.phone} {
      width: 100%;
      flex: 1;
      align-items: center;
      justify-content: space-between;
      gap: 20px;

      ${Text} {
        font-size: 12px;
        ${({ theme }) => theme.mediaQueries.xxl} {
          font-size: 14px;
        }
      }
    }
  }
`

const UtilRateCell = ({ utilRate }) => {
  const utilizationRateToPercentage = (rate) => {
    const value = new BigNumber(rate).times(100).toFixed(2, 1)
    return `${value}%`
  }
  const { t } = useTranslation()

  const { isMobile, isTablet } = useMatchBreakpoints()
  return (
    <SUtilizationCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && <SmText>{t('Utilization')}</SmText>}
        {utilRate ? <Text>{utilizationRateToPercentage(utilRate)}</Text> : <Skeleton width="80px" height="16px" />}
      </CellContent>
    </SUtilizationCell>
  )
}

export default UtilRateCell
