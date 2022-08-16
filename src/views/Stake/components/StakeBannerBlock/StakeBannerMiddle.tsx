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

const LendBannerMiddle = ({ isDark, alpacaBalance }) => {
  const { t } = useTranslation()
  return (
    <SBannerMiddle isDark={isDark}>
      <LineItem>
        <LineLeft>
          <BannerSmText> {t(`My HUSKI Wallet`)} </BannerSmText>
        </LineLeft>
        <SLineRight>
          <BannerIcon src="/images/huskiIcon.svg" />
        </SLineRight>
      </LineItem>
      <LineItem>
        {alpacaBalance ? (
          <BannerBigText my="6px !important"> {alpacaBalance.toNumber().toPrecision(3)} </BannerBigText>
        ) : (
          <Skeleton minWidth={100} width="100%" height="calc(28px * 1.5)" my="6px" />
        )}
      </LineItem>
    </SBannerMiddle>
  )
}

export default LendBannerMiddle

const SBannerMiddle = styled(BannerMiddle)`
  ${LineItem} {
    align-items: center;
  }
`

const SLineRight = styled(LineRight)`
  width: 40px;
`
