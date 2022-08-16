import styled from 'styled-components'
import { Box } from 'husky-uikit'

export const TableCard = styled(Box)`
  width: ${({ width }) => width ?? '100%'};
  border-radius: ${({ theme }) => theme.radius.card};
  padding: 0;
  background-color: ${({ theme }) => theme.color.card};
  overflow: hidden;
`;

const Card = styled(Box)<{
  width?: string
  padding?: string
  border?: string
  borderRadius?: string
}>`
  width: ${({ width }) => width ?? '100%'};
  border-radius: 16px;
  padding: 1.25rem;
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
  background-color: ${({ theme }) => theme.color.background};
`
export default Card

export const LightCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.colors.background};
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
`

export const LightGreyCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.background};
`

export const GreyCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.dropdown};
`
