import React from 'react'
import styled from 'styled-components'
import { BigText, SmText } from 'components/Text/Text'
import { Box } from 'husky-uikit'
import BaseCell, { CellContent } from './BaseCell'

export const SNameCell = styled(BaseCell)`
  flex: 1 0 80px;
  ${({ theme }) => theme.screen.phone} {
    flex: 1
  }
`

const NameCell = ({ name, positionId }) => {
  return (
    <SNameCell role="cell">
      <CellContent>
        <Box>
          <BigText> {name} </BigText>
          <SmText style={{ marginTop: '5px' }}> #{positionId} </SmText>
        </Box>
      </CellContent>
    </SNameCell>
  )
}

export default NameCell
