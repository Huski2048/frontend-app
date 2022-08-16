import React from 'react'
import styled from 'styled-components'
import { BigText } from 'components/Text/Text'
import { HuskiTokenIcon } from 'assets'
import BaseCell from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  ${({ theme }) => theme.screen.phone} {
    width: 100%;
    gap: 20px;
  }
  .tableIcon {
    width: 44px;
    height: 44px;

    ${({ theme }) => theme.screen.tablet} {
      width: 30px;
      height: 30px;
    }
  }
`

const NameCell = ({ data }) => {
  return (
    <StyledCell role="cell">
      <HuskiTokenIcon width="44px" height="44px" className="tableIcon" />
      <BigText ml="10px">{data.name}</BigText>
    </StyledCell>
  )
}

export default NameCell
