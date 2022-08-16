import React from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints, Box } from 'husky-uikit'
import LendRow from './LendRow'
import LendHeaderRow from './LendHeaderRow'

const StyledTable = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 5.75px 0 10px 0;
  background-color: ${({ theme }) => theme.card.background};

  ${({ theme }) => theme.screen.tablet} {
    padding: 15px 0;
  }
  ${({ theme }) => theme.screen.phone} {
    padding: 10px 0;
  }
`

const StyledTableBorder = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
`

const TableBlock = styled.div`
  padding-top: 0px;
`

const LendTable = ({ lendDatas }) => {
  const { isMobile } = useMatchBreakpoints()

  return (
    <StyledTableBorder>
      <StyledTable role="table">
        <Box>
          {!(isMobile) && <LendHeaderRow />}
          <TableBlock>
          {lendDatas.map((lendData) => (
            <LendRow lendData={lendData} key={lendData?.pid} />
          ))}
          </TableBlock>
        </Box>
      </StyledTable>
    </StyledTableBorder>
  )
}

export default LendTable
