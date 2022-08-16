import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Grid } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import { TokenPairImage } from 'components/TokenImage'
import { BigText, SmText } from 'components/Text/Text'
import BaseCell, { CellContent } from './BaseCell'

export const SPoolCellPosition = styled(BaseCell)`
  flex: 1 0 150px;
  ${Text} {
    white-space: nowrap;
  }
  ${({ theme }) => theme.screen.phone} {
    flex: 1;
    padding: 10px 0px
  }
`

const PoolCell = ({ pool, quoteToken, token }) => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()

  return (
    <SPoolCellPosition role="cell">
      <CellContent style={{ marginTop: '-15px' }}>
        {(isMobile || isTablet) && (
          <Text fontSize="12px" color="textSubtle" textAlign="left">
            {t('Pool')}
          </Text>
        )}
        <Grid style={{ marginTop: '5px' }} alignItems="center" gridTemplateColumns="50px 1fr">
          <TokenPairImage
            variant="inverted"
            primaryToken={quoteToken}
            secondaryToken={token}
            width={24}
            height={24}
            mr="8px"
            mt="15px"
          />
          <BigText>
            {pool}
          </BigText>
          <SmText style={{ marginTop: '0px' }}>
            Pancakeswap
          </SmText>

        </Grid>
      </CellContent>
    </SPoolCellPosition>
  )
}

export default PoolCell
