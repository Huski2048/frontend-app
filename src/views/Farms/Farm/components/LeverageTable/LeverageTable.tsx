import React, { useState, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'
import { Button, Flex, Box, Text, useMatchBreakpoints } from 'husky-uikit'
import SearchInput from 'components/SearchInput'
import Select from 'components/Select/SelectSort'
import { usePools } from 'state/pool/hooks'
import { useTradeFees } from 'state/graph/hooks'
import { useCakePrice, useHuskiPrice, useLeverageFarms } from 'state/leverage/hooks'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { useTranslation } from 'contexts/Localization'
import { latinise } from 'utils/latinise'
import { getPoolApr } from 'utils/apr'
import { LeverageFarm } from 'state/types'
import { isUndefined, orderBy } from 'lodash'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'config'
import { BnbIcon, BtcbIcon, BusdIcon, EthIcon, PancakeSwapIcon, HuskiTokenIcon } from 'assets'
import { getHuskyRewards, getYieldFarming, getTvl } from '../../../helpers'
import DisplayTable from './DisplayTable'

import LeverageTableControlBox from './LeverageTableControlBox'
import LeverageControlAssets from './LeverageControlAssets'

const NUMBER_OF_FARMS_VISIBLE = 5

const StyledTable = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 24px 0;
  background-color: ${({ theme }) => theme.card.background};
  > ${Box} {
    overflow: auto;
    ::-webkit-scrollbar {
      height: 8px;
    }
  }
`

const StyledTableBorder = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
`

const FilterOption = styled(Button)`
  /* padding: 5px; */
  font-size: 13px;
  height: 30px;
  background-color: ${({ isActive }) => (isActive ? '#7B3FE4' : 'transparent')};
  color: ${({ isActive, theme }) => (isActive ? 'white' : theme.isDark ? '#6F767E' : '#9D9D9D')};
  border-radius: 10px;
  margin: 0 5px;
  padding: 0 24px;
  > svg {
    height: 24px;
    width: 24px;
    path {
      height: auto;
      width: 100%;
    }
    &.allFilter {
      fill: #f7931a;
    }
  }
  &:active:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled) {
    transform: none;
  }
  ${({ theme }) => theme.screen.tablet} {
    padding: 0 10px;
  }
`

const SFText = styled(Text)`
  color: ${({ color, theme }) => color || theme.color.tableText};
  font-size: 14px;
  font-weight: 600;
  ${({ theme }) => theme.screen.tablet} {
    font-size: 12px;
    line-height: 24px;
  }
`

const FiltersWrapper = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  padding: 0 24px;
  ${({ theme }) => theme.screen.phone} {
    flex-direction: column;
  }
`

const SSortRowLeft = styled(Flex)`
  flex: 1 0 240px;
  align-items: center;
  ${({ theme }) => theme.screen.tablet} {
    flex: 1 0 240px;
  }
  ${({ theme }) => theme.screen.phone} {
    flex: 1;
  }
`
const SSortRowMiddle = styled(Flex)`
  flex: 1 0 200px;
  align-items: center;
  ${({ theme }) => theme.screen.tablet} {
    flex: 1 0 180px;
  }
  ${({ theme }) => theme.screen.phone} {
    flex: 1;
    padding: 10px 0px;
  }
`
const SSortRowRight = styled(Flex)`
  flex: 1;
  ${({ theme }) => theme.screen.tablet} {
    flex: 1 0 180px;
  }
  ${({ theme }) => theme.screen.phone} {
    flex: 1;
    margin-bottom: 10px;
  }
`

const SFilterRow = styled(Flex)`
  margin-top: 10px;
  padding: 0 24px;
  ${({ theme }) => theme.screen.phone} {
    flex-direction: column;
  }
`

const SFilterRowInner = styled(Flex)`
  overflow: auto;
  // reduce scrollbar height
  ::-webkit-scrollbar {
    height: 4px;
  }
  ${({ theme }) => theme.screen.phone} {
    // flex-direction: column;
  }
`

const LeverageTable = () => {
  // let farmsData = leverageData
  let { data: farmsData } = useLeverageFarms()
  const { data: poolsData } = usePools()
  const tradeFees = useTradeFees()
  const { t } = useTranslation()
  const chosenFarmsLength = useRef(0)
  const huskyPrice = useHuskiPrice()
  const cakePrice = useCakePrice()
  const [sortOption, setSortOption] = useState('default')
  const [dexFilter, setDexFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [pairFilter, setPairFilter] = useState('all')
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [numberOfFarmsVisible, setNumberOfFarmsVisible] = useState(NUMBER_OF_FARMS_VISIBLE)
  const { isMobile, isTablet } = useMatchBreakpoints()
  const isSmallScreen = isMobile || isTablet

  if (searchQuery) {
    const lowercaseQuery = latinise(searchQuery.toLowerCase())
    farmsData = farmsData.filter((pool) => pool.lpSymbol.toLowerCase().includes(lowercaseQuery))
  }

  if (pairFilter !== 'all') {
    farmsData = farmsData.filter(
      (pool) =>
        pool?.quoteToken?.symbol.toLowerCase() === pairFilter || pool?.token?.symbol.toLowerCase() === pairFilter,
    )
  }

  if (dexFilter !== 'all') {
    farmsData = farmsData.filter((pool) => pool?.lpExchange === dexFilter)
  }

  const active = () => {
    console.log('aaaaaaa')
  }

  const farmsDataWithAPR: LeverageFarm[] = farmsData.map((farm) => {
    const pool = poolsData.find((f) => f.pid === farm.pool.pid)
    const tradeFee = tradeFees.find((f) => f.pid === farm.pid)
    const lpTokenRatio = new BigNumber(farm.pancakeLpData.masterChefBalance).div(
      new BigNumber(farm.pancakeLpData.totalSupply),
    )
    const tokenAmountTotal = new BigNumber(farm.tokensLpData.tokenLpBalance).div(
      BIG_TEN.pow(farm.tokensLpData.tokenDecimals),
    )
    const quoteTokenAmountTotal = new BigNumber(farm.tokensLpData.quoteTokenLpBalance).div(
      BIG_TEN.pow(farm.tokensLpData.quoteTokenDecimals),
    )
    const quoteTokenAmountMc = quoteTokenAmountTotal.times(lpTokenRatio)
    const lpTotalInQuoteToken = quoteTokenAmountMc.times(new BigNumber(2))
    const debtPoolRewardPerBlock = new BigNumber(pool.fairLaunchData.huskyPerBlock)
      .times(new BigNumber(pool.fairLaunchData.debtPoolAllocPoint))
      .div(new BigNumber(pool.fairLaunchData.totalAllocPoint))
    const huskyRewards = getHuskyRewards(
      pool.vaultData.vaultDebtVal,
      debtPoolRewardPerBlock,
      farm.tokenPriceUsd,
      huskyPrice,
    )

    const poolWeight = new BigNumber(farm.masterChefData.poolAllocPoint).div(
      new BigNumber(farm.masterChefData.totalAllocPoint),
    )
    const yieldFarmData = getYieldFarming(
      farm.quoteTokenPriceUsd,
      poolWeight,
      lpTotalInQuoteToken,
      new BigNumber(cakePrice),
    )
    const tradingFee = isUndefined(tradeFee) ? 0 : tradeFee.tradingFee
    const apr = getPoolApr(yieldFarmData, tradingFee, huskyRewards, pool.vaultData.interestRatePerYear, farm.leverage)
    // eslint-disable-next-line no-restricted-properties
    const apy = Math.pow(1 + apr / 365, 365) - 1
    const { totalTvl } = getTvl(
      farm.tokenPriceUsd,
      farm.quoteTokenPriceUsd,
      farm.pancakeLpData.totalSupply,
      tokenAmountTotal,
      quoteTokenAmountTotal,
      farm.masterChefData.userInfo,
    )
    return { ...farm, huskyRewards, yieldFarmData, tradingFee, apy, totalTvl }
  })

  const chosenFarmsMemoized = useMemo(() => {
    const sortPools = (dataToSort) => {
      switch (sortOption) {
        case 'apy':
          return orderBy(dataToSort, 'apy', 'desc')
        case 'tvl':
          return orderBy(dataToSort, 'totalTvl', 'desc')

        default:
          return dataToSort
      }
    }

    return sortPools(farmsDataWithAPR).slice(0, numberOfFarmsVisible)
  }, [farmsDataWithAPR, numberOfFarmsVisible, sortOption])
  chosenFarmsLength.current = chosenFarmsMemoized.length

  useEffect(() => {
    if (isIntersecting) {
      setNumberOfFarmsVisible((farmsCurrentlyVisible) => {
        if (farmsCurrentlyVisible <= chosenFarmsLength.current) {
          return farmsCurrentlyVisible + NUMBER_OF_FARMS_VISIBLE
        }
        return farmsCurrentlyVisible
      })
    }
  }, [isIntersecting])

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleSortOptionChange = (option) => {
    setSortOption(option.value)
  }

  return (
    <>
      <StyledTableBorder>
        <StyledTable role="table">
          <Box>
            <LeverageTableControlBox
              active={active}
              dexFilter={dexFilter}
              setDexFilter={setDexFilter}
              handleSortOptionChange={handleSortOptionChange}
              handleChangeQuery={handleChangeQuery}
            />
            <LeverageControlAssets
              isSmallScreen={isSmallScreen}
              pairFilter={pairFilter}
              setPairFilter={setPairFilter}
            />

            <DisplayTable leverageData={chosenFarmsMemoized} farmsData={farmsDataWithAPR} />
          </Box>
          <div ref={observerRef} />
        </StyledTable>
      </StyledTableBorder>
    </>
  )
}

export default LeverageTable
