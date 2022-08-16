import { Currency, ETHER, Token } from '@pancakeswap/sdk'
import { BinanceIcon } from 'husky-uikit'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import getTokenLogoURL from '../../utils/getTokenLogoURL'
import Logo from './Logo'

const StyledLogo = styled(Logo) <{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {


  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return []

    if (currency instanceof Token) {
      // if (currency instanceof WrappedTokenInfo) {
      //   return [...uriLocations, getTokenLogoURL(currency.address)]
      // }
      return [getTokenLogoURL(currency.address)]
    }
    return []
  }, [currency])

  if (currency === ETHER) {
    return <BinanceIcon width={size} style={style} />
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
