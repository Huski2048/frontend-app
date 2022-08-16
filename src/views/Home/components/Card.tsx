import styled from 'styled-components'
import { Flex } from 'husky-uikit'

const Card = styled(Flex)`
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.default};

  flex: 1 1 0px;
  &.learnMore {
    background: ${({ theme }) => theme.colors.backgroundAlt};
    box-shadow: 0px 0px 24px 0px rgba(123, 122, 123, 0.06);
    justify-content: space-between;
  }
  &.auditedBy {
    background: #fff;
    border: 1px solid #7b7a7b;
    box-shadow: 0px 0px 10px 0px rgba(123, 122, 123, 0.14);
  }
  &.community {
    padding: 1rem 2rem;
    border: 2px solid transparent;
    > * {
      margin: 1rem 0;
      flex: 1;
      &:first-child {
        img {
          margin-bottom: 1em;
        }
      }
    }
  }
`

export default Card
