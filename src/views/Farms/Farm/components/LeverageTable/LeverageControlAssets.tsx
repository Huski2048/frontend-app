import React from 'react'
import styled from 'styled-components'
import { Button, Flex, Box, Text, useMatchBreakpoints } from 'husky-uikit'

import { useTranslation } from 'contexts/Localization'

import { BnbIcon, BtcbIcon, BusdIcon, EthIcon, PancakeSwapIcon, HuskiTokenIcon } from 'assets'

const LeverageControlAssets = ({ isSmallScreen, pairFilter, setPairFilter }) => {
  const { t } = useTranslation()
  return (
    <>
      <SFilterRow alignItems={isSmallScreen ? null : 'center'} mt={10}>
        <SFText bold>{t('Paired Assets :')}</SFText>
        <SFilterRowInner padding="4px 0">
          <FilterOption
            variant="tertiary"
            style={{ width: '60px' }}
            isActive={pairFilter === 'all'}
            onClick={() => setPairFilter('all')}
          >
            All
          </FilterOption>
          <FilterOption
            variant="tertiary"
            style={{ width: 'fit-content' }}
            startIcon={<HuskiTokenIcon />}
            isActive={pairFilter === 'huski'}
            small
            onClick={() => setPairFilter('huski')}
          >
            HUSKI
          </FilterOption>
          <FilterOption
            variant="tertiary"
            style={{ width: 'fit-content' }}
            startIcon={<BnbIcon width="1rem !important" height="1rem !important" />}
            isActive={pairFilter === 'wbnb'}
            onClick={() => setPairFilter('wbnb')}
          >
            BNB
          </FilterOption>
          <FilterOption
            variant="tertiary"
            style={{ width: 'fit-content' }}
            startIcon={<BusdIcon width="1rem !important" height="1rem !important" />}
            isActive={pairFilter === 'busd'}
            onClick={() => setPairFilter('busd')}
          >
            BUSD
          </FilterOption>
          <FilterOption
            variant="tertiary"
            style={{ width: 'fit-content' }}
            startIcon={<BtcbIcon width="1rem !important" height="1rem !important" />}
            isActive={pairFilter === 'btcb'}
            onClick={() => setPairFilter('btcb')}
          >
            BTCB
          </FilterOption>
          <FilterOption
            variant="tertiary"
            style={{ width: 'fit-content' }}
            startIcon={<EthIcon width="1rem !important" height="1rem !important" />}
            isActive={pairFilter === 'eth'}
            onClick={() => setPairFilter('eth')}
          >
            ETH
          </FilterOption>
        </SFilterRowInner>
      </SFilterRow>
    </>
  )
}

export default LeverageControlAssets

const SFilterRow = styled(Flex)`
  margin-top: 10px;
  margin-bottom: 14px;
  padding: 0 24px;
  ${({ theme }) => theme.screen.phone} {
    flex-direction: column;
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
