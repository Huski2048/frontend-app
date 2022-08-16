import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Box } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import Select from 'components/Select/Select'
import { TokenImage } from 'components/TokenImage'
import BaseCell, { CellContent } from './BaseCell'

export const SBorrowingCell = styled(BaseCell)`
  flex: 1 0 160px;
  ${({ theme }) => theme.screen.tablet} {
    flex: 1 0 90px;
  }
  ${({theme}) => theme.screen.phone} {
    flex: 1;
    padding-bottom: 10px
  }
`

const Borrowing = ({ quoteToken, token, switchFlag, onBorrowingAssetChange }) => {
  const { isMobile } = useMatchBreakpoints()
  const isSmallScreen = isMobile
  const { t } = useTranslation()

  const options = () => {
    if (switchFlag) {
      return [
        {
          label: token.symbol.replace('wBNB', 'BNB'),
          value: token.symbol,
          icon: (
            <Box width={20} height={20}>
              <TokenImage token={token} width={20} height={20} />
            </Box>
          ),
        },
        {
          label: quoteToken.symbol.replace('wBNB', 'BNB'),
          value: quoteToken.symbol,
          icon: (
            <Box width={20} height={20}>
              <TokenImage token={quoteToken} width={20} height={20} />
            </Box>
          ),
        },
      ]
    }
    return [
      {
        label: token.symbol.replace('wBNB', 'BNB'),
        value: token.symbol,
        icon: (
          <Box width={20} height={20}>
            <TokenImage token={token} width={20} height={20} />
          </Box>
        ),
      },
      {
        label: token.symbol.replace('wBNB', 'BNB'),
        value: token.symbol,
        icon: (
          <Box width={20} height={20}>
            <TokenImage token={token} width={20} height={20} />
          </Box>
        ),
      },
    ]
  }

  return (
    <SBorrowingCell role="cell">
      <CellContent>
        {isSmallScreen && (
          <Text color="textSubtle" textAlign="left">
            {t('Borrowing')}
          </Text>
        )}
        <Select options={options()} onChange={(option) => onBorrowingAssetChange(option.value)} />
      </CellContent>
    </SBorrowingCell>
  )
}

export default Borrowing
