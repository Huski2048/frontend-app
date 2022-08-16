import React from 'react'
import styled from 'styled-components'
import { Flex, Skeleton, Box } from 'husky-uikit'
import { TokenImage } from 'components/TokenImage'
import { BigText, SmText } from 'components/Text/Text'
import BaseCell, { CellContent } from './BaseCell'

const UpText = styled(BigText)`
  margin: 2px 0 8px 0;
`

export const SNameCell = styled(BaseCell)`
  flex: 1 0 220px;
  ${({ theme }) => theme.screen.tablet} {
    flex: 1 0 194px;
  }
  ${({ theme }) => theme.screen.phone} {
    width: 100%;
    flex: 1;
    ${Box} {
      width: 100%;
    }
    ${UpText} {
      margin: 0;
    }
  }
`

const TokenImageBlock = styled.div`
  width: 38px;
  height: 38px;
  margin-right: 12px;
  ${({ theme }) => theme.screen.tablet} {
   width: 30px;
   height: 30px;
   margin-right: 9px;
  }
`

const NameCell = ({ token, exchangeRate }) => {
  return (
    <SNameCell role="cell">
      <CellContent style={{ display: 'block' }}>
        <Flex alignItems="center">
          <TokenImageBlock>
            <TokenImage width={38} height={38}  token={token} />
          </TokenImageBlock>
          <Box>
            <UpText>{token.symbol.replace('wBNB', 'BNB')}</UpText>
            {exchangeRate ? (
              <SmText>
                1 ib{token.symbol.replace('wBNB', 'BNB')} = {exchangeRate.toFixed(4)}{' '}
                {token.symbol.replace('wBNB', 'BNB')}
              </SmText>
            ) : (
              <Skeleton width="80px" height="16px" />
            )}
          </Box>
        </Flex>
      </CellContent>
    </SNameCell>
  )
  /* tslint:enable */
}

export default NameCell
