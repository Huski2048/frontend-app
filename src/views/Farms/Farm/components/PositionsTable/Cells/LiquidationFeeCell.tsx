import React from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints, Skeleton, Flex } from 'husky-uikit'

import { useTranslation } from 'contexts/Localization'
import { BigText, SmText } from 'components/Text/Text'
import BaseCell, { CellContent } from './BaseCell'

export const SLiquidationFeeCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 100px;
  }
  ${({ theme }) => theme.screen.phone} {
    flex: 1;
    padding: 10px 0px
  }
`

const LiquidationFeeCell = ({ fee }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { t } = useTranslation()

  return (
    <SLiquidationFeeCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Flex alignItems="center">
            <SmText textAlign="left">
              {t('Liquidation Fee')}
            </SmText>
            {/*  {tooltipVisible && tooltip}
            <span ref={targetRef}>
              <InfoIcon ml="10px" />
            </span> */}
          </Flex>
        )}
        {fee ? (
          <BigText mt="8px">
            {fee}
          </BigText>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </SLiquidationFeeCell>
  )
}

export default LiquidationFeeCell
