import React from 'react'
import styled from 'styled-components'
import { BigText, SmText } from 'components/Text/Text'
import { useMatchBreakpoints, Skeleton, Box } from 'husky-uikit'
import { formatDisplayedBalance } from 'utils/formatDisplayedBalance'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const SText = styled(SmText)`
  color: ${({ theme }) => theme.color.tableText}; ;
`

const UpText = styled(BigText)`
font-size: 12px;
  margin: 2px 0 8px 0;
`

export const SBalanceCell = styled(BaseCell)`
  flex: 1 0 110px;
  ${({ theme }) => theme.screen.tablet} {
  }
  ${({ theme }) => theme.screen.phone} {
    width: 100%;
    flex: 1;
  }
  ${CellContent} {
    ${({ theme }) => theme.screen.phone} {
      width: 100%;
      flex: 1;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      ${Box} {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
      }
      ${UpText} {
        font-size: 12px;
        margin: 0;
      }
      ${SText} {
        font-size: 12px;
      }
    }
  }
`

const BalanceCell = ({ balance, balanceIb, name, decimals }) => {
  const { isMobile } = useMatchBreakpoints()
  const { t } = useTranslation()

  const formatedBalance = formatDisplayedBalance(balance, decimals)
  const ibFormatedBalance = formatDisplayedBalance(balanceIb, decimals)

  return (
    <SBalanceCell role="cell">
      <CellContent>
        {isMobile && <SmText>{t('My Balance')}</SmText>}
        {balanceIb ? (
          <Box>
            <UpText bold>
              {ibFormatedBalance} ib{name}
            </UpText>
            <SText bold>
              {formatedBalance} {name}
            </SText>
          </Box>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </SBalanceCell>
  )
}

export default BalanceCell
