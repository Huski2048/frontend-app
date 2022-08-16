/* eslint-disable no-unused-expressions */
import React from 'react'
import styled from 'styled-components'
import LockMascot from 'assets/lendMascot-big.svg'

import { BannerLeft } from 'components/Banner/Banner'

import PawTop from 'assets/pawTop.svg'
import PawCenter from 'assets/pawCenter.svg'
import PawBottom from 'assets/pawBottom.svg'
import BgHalfCircle from 'assets/bgHalfCircle.svg'
import { Flex } from 'husky-uikit'

const LockBannerLeft = ({ isMobile }) => {
  return (
    <SBannerLeft>
      <SBannerLeftText>Huski Finance</SBannerLeftText>
      {isMobile ? null : <img src={LockMascot} alt="huski mascot" />}
    </SBannerLeft>
  )
}

export default LockBannerLeft

const SBannerLeft = styled(BannerLeft)`
  background: url(${PawTop}) no-repeat top left 12%, url(${PawCenter}) no-repeat top 7.5% left 0px,
    url(${PawBottom}) no-repeat bottom 0px left 7%, url(${BgHalfCircle}) no-repeat top center,
    linear-gradient(106.6deg, #7B3FE4 0%, #7B3FE4 69.36%);
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
  ${({ theme }) => theme.screen.tablet} {
    font-size: 28px;
  }
`
