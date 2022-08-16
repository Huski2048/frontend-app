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

export const SDebtRatioCell = styled(BaseCell)`
  flex: 1 0 90px;
  ${({ theme }) => theme.screen.tablet} {
    display: none
  }
  ${({ theme }) => theme.screen.phone} {
    flex: 1;
    padding: 10px 0px
  }
`

const DebtRatioCell = ({ debtRatio }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { t } = useTranslation()
  
  return (
    <SDebtRatioCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Flex alignItems="center">
            <BigText textAlign="left">
              {t('Debt Ratio')}
            </BigText>
            {/* {tooltipVisible && tooltip}
            <span ref={targetRef}>
              <InfoIcon ml="10px" />
            </span> */}
          </Flex>
        )}
        {debtRatio && !debtRatio.isNaN() ? (
          <BigText>{(debtRatio.toNumber() * 100).toFixed(2)}%</BigText>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </SDebtRatioCell>
  )
}

export default DebtRatioCell
