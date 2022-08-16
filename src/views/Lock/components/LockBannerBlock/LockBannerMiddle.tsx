/* eslint-disable no-unused-expressions */
import React from 'react'
import styled from 'styled-components'

import {
  BannerMiddle,
  LineItem,
  LineLeft,
  LineRight,
  BannerIcon,
  BannerBigText,
  BannerSmText,
} from 'components/Banner/Banner'

import { Skeleton } from 'husky-uikit'

import { useTranslation } from 'contexts/Localization'

const LockBannerMiddle = ({ isDark, volume24h }) => {
  const { t } = useTranslation()
  return (
    <SBannerMiddle isDark={isDark}>
      <LineItem>
        <LineLeft>
          <BannerSmText> {t(`Total Volume 24H:`)} </BannerSmText>
        </LineLeft>
        <SLineRight>
          <BannerIcon src="/images/8825.svg" />
        </SLineRight>
      </LineItem>
      <LineItem>
        {volume24h ? (
          <BannerBigText my="6px !important"> {volume24h} </BannerBigText>
        ) : (
          <Skeleton minWidth={100} width="100%" height="calc(28px * 1.5)" my="6px" />
        )}
      </LineItem>
    </SBannerMiddle>
  )
}

export default LockBannerMiddle

const SBannerMiddle = styled(BannerMiddle)`
  ${LineItem} {
    align-items: center;
  }
`

const SLineRight = styled(LineRight)`
  width: 40px;
`
