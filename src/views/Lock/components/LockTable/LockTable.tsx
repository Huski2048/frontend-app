import React, { useRef } from 'react'
import styled from 'styled-components'
import LockRow from './LockRow'

const StyledTable = styled.div`
  border-radius: ${({ theme }) => theme.radii.card} !important;
  overflow: hidden;
  > div:not(:last-child) {
    // border-bottom: 2px solid ${({ theme }) => theme.colors.disabled};
    margin-bottom: 10px;
  }
`

const StyledTableBorder = styled.div`
  border-radius: ${({ theme }) => theme.radius.card};
`

const LockTable = ({ data }) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null)
 
  return (
    <StyledTableBorder>
      <StyledTable role="table" ref={tableWrapperEl}>
        <LockRow lockData={data} key={data.pid} />
      </StyledTable>
    </StyledTableBorder>
  )
}

export default LockTable
