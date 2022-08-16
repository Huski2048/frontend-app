/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { useLeverageFarms } from 'state/leverage/hooks'
import styled from 'styled-components'
import { Box, Button, Flex, Text, CardsLayout } from 'husky-uikit'
import { PancakeSwapIcon } from 'assets'
import { useTranslation } from 'contexts/Localization'
import SingleAssetsCard from './SingleAssetsCard'

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

const FilterOption = styled(Button)`
  padding: 10px;
  font-size: 13px;
  background-color: ${({ isActive }) => (isActive ? '#7B3FE4' : 'transparent')};
  // border-bottom: ${({ theme, isActive }) => (isActive ? `1px solid ${theme.colors.secondary}` : 'unset')};
  color: ${({ isActive }) => (isActive ? '#FFFFFF!important' : '#9D9D9D!important')};
  border-radius: 8px;
  color: #9d9d9d;
  height: 30px;
  > img {
    height: 26px;
    width: 26px;
    margin-right: 10px;
  }
  > svg {
    height: 26px;
    width: 26px;
    margin-right: 10px;
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
`

const FiltersWrapper = styled(Flex)`
  flex-direction: column;
  gap: 1rem;
  padding: 18px 0px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  *::-webkit-scrollbar {
    height: 4px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    gap: 0;
  }
  > ${Flex} {
    padding-left: 24px;
    padding-right: 1rem;
    font-size: 16px;
  }
  .strategyFilter {
    ${({ theme }) => theme.mediaQueries.lg} {
      border-left: 2px solid ${({ theme }) => theme.color.tableLine};
      justify-content: left;
    }
  }
  .dexFilter {
    ${({ theme }) => theme.mediaQueries.lg} {
      justify-content: left;
    }
  }
`

const StrategyIcon = styled.div<{ market: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 5px;
  background: ${({ market }) => {
    if (market.toLowerCase() === 'bear') {
      return '#FE6057'
    }
    if (market.toLowerCase() === 'bull') {
      return '#27C73F'
    }
    if (market.toLowerCase() === 'neutral') {
      return '#FCBD2C'
    }
    return null
  }};
`

const SingleAssetsTable: React.FC = () => {
  const { t } = useTranslation()
  const { data: farmsData } = useLeverageFarms()

  const singleData = farmsData.filter((f) => f.singleFlag === 0)

  const bnbArray = singleData.filter((f) => f.token.symbol === 'wBNB')
  const btcbArray = singleData.filter((f) => f.token.symbol === 'BTCB')
  const ethArray = singleData.filter((f) => f.token.symbol === 'ETH')
  const huskiArray = singleData.filter((f) => f.token.symbol === 'HUSKI')
  const cakeArray = singleData.filter((f) => f.quoteToken.symbol === 'CAKE' && f.singleFlag === 0)

  let singlesData = []

  if (bnbArray && bnbArray !== null && bnbArray !== undefined && bnbArray !== [] && bnbArray.length !== 0) {
    const tokenObject = {
      name: 'BNB',
      singleArray: bnbArray,
    }
    singlesData.push(tokenObject)
  }
  if (btcbArray && btcbArray !== null && btcbArray !== undefined && btcbArray !== [] && btcbArray.length !== 0) {
    const tokenObject = {
      name: 'BTCB',
      singleArray: btcbArray,
    }
    singlesData.push(tokenObject)
  }
  if (ethArray && ethArray !== null && ethArray !== undefined && ethArray !== [] && ethArray.length !== 0) {
    const tokenObject = {
      name: 'ETH',
      singleArray: ethArray,
    }
    singlesData.push(tokenObject)
  }
  if (huskiArray && huskiArray !== null && huskiArray !== undefined && huskiArray !== [] && huskiArray.length !== 0) {
    const tokenObject = {
      name: 'HUSKI',
      singleArray: huskiArray,
    }
    singlesData.push(tokenObject)

    // let single
    // const farmData = huskiArray
    // marketArray.map((item) => {
    //   const newObject = { farmData }
    //   single = { ...newObject, ...item }
    //   singlesData.push(single)
    // })
  }
  if (cakeArray && cakeArray !== null && cakeArray !== undefined && cakeArray !== [] && cakeArray.length !== 0) {
    const tokenObject = {
      name: 'CAKE',
      singleArray: cakeArray,
    }
    singlesData.push(tokenObject)
  }

  const [dexFilter, setDexFilter] = useState('all')
  const [strategyFilter, setStrategyFilter] = useState<string>('')

  if (dexFilter !== 'all') {
    singlesData = singlesData.filter((pool) => pool?.singleArray[0]?.lpExchange === dexFilter)
  }

  if (!strategyFilter.includes('bull') && strategyFilter !== '') {
    singlesData = singlesData.filter((pool) => pool?.name !== 'CAKE')
  }
  return (
    <StyledTable role="table">
      <FiltersWrapper>
        <Flex alignItems="left" className="dexFilter">
          <Text bold lineHeight="1.9">
            DEX :
          </Text>
          <Flex overflowX="auto" pl="10px">
            <FilterOption
              variant="tertiary"
              style={{ width: '60px', justifySelf: 'flex-start' }}
              isActive={dexFilter === 'all'}
              onClick={() => setDexFilter('all')}
            >
              {t('All')}
            </FilterOption>
            <FilterOption
              variant="tertiary"
              style={{ width: 'fit-content', justifySelf: 'flex-start' }}
              startIcon={<PancakeSwapIcon />}
              isActive={dexFilter === 'PancakeSwap'}
              onClick={() => setDexFilter('PancakeSwap')}
            >
              PancakeSwap
            </FilterOption>
          </Flex>
        </Flex>
        <Flex className="strategyFilter" alignItems="left" borderRight="none!important">
          <Text bold lineHeight="1.9">
            {t('Strategy :')}
          </Text>
          <Flex overflowX="auto" pl="10px" alignItems="left">
            <FilterOption
              variant="tertiary"
              isActive={strategyFilter === 'bear'}
              onClick={() => setStrategyFilter('bear')}
              startIcon={<StrategyIcon market="bear" />}
            >
              {t('Bear')}
            </FilterOption>
            <FilterOption
              variant="tertiary"
              isActive={strategyFilter === 'bull2x'}
              onClick={() => setStrategyFilter('bull2x')}
              startIcon={<StrategyIcon market="bull" />}
            >
              {t('Bull')}
            </FilterOption>
            <FilterOption
              variant="tertiary"
              isActive={strategyFilter === 'neutral'}
              onClick={() => setStrategyFilter('neutral')}
              startIcon={<StrategyIcon market="neutral" />}
            >
              {t('Neutral')}
            </FilterOption>
          </Flex>
        </Flex>
      </FiltersWrapper>
      <CardsLayout>
        {singlesData?.map((asset) => (
          <SingleAssetsCard data={asset} strategyFilter={strategyFilter} />
        ))}
      </CardsLayout>
    </StyledTable>
  )
}

export default SingleAssetsTable
