import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Text, useMatchBreakpoints } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO } from 'config/index'
import { TokenPairImage } from 'components/TokenImage'
import BaseCell, { CellContent } from './BaseCell'
import { BigText, SmText } from 'components/Text/Text';

export const SNameCellPosition = styled(BaseCell)`
  flex: 1 0 80px;
`

const NameCell = ({ name, positionId }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  return (
    <SNameCellPosition role="cell">
      <CellContent>
        <BigText>
          {name}
        </BigText>
        <SmText mt="8px">
          #{positionId}
        </SmText>
      </CellContent>
    </SNameCellPosition>
  )
}

export default NameCell
