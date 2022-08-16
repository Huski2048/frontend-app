import styled from 'styled-components'

import { Text, Button, Flex } from 'husky-uikit'

export const BannerSmText = styled(Text)`
  font-size: 12px;
  color: ${({ theme }) => theme.color.BannerSmText};
  font-weight: bold;
`

export const BannerBigText = styled(Text)`
  font-family: 'Baloo Bhai 2';
  font-size: 28px;
  color: ${({ theme }) => theme.color.BannerBigText};
  font-weight: 600;
  margin: 0;
`

export const LineItem = styled(Flex)`
  align-content: center;
  align-items: center;
  flex: 1;
  ${({ theme }) => theme.screen.phone} {
    padding: 0 20px;
    gap: 20px;
    ${BannerSmText} {
      flex: 1 0 108px;
    }
  }
`

export const LineLeft = styled(Flex)`
  flex: 1;
  align-content: center;
`

export const LineRight = styled(Flex)`
  width: 120px;
  justify-content: center;
  align-items: center;
`

export const BannerSection = styled(Flex)`
  height: 135px;
  margin-bottom: 17px !important;
  ${({ theme }) => theme.screen.tablet} {
    margin-bottom: 14px !important;
    height: 100px;
  }
  ${({ theme }) => theme.screen.phone} {
    margin-bottom: ${({ theme }) => theme.gap.card} !important ;
    height: auto;
    flex-direction: column;
  }
`

export const BannerLeft = styled(Flex)`
  flex: 1;
  align-items: center;
  margin-right: ${({ theme }) => theme.gap.card};
  border-radius: ${({ theme }) => theme.radius.card};
  background-position: right;
  background-size: cover;
  background-repeat: no-repeat;
  padding: 10px 32px;
  overflow: hidden;
  h2 {
    font-family: 'BalooBhaijaan';
    font-size: 36px;
    color: #fff;
    padding-left: 38px;
    align-items: center;
    ${({ theme }) => theme.screen.tablet} {
      font-size: 28px;
      padding-left: 15px;
    }
  }
  ${LineItem} {
    justify-content: flex-start;
    width: 100%;
  }
  ${({ theme }) => theme.screen.tablet} {
    padding: 10px 16px;
    margin-right: 14px;
  }
  ${({ theme }) => theme.screen.phone} {
    padding: 0;
    margin: 0 0 10px;
    flex: 1 0 60px;
    border-radius: 10px;
    h2 {
      font-size: 20px;
    }
  }
`

export const BannerMiddle = styled(Flex)<{ isDark: boolean }>`
  width: 222px;
  padding: 10px 24px;
  border-radius: ${({ theme }) => theme.radius.card};
  margin-right: ${({ theme }) => theme.gap.card};
  background-color: rgb(123, 63, 228, 0.25);
  flex-direction: column;
  justify-content: space-between;
  background-color: ${({ isDark }) => (isDark ? 'rgb(57,71,79)' : 'rgb(123,63,228,0.25)')};
  ${({ theme }) => theme.screen.tablet} {
    width: 188px !important;
    padding: 10px 16px;
    margin-right: 14px;
  }
  ${({ theme }) => theme.screen.phone} {
    margin: 0 0 10px 0;
    width: auto !important;
    padding: 10px 0;
    flex: 1 0 60px;
    border-radius: 10px;
  }
`

export const BannerRight = styled(Flex)<{ isDark: boolean }>`
  width: 320px;
  padding: 10px 25px;
  flex-direction: column;
  justify-content: space-between;
  border-radius: ${({ theme }) => theme.radius.card};
  background-color: ${({ isDark }) => (isDark ? 'rgb(57,71,79)' : '#E3F0F6')};
  ${({ theme }) => theme.screen.tablet} {
    width: 188px !important;
    padding: 10px 16px;
  }
  ${({ theme }) => theme.screen.phone} {
    width: auto !important;
    padding: 10px 0;
    flex: 1 0 60px;
    border-radius: 10px;
  }
`

export const BannerIcon = styled.img`
  height: 36px;
  width: 36px;
  ${({ theme }) => theme.screen.tablet} {
    height: 30px;
    width: 30px;
  }
`

export const SButton = styled(Button)`
  font-size: 14px;
  font-weight: 400;
  box-shadow: none;
  width: 100%;
  height: 34px;
  border-radius: ${({ theme }) => theme.radius.button};
  text-align: center;
  display: flex;
  background: #fff;
  justify-content: center;
  flex-direction: column;
  color: #1a1d1f;
  ${({ theme }) => theme.screen.tablet} {
    height: 24px;
    width: 68px;
    border-radius: 6px;
    font-size: 10px;
  }
`
