import React from 'react'
import styled from 'styled-components'
import { Box } from 'husky-uikit'
import { TokenImage } from 'components/TokenImage'
import { BigText, } from 'components/Text/Text'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 5;
  flex-direction: row;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 7rem;
  }
  ${({ theme }) => theme.screen.phone} {
    flex: 1;
    justify-content: flex-start;
    margin: 0;
    padding: 0;
  }
  ${CellContent} {
    flex-direction: row;
    ${({ theme }) => theme.screen.phone} {
      align-items: center;
    }
  }
`

const NameCell = ({ poolData }) => {
  return (
    <StyledCell role="cell">
      <CellContent alignItems="center">
        <Box width={44} height={44} mr="1rem">
          <TokenImage token={poolData.token} width={44} height={44} />
        </Box>
        <BigText>
          {poolData.pool.symbol}
        </BigText>
      </CellContent>
    </StyledCell>
  )
}

export default NameCell
