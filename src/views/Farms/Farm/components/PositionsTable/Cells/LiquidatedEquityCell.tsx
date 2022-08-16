import React from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints, Skeleton, Flex } from 'husky-uikit'

import { useTranslation } from 'contexts/Localization'
import { BigText, SmText } from 'components/Text/Text'
import BaseCell, { CellContent } from './BaseCell'

export const SLiquidatedEquityCell = styled(BaseCell)`
  flex: 1 0 100px;
  ${({ theme }) => theme.screen.phone} {
    flex: 1;
    padding: 10px 0px
  }
`

const LiquidatedEquityCell = ({ liqEquity }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { t } = useTranslation()

  return (
    <SLiquidatedEquityCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Flex alignItems="center">
            <SmText textAlign="left">
              {t('Liquidated Equity')}
            </SmText>
            {/*  {tooltipVisible && tooltip}
            <span ref={targetRef}>
              <InfoIcon ml="10px" />
            </span> */}
          </Flex>
        )}
        {liqEquity ? (
          <BigText mt="8px">
            {liqEquity}
          </BigText>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </SLiquidatedEquityCell>
  )
}

export default LiquidatedEquityCell
