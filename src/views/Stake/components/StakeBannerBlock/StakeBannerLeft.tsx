/* eslint-disable no-unused-expressions */
import React from 'react'
import styled from 'styled-components'
import lendMascot from 'assets/lendMascot-big.svg'

import { BannerLeft, LineItem, BannerBigText } from 'components/Banner/Banner'
import { Text, Skeleton,  Flex } from 'husky-uikit'

import BigNumber from 'bignumber.js'

import { useTranslation } from 'contexts/Localization'

const LendBannerLeft = ({ isMobile, reward }) => {
  const { t } = useTranslation()
  return (
    <SBannerLeft>
      <SBannerLeftText>Huski Finance</SBannerLeftText>
      <SBannnerLeftNum>
        <LineItem>
          <LineText>{t('HUSKI earned')}</LineText>
        </LineItem>
        <LineItem py={isMobile ? '5px!important' : null}>
          {reward ? <SBigText>{new BigNumber(reward).toFixed(3, 1)}</SBigText> : <Skeleton width="50%" height="30px" />}
        </LineItem>
      </SBannnerLeftNum>
      {isMobile ? null : <img src={lendMascot} alt="huski mascot" />}
    </SBannerLeft>
  )
}

export default LendBannerLeft

const SBannerLeft = styled(BannerLeft)`
  background: linear-gradient(106.6deg, #7b3fe4 0%, #7b3fe4 69.36%);
  backdrop-filter: blur(200px);
  img {
    width: 139.5px;
    height: 138.77px;
    position: absolute;
    right: 23.25px;
    bottom: -20px;
    z-index: -1;
    ${({ theme }) => theme.screen.tablet} {
      width: 99.28px;
      height: 84.61px;
      position: absolute;
      right: 5.72px;
      bottom: -11px;
      z-index: -1;
    }
  }
`

const SBannerLeftText = styled(Flex)`
  font-family: 'BalooBhaijaan';
  font-size: 36px;
  color: #fff;
  padding-left: 8px;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: none;
  ${({ theme }) => theme.screen.tablet} {
    font-size: 28px;
    display: block;
  }
`

const SBannnerLeftNum = styled.div`
  display: block;
  width: 300px;
  height: 125px;
  ${({ theme }) => theme.screen.tablet} {
    display: none;
  }
`

const LineText = styled(Text)`
    color:#FFFFFF; 
    font-size:12px; 
    font-weight:700;
    margin-top: 20px;
    margin-bottom: 30px;
`

const SBigText = styled(BannerBigText)`
  color: #fff;
 
`
