import React from 'react'
import styled from 'styled-components'
import { HeadText } from 'components/Text/Text'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './Cells/BaseCell'
import { SPoolCell } from './Cells/PoolCell'
import { SApyCell } from './Cells/ApyCell'
import { STvlCell } from './Cells/TvlCell'
import { SBorrowingCell } from './Cells/Borrowing'
import { SLeverageCell } from './Cells/LeverageCell'


const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  flex-direction: row;
  padding: 14px 0;
  margin: 0 24px;
  border-bottom: 1px solid ${({ theme }) => theme.color.tableLine};
`

const ActionCell = styled(BaseCell)`
  flex: 1 0 50px;
  align-items: start;
`

const LeverageHeaderRow = () => {
  const { t } = useTranslation()
  return (
    <StyledRow>
      <SPoolCell>
        <CellContent>
          <HeadText>
            {t('Pool')}
          </HeadText>
        </CellContent>
      </SPoolCell>
      <SApyCell>
        <CellContent>
          <HeadText>
            {t('APY')}
          </HeadText>
        </CellContent>
      </SApyCell>
      <STvlCell>
        <CellContent>
          <HeadText>
            {t('TVL')}
          </HeadText>
        </CellContent>
      </STvlCell>
      <SBorrowingCell>
        <CellContent>
          <HeadText>
            {t('Borrowing')}
          </HeadText>
        </CellContent>
      </SBorrowingCell>
      <SLeverageCell>
        <CellContent>
          <HeadText>
            {t('Leverage')}
          </HeadText>
        </CellContent>
      </SLeverageCell>
      <ActionCell>
        <CellContent>
          <HeadText>&nbsp;</HeadText>
        </CellContent>
      </ActionCell>
    </StyledRow>
  )
}

export default LeverageHeaderRow
