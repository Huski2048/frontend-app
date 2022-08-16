/* eslint-disable no-unused-expressions */
import React from 'react'
import { useMatchBreakpoints } from 'husky-uikit'
import Page from 'components/Layout/Page'
import { useLeverageFarms} from 'state/leverage/hooks'
import { usePools } from 'state/pool/hooks'
import { useVolume24h } from '../../state/graph/hooks'
import LendTable from './components/LendTable/LendTable'

import { useGetTotalValueLocked } from './hooks/useTotalValueLocked'
import LendBannerBlock from './components/LendBannerBlock/LendBannerBlock'

const Lend: React.FC = () => {
  const { data: farmsData } = useLeverageFarms()
  const { data: lendDatas } = usePools()
  const lpTokensTvl = 1

  const totalValueLocked = useGetTotalValueLocked(lpTokensTvl, farmsData, lendDatas)
  const totalValueLockedValue = totalValueLocked.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  const { isMobile } = useMatchBreakpoints()
  const volume24h = useVolume24h()

  return (
    <Page>
      <LendBannerBlock
        isMobile={isMobile}
        totalValueLocked={totalValueLocked}
        totalValueLockedValue={totalValueLockedValue}
        volume24h={volume24h}
      />

      <LendTable lendDatas={lendDatas} />
    </Page>
  )
}

export default Lend
