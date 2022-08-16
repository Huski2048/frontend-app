/* eslint-disable no-unused-expressions */
import React from 'react'

import useTheme from 'hooks/useTheme'

import { BannerSection } from 'components/Banner/Banner'

import LendBannerLeft from './LendBannerLeft'
import LendBannerMiddle from './LendBannerMiddle'
import LendBannerRight from './LendBannerRight'

const LendBannerBlock = ({ isMobile, totalValueLocked, totalValueLockedValue, volume24h }) => {
  const { isDark } = useTheme()
  return (
    <BannerSection>
      <LendBannerLeft isMobile={isMobile} />

      <LendBannerMiddle isDark={isDark} volume24h={volume24h} />

      <LendBannerRight
        isDark={isDark}
        totalValueLocked={totalValueLocked}
        totalValueLockedValue={totalValueLockedValue}
      />
    </BannerSection>
  )
}

export default LendBannerBlock
