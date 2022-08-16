import React from 'react'
import styled from 'styled-components'
import { BigText, SmText } from 'components/Text/Text'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  width: 200px;
  ${CellContent} {
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    ${({ theme }) => theme.screen.phone} {
      flex-direction: row;
      width: 100%;
      gap: 20px;
    }
  }
  ${({ theme }) => theme.screen.phone} {
    width: 100%;
  }
`

const ValueLockedCell = ({ totalValueLocked }) => {
  const { t } = useTranslation()
  return (
    <StyledCell role="cell">
      <CellContent>
        <SmText style={{ margin: "2px 0 10px 0" }}>
          {t('Total Value Locked')}
        </SmText>
        <BigText>{`$${totalValueLocked || 0}`}</BigText>
      </CellContent>
    </StyledCell>
  )
}

export default ValueLockedCell
