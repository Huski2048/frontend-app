/* eslint-disable no-unused-expressions */
import React from 'react'

import useTheme from 'hooks/useTheme'

import { BannerSection } from 'components/Banner/Banner'

import StakeBannerLeft from './StakeBannerLeft'
import StakeBannerMiddle from './StakeBannerMiddle'
import StakeBannerRight from './StakeBannerRight'

const StakeBannerBlock = ({ isMobile, reward, alpacaBalance, unlockedRewards }) => {
  const { isDark } = useTheme()
  return (
    <BannerSection>
      <StakeBannerLeft isMobile={isMobile} reward={reward} />

      <StakeBannerMiddle isDark={isDark} alpacaBalance={alpacaBalance} />

      <StakeBannerRight isDark={isDark} unlockedRewards={unlockedRewards} />
    </BannerSection>
  )
}

export default StakeBannerBlock
