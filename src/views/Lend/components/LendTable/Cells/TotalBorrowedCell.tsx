import React from 'react'
import styled from 'styled-components'
import { BigText, SmText } from 'components/Text/Text'
import { useMatchBreakpoints, Skeleton, Box } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import nFormatter from 'utils/nFormatter'
import { formatBigNumberToFixed } from '../../../../../utils/formatBalance'
import BaseCell, { CellContent } from './BaseCell'

const UpText = styled(BigText)`
  margin: 2px 0 8px 0;
`
export const STotalBorrowedCell = styled(BaseCell)`
   flex: 1 0 130px;
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
      ${SmText} {
        font-size: 12px;
      }
    }
  }
`


const TotalBorrowedCell = ({ borrowed, borrowedUSD, name }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const formatedBorrowed = borrowed && parseFloat(formatBigNumberToFixed(borrowed).replace(/,/g, ''))
  const formatedBorrowedUSD = borrowedUSD && Number(formatBigNumberToFixed(borrowedUSD).replace(/,/g, ''))
  const { t } = useTranslation()

  return (
    <STotalBorrowedCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <SmText>
            {t('Total Borrowed')}
          </SmText>
        )}
        {borrowed ? (
          <Box>
            <UpText>
              {nFormatter(formatedBorrowed)} {name}
            </UpText>
            <SmText>
              {`$${nFormatter(formatedBorrowedUSD)}`}
            </SmText>
          </Box>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </STotalBorrowedCell>
  )
}

export default TotalBorrowedCell
