import { Flex, Text } from 'husky-uikit'
import styled from 'styled-components'

const BaseCell = styled.div`
  color: black;
  padding: 26px 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  ${({ theme }) => theme.screen.phone} {
    padding: 10px 0 0;
    align-items: flex-start;
    justify-content: center;
  }
`

export const CellContent = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-height: 40px;
  ${Text} {
    line-height: 1;
  }
  ${({ theme }) => theme.screen.phone} {
    padding: 0;
    align-items: flex-start;
  }
`

export default BaseCell
