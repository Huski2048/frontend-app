import React from 'react'
import styled from 'styled-components'
import {
  useMatchBreakpoints,
  Skeleton,
  Flex,
} from 'husky-uikit'
import { BigText } from 'components/Text/Text'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'


export const SDebtCell = styled(BaseCell)`
  flex: 1 0 100px;
  ${({ theme }) => theme.screen.tablet} {
    display: none
  }
  ${({ theme }) => theme.screen.phone} {
    flex: 1;
    padding: 10px 0px
  }
`

const DebtCell = ({ debt, name }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { t } = useTranslation()
  
  return (
    <SDebtCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Flex alignItems="center">
            <BigText textAlign="left">
              {t('Debt')}
            </BigText>
            {/* {tooltipVisible && tooltip}
            <span ref={targetRef}>
              <InfoIcon ml="10px" />
            </span> */}
          </Flex>
        )}
        {debt ? (
          <BigText>
            {debt.toNumber().toFixed(3)} {name}
          </BigText>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </SDebtCell>
  )
}

export default DebtCell
