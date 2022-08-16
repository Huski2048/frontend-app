/* eslint-disable no-unused-expressions */
import React from 'react'
import styled from 'styled-components'
import { Skeleton } from 'husky-uikit'

import {
  BannerRight,
  LineItem,
  LineLeft,
  LineRight,
  BannerIcon,
  BannerBigText,
  BannerSmText,
} from 'components/Banner/Banner'

import { useTranslation } from 'contexts/Localization'

const LendBannerRight = ({ isDark, totalValueLocked, totalValueLockedValue }) => {
  const { t } = useTranslation()
  return (
    <SBannerRight isDark={isDark}>
      <LineItem>
        <LineLeft>
          <BannerSmText>{t('Total Value Locked:')}</BannerSmText>
        </LineLeft>
        <SLineRight>
          <BannerIcon src="/images/8826.svg" />
        </SLineRight>
      </LineItem>
      <LineItem>
        {totalValueLocked ? (
          <BannerBigText my="6px !important"> {totalValueLockedValue} </BannerBigText>
        ) : (
          <Skeleton width="100%" height="calc(28px * 1.5)" my="6px" />
        )}
      </LineItem>
    </SBannerRight>
  )
}

export default LendBannerRight

const SBannerRight = styled(BannerRight)`
  width: 222px;
  ${({ theme }) => theme.screen.phone} {
    width: 100%;
  }
`

const SLineRight = styled(LineRight)`
  width: 40px;
`
