import React from 'react'
import styled from 'styled-components'
import { BigText, SmText } from 'components/Text/Text'
import { useMatchBreakpoints, Box, Grid } from 'husky-uikit'
import { TokenPairImage } from 'components/TokenImage'
import BaseCell, { CellContent } from './BaseCell'

export const SPoolCell = styled(BaseCell)`
  flex: 1 0 220px;
  ${({ theme }) => theme.screen.tablet} {
    flex: 1 0 135px;
  }
  ${({ theme }) => theme.screen.phone} {
    flex: 1
  }
`

const PoolCell = ({ pool, farmData }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const quoteToken = farmData?.quoteToken
  const token = farmData?.token

  return (
    <SPoolCell role="cell">
      <CellContent>
        <Grid alignItems="center" gridTemplateColumns="24px 1fr" gridGap={isMobile || isTablet ? "8px" : "1rem"}>
          <TokenPairImage
            primaryToken={token}
            secondaryToken={quoteToken}
            width={24}
            height={24}
            mr="1rem"
          />
          <Box>
            <BigText style={{ lineHeight: 1.5 }}>
              {pool.toUpperCase().replace('WBNB', 'BNB')}
            </BigText>
            <SmText style={{ lineHeight: 1.5 }}>
              {farmData?.lpExchange}
            </SmText>
          </Box>
        </Grid>
      </CellContent>
    </SPoolCell >
  )
}

export default PoolCell
