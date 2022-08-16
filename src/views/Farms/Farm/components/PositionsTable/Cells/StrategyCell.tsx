import React from 'react'
import styled from 'styled-components'
import { Skeleton, Text, useMatchBreakpoints, Flex } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import { SmText } from 'components/Text/Text';
import BaseCell, { CellContent } from './BaseCell'

export const SStrategyCell = styled(BaseCell)`
  flex: 1 0 100px;
`

const StrategyCell = ({ strategy }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()

  const { t } = useTranslation()

  return (
    <SStrategyCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Flex alignItems="center">
            <SmText textAlign="left">
              {t('Strategy')}
            </SmText>
          </Flex>
        )}
        {strategy ? <Text>{strategy}</Text> : <Skeleton width="80px" height="16px" />}
      </CellContent>
    </SStrategyCell>
  )
}

export default StrategyCell
