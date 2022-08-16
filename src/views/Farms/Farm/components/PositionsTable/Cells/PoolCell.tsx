import React from 'react'
import styled from 'styled-components'
import { BigText, SmText } from 'components/Text/Text'
import { Text, useMatchBreakpoints, Grid, Box } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import { TokenPairImage } from 'components/TokenImage'
import BaseCell, { CellContent } from './BaseCell'

export const SPoolCell = styled(BaseCell)`
  flex: 1 0 150px;
  ${Text} {
    white-space: nowrap;
  }
  ${({ theme }) => theme.screen.phone} {
    flex: 1;
    padding: 10px 0px
  }
`

const PoolCell = ({ pool, quoteToken, token, exchange }) => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()

  return (
    <SPoolCell role="cell">
      <CellContent>
        {(isMobile) && (
          <Text color="textSubtle" textAlign="left">
            {t('Pool')}
          </Text>
        )}
        <Grid alignItems="center" gridTemplateColumns="24px 1fr" gridGap={isMobile || isTablet ? "8px" : "1rem"}>
          <TokenPairImage primaryToken={token} secondaryToken={quoteToken} width={24} height={24} mr="8px" />
          <Box>
            <BigText>
              {pool}
            </BigText>
            <SmText style={{ marginTop: '5px' }}>
              {exchange}
            </SmText>
          </Box>
        </Grid>
      </CellContent>
    </SPoolCell>
  )
}

export default PoolCell
