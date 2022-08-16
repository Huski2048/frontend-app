import styled from 'styled-components'
import { Box, Button } from 'husky-uikit'

export const Tabs = styled(Box)`
  padding: 24px;
`;


export const ActionButton = styled(Button)`
  padding: 0.75rem 2rem;
  font-size: 14px;
  font-weight: 400;
  height: auto;
  box-shadow: none;
`

export const Tab = styled(ActionButton)`
  background-color: unset;
  border-bottom: ${({ isActive, theme }) => (isActive === 'true' ? `2px solid ${theme.colors.positions}` : 'unset')};
  color: ${({ isActive, theme }) => (isActive === 'true' ? theme.colors.positions : theme.colors.textSubtle)};
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  border-radius: unset;
  padding: 0 0 20px 0;
  &:first-child {
    margin-right: 1rem;
  }
`