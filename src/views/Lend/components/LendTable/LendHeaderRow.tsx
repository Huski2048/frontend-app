import React from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints } from 'husky-uikit'
import { HeadText } from 'components/Text/Text'
import { useTranslation } from 'contexts/Localization'
import { CellContent } from './Cells/BaseCell'
import { SNameCell } from './Cells/NameCell'
import { SApyCell } from './Cells/ApyCell'
import { STotalSupplyCell } from './Cells/TotalSupplyCell'
import { STotalBorrowedCell } from './Cells/TotalBorrowedCell'
import { SUtilizationCell } from './Cells/UtilRateCell'
import { SBalanceCell } from './Cells/BalanceCell'
import { SActionCell } from './Cells/ActionCell'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  height: 46px;
  align-items: center;
  margin: 0 15px;
 
  border-bottom: 1px solid ${({ theme }) => theme.color.tableLine};
  ${({ theme }) => theme.screen.tablet} {
   height: 43.25px;
  }
  ${({ theme }) => theme.screen.phone} {
    display: none;
  }
`

const LendHeaderRow = () => {
  const { t } = useTranslation()
  const { isTablet } = useMatchBreakpoints()
  return (
    <StyledRow>
      <SNameCell>
        <CellContent>
          <HeadText>{t('POOL')}</HeadText>
        </CellContent>
      </SNameCell>
      <SApyCell>
        <CellContent>
          <HeadText>{t('APY')}</HeadText>
        </CellContent>
      </SApyCell>
      <STotalSupplyCell>
        <CellContent>
          <HeadText>{t('Total Supply')}</HeadText>
        </CellContent>
      </STotalSupplyCell>
      {isTablet ? null : (
        <>
          <STotalBorrowedCell>
            <CellContent>
              <HeadText>{t('Total Borrowed')}</HeadText>
            </CellContent>
          </STotalBorrowedCell>
          <SUtilizationCell>
            <CellContent>
              <HeadText>{t('Utilization')}</HeadText>
            </CellContent>
          </SUtilizationCell>
        </>
      )}
      <SBalanceCell>
        <CellContent>
          <HeadText>{t('My Balance')}</HeadText>
        </CellContent>
      </SBalanceCell>
      <SActionCell>
        <CellContent>
          <HeadText>&nbsp;</HeadText>
        </CellContent>
      </SActionCell>
    </StyledRow>
  )
}

export default LendHeaderRow
