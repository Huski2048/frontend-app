import React, { useRef } from 'react'
import styled from 'styled-components'
import StakeRow from './StakeRow'

const StyledTable = styled.div``

const StyledTableBorder = styled.div`
  // border-radius: ${({ theme }) => theme.radii.card};
  // background-color: ${({ theme }) => theme.colors.cardBorder};
  // padding: 1px 1px 3px 1px;
  // background-size: 400% 400%;
`

const StakeTable = ({ poolsData, userDataLoaded }) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  // const scrollToTop = (): void => {
  //   tableWrapperEl.current.scrollIntoView({
  //     behavior: 'smooth',
  //   })
  // }
  return (
    <StyledTableBorder>
      <StyledTable role="table" ref={tableWrapperEl}>
        {poolsData.map((poolData) => (
          <StakeRow poolData={poolData} userDataLoaded={userDataLoaded} key={poolData.pid} />
        ))}
      </StyledTable>
    </StyledTableBorder>
  )
}

export default StakeTable
