import { Flex, Text } from 'husky-uikit'
import styled from 'styled-components'

const BaseCell = styled.div`
  color: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  ${({ theme }) => theme.screen.phone} {
    padding: 10px 0;
  }
`

export const CellContent = styled(Flex)`
  ${Text} {
    line-height: 1;
  }
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export default BaseCell
