import React from 'react'
import styled from 'styled-components'

import { Button, Flex, Box, Text, useMatchBreakpoints } from 'husky-uikit'
import { BnbIcon, BtcbIcon, BusdIcon, EthIcon, PancakeSwapIcon, HuskiTokenIcon } from 'assets'
import Select from 'components/Select/SelectSort'
import SearchInput from 'components/SearchInput'
import { useTranslation } from 'contexts/Localization'

const LeverageTableControlBox = ({
  active,
  dexFilter,
  setDexFilter,
  handleSortOptionChange,
  handleChangeQuery,
}) => {
    const { t } = useTranslation()
  return (
    <>
      <FiltersWrapper>
        <SSortRowLeft>
          <SFText>DEX :</SFText>
          <Flex>
            <FilterOption
              variant="tertiary"
              style={{ width: '60px' }}
              isActive={dexFilter === 'all'}
              onClick={() => setDexFilter('all')}
            >
              {t('All')}
            </FilterOption>
            <FilterOption
              variant="tertiary"
              style={{ width: 'fit-content' }}
              startIcon={<PancakeSwapIcon />}
              isActive={dexFilter === 'PancakeSwap'}
              onClick={() => setDexFilter('PancakeSwap')}
            >
              &nbsp;PancakeSwap
            </FilterOption>
          </Flex>
        </SSortRowLeft>
        <SSortRowMiddle>
          <SFText>{t('Sort by :')}</SFText>
          <Box ml="5px">
            <Select
              options={[
                {
                  label: `${t('Default')}`,
                  value: 'default',
                },
                {
                  label: `${t('APY')}`,
                  value: 'apy',
                },
                {
                  label: `${t('TVL')}`,
                  value: 'tvl',
                },
              ]}
              onChange={handleSortOptionChange}
            />
          </Box>
        </SSortRowMiddle>
        <SSortRowRight>
          <SearchInput onChange={handleChangeQuery} placeholder={t('Search farms')} />
        </SSortRowRight>
      </FiltersWrapper>
    </>
  )
}

export default LeverageTableControlBox

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

const SFText = styled(Text)`
  color: ${({ color, theme }) => color || theme.color.tableText};
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  margin-right: 20px;
  ${({ theme }) => theme.screen.tablet} {
    font-size: 12px;
    line-height: 24px;
  }
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
