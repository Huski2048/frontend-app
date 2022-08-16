import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

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

import { Box, Button, useMatchBreakpoints } from 'husky-uikit'

import BigNumber from 'bignumber.js'

import { useTranslation } from 'contexts/Localization'

const FarmBannerRight = ({ isDark, reward, account }) => {
  const { t } = useTranslation()
  return (
    <>
      {' '}
      <SBannerRight isDark={isDark}>
        <LineItem>
          <LineLeft>
            <BannerSmText>{t('HUSKI Rewards')}</BannerSmText>
          </LineLeft>
          <LineRight>
            <BannerIcon src="/images/crown.png" />
          </LineRight>
        </LineItem>
        <LineItem>
          <LineLeft>
            <BannerBigText>{new BigNumber(reward || 0).toFixed(3, 1)}</BannerBigText>
          </LineLeft>
          <LineRight>
            <Button
              as={Link}
              to={(location) => ({ pathname: `${location.pathname}/claim` })}
              disabled={!account}
              scale="sm"
            >
              {' '}
              {t('Claim')}{' '}
            </Button>
          </LineRight>
        </LineItem>
      </SBannerRight>
    </>
  )
}

export default FarmBannerRight

const SBannerRight = styled(BannerRight)`
  width: 320px;
  ${({ theme }) => theme.screen.tablet} {
    width: 277px !important;
  }
`
