/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
import Page from 'components/Layout/Page'
import React, { useState } from 'react'

import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { Box, useMatchBreakpoints } from 'husky-uikit'
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
import { TableCard } from 'components/Card/index'
import { Tabs, Tab } from 'components/Tab/Tab'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { DEFAULT_TOKEN_DECIMAL } from 'config/index'
import useTheme from 'hooks/useTheme'
import { usePools } from 'state/pool/hooks'
import LeverageTable from './components/LeverageTable/LeverageTable'
import ActivePositionsTable from './components/PositionsTable/ActivePositionsTable'
import LiquidatedPositionsTable from './components/PositionsTable/LiquidatedPositionsTable'
import SingleAssetsTable from './components/SingleAssetsTable/SingleAssetsTable'
import { usePositionsData } from './hooks/usePositions'

import FarmBannerBlock from './components/FarmBannerBlock/FarmBannerBlock'

const SBannerLeft = styled(BannerLeft)`
  background-image: url('/images/leverage.png');
`

const SBannerRight = styled(BannerRight)`
  width: 320px;
  ${({ theme }) => theme.screen.tablet} {
    width: 277px !important;
  }
`

const Leverage = ({ farmType }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  // const { data: farmsData } = useLeverageFarms()
  const { data: poolsData } = usePools()
  const [isActivePos, setActive] = useState(true)
  const { isDark } = useTheme()
  const { positionsData, fetchStatus } = usePositionsData()
  const { isMobile } = useMatchBreakpoints()

  let reward = 0
  poolsData.map((pool) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    const farmEarnings = new BigNumber(parseFloat(pool?.userData?.earnedHuski)).div(DEFAULT_TOKEN_DECIMAL).toNumber()
    reward += farmEarnings
    return reward
  })

  return (
    <Page>
      <FarmBannerBlock isMobile={isMobile}  reward={reward} account={account} />

      <TableCard>
        <Tabs>
          <Box>
            <Tab isActive={isActivePos ? 'true' : 'false'} onClick={() => setActive(true)}>
              {t('Active Positions')}
            </Tab>
            <Tab isActive={isActivePos ? 'false' : 'true'} onClick={() => setActive(false)}>
              {t('Liquidated Positions')}
            </Tab>
          </Box>
        </Tabs>
        {isActivePos ? (
          <ActivePositionsTable positionsData={positionsData} fetchStatus={fetchStatus} />
        ) : (
          <LiquidatedPositionsTable data={null} />
        )}
      </TableCard>

      {farmType === 'single' ? <SingleAssetsTable /> : <LeverageTable />}
    </Page>
  )
}

export default Leverage
