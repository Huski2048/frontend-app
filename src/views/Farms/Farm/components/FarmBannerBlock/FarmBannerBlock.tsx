/* eslint-disable no-unused-expressions */
import React from 'react'
import styled from 'styled-components'

import {
  BannerSection,
  BannerLeft,
  BannerRight,
  LineItem,
  LineLeft,
  LineRight,
  BannerBigText,
  BannerSmText,
  BannerIcon,
} from 'components/Banner/Banner'

import useTheme from 'hooks/useTheme'

import FarmBannerLeft from './FarmBannerLeft'
import FarmBannerRight from './FarmBannerRight'

const FarmBannerBlock = ({ isMobile, reward, account }) => {
  const { isDark } = useTheme()
  console.log(isDark)
  return (
    <>
      <BannerSection>
        <FarmBannerLeft isMobile={isMobile} />
        <FarmBannerRight isDark={isDark} reward={reward} account={account} />
      </BannerSection>
    </>
  )
}

export default FarmBannerBlock
