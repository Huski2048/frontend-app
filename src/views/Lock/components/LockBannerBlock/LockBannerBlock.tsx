/* eslint-disable no-unused-expressions */
import React from 'react'

import useTheme from 'hooks/useTheme'

import { BannerSection } from 'components/Banner/Banner'

import LockBannerLeft from './LockBannerLeft'
import LockBannerMiddle from './LockBannerMiddle'
import LockBannerRight from './LockBannerRight'

const LockBannerBlock = ({ isMobile, totalValueLocked, totalValueLockedValue, volume24h }) => {
  const { isDark } = useTheme()
  return (
    <BannerSection>
      <LockBannerLeft isMobile={isMobile} />

      <LockBannerMiddle isDark={isDark} volume24h={volume24h} />

      <LockBannerRight
        isDark={isDark}
        totalValueLocked={totalValueLocked}
        totalValueLockedValue={totalValueLockedValue}
      />
    </BannerSection>
  )
}

export default LockBannerBlock
