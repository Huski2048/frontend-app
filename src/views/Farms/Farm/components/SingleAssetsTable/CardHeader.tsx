import React from 'react'
import { CardHeader as UiKitCardHeader,Text, Flex, Grid } from 'husky-uikit'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { TokenImage } from 'components/TokenImage'

const STitleText = styled(Text)`
  font-size: 24px;
  font-weight: 700;
  ${({ theme }) => theme.screen.tablet} {
    font-size: 18px;
  }
`

const Wrapper = styled(UiKitCardHeader) <{ isDark: boolean }>`
  background: ${({ theme }) => theme.card.background};
  border-radius: ${({ theme }) => `${theme.radii.card} ${theme.radii.card} 0 0`};
  padding: 14px 14px 0px 14px;
  .marketWrapper {
    border-bottom: ${({ isDark }) => (isDark ? '2px solid #272B30' : '2px solid #EFEFEF')};
    padding-bottom: 10px;
  }
`

const CardHeader = ({ data }) => {
  const { isDark } = useTheme()
  let tokenImage
  let tokenName
  if (data?.quoteToken?.symbol === 'CAKE' && data?.singleFlag === 0) {
    tokenImage = data?.quoteToken
    tokenName = data?.quoteToken?.symbol
  } else {
    tokenImage = data?.token
    tokenName = data?.token?.symbol
  }

  return (
    <Wrapper isDark={isDark}>
      <Flex alignItems="center" className="marketWrapper">
        <Grid gridTemplateColumns="44px 1fr" alignItems="center">
          <TokenImage ml={10} token={tokenImage} width={34} height={34} />
          <STitleText pl="10px">
            {tokenName.replace('wBNB', 'BNB')}
          </STitleText>
        </Grid>
      </Flex>
    </Wrapper>
  )
}

export default CardHeader
