import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { useMatchBreakpoints } from 'husky-uikit'

import BigNumber from 'bignumber.js'
import Page from 'components/Layout/Page'

import { usePools } from 'state/pool/hooks'
import { DEFAULT_TOKEN_DECIMAL } from 'config/index'
import { useVolume24h } from '../../state/graph/hooks'
import LockTable from './components/LockTable/LockTable'

import LockBannerBlock from './components/LockBannerBlock/LockBannerBlock'
import LockHuskiBoxBlock from './components/LockHuskiBox/LockHuskiBox'

const Lock: React.FC = () => {
  const { account } = useWeb3React()
  const { data: poolsData } = usePools()
  const volume24h = useVolume24h()
  const lockData = poolsData.filter((f) => f.pid === 5)

  // =============banner==============

  let reward = 0
  poolsData.map((stake) => {
    const earnings = new BigNumber(parseFloat(stake?.userData?.earnedHuski)).div(DEFAULT_TOKEN_DECIMAL).toNumber()
    reward += earnings
    return reward
  })

  const { isMobile, isTablet } = useMatchBreakpoints()
  const isSmallScreen = isMobile || isTablet
  // const { isDark } = useTheme()

  return (
    <Page>
      <LockBannerBlock isMobile={isMobile} totalValueLocked={1} totalValueLockedValue={1} volume24h={volume24h} />

      <LockHuskiBoxBlock isSmallScreen={isSmallScreen} reward={reward} account={account} />

      <LockTable data={lockData} />
    </Page>
  )
}

export default Lock
