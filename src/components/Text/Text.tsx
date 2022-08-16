import styled from 'styled-components'
import { Text } from 'husky-uikit'

export const HighLightText = styled(Text)`
  color: #9054DB;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  ${({ theme }) => theme.screen.tablet} {
    font-size: 12px;
    line-height: 24px;
  }
`

export const HeadText = styled(Text)`
  color: #6F767E;
  font-size: 12px;
  line-height: 16px;
`

export const SuperBigText = styled(Text)`
  font-size: 24px;
  font-weight: 700;
  line-height: 44px;
  color: ${({ theme }) => theme.color.tableText };
  ${({ theme }) => theme.screen.tablet} {
    font-size: 16px;
    line-height: 28px;
  }
  ${({ theme }) => theme.screen.phone} {
    font-size: 20px;
    line-height: 30px;
  }
`

export const BigText = styled(Text)`
  font-size: 14px;
  font-weight: 700;
  line-height: 24px;
  color: ${({ color, theme }) =>(color || theme.color.tableText) };
  ${({ theme }) => theme.screen.tablet} {
    font-size: 12px;
  }
`

export const SmText = styled(Text)`
  color: ${({ theme }) => theme.color.tableText2 };
  font-size: 12px;
  line-height: 22px;
  font-weight: ${({ bold }) => (bold ? 700 : 400)};
  ${({ theme }) => theme.screen.tablet} {
    font-size: 10px;
  }
`

export const NormalText = styled(Text)`
  font-size: 14px;
  color: ${({ color, theme }) =>(color || theme.color.tableText) };
  ${({ theme }) => theme.screen.tablet} {
    font-size: 12px;
  }
`

export const NormalTextBold = styled(NormalText)`
  font-weight: 600;
`