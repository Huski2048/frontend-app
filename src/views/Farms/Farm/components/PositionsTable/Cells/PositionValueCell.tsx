import React from 'react'
import styled from 'styled-components'
import { BigText } from 'components/Text/Text'
import { Skeleton, useMatchBreakpoints, Flex } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

export const SPositionValueCell = styled(BaseCell)`
  /* flex: 1 0 120px; */
  flex: 1 0 100px;
  ${({ theme }) => theme.screen.phone} {
    flex: 1;
    padding: 10px 0px
  }
`

const PositionValueCell = ({ position, name }) => {
  const { isMobile } = useMatchBreakpoints()

  const { t } = useTranslation()

  return (
    <SPositionValueCell role="cell">
      <CellContent>
        {(isMobile) && (
          <Flex alignItems="center">
            <BigText textAlign="left">
              {t('Position')}
            </BigText>
          </Flex>
        )}
        {position && !position.isNaN() ? (
          <BigText>
            {position.toNumber().toFixed(3)} {name}
          </BigText>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </SPositionValueCell>
  )
}

export default PositionValueCell
