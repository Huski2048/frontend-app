import styled from 'styled-components'
import { Card as UiKitCard } from 'husky-uikit'

export const Card = styled(UiKitCard)`
  margin: 0 0px 24px;
  display: flex;
  flex-direction: column;
  align-self: baseline;
  position: relative;
  color: ${({ theme }) => theme.colors.secondary};
  background: ${({ theme }) => theme.card.background};
  border-radius: ${({ theme }) => theme.radii.card};
  ${({ theme }) => theme.screen.tablet} {
    grid-column: span 6 !important
  }
`

export default Card
