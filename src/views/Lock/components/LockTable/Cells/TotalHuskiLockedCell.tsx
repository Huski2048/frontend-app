import React from 'react'
import styled from 'styled-components'
import { BigText, SmText } from 'components/Text/Text'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1;
  ${CellContent} {
    flex-direction: row;
    justify-content: space-between;
    align-items: start;
    ${({ theme }) => theme.mediaQueries.md} {
      flex-direction: column;
    }
    ${({ theme }) => theme.screen.phone} {
      width: 100%;
      gap: 20px;
    }
  }
`

const TotalHuskiLockedCell = ({ totalsHuskiLocked }) => {
  const { t } = useTranslation()
  return (
    <StyledCell role="cell">
      <CellContent>
        <SmText style={{ margin: '2px 0 10px 0' }}>
          {t('Total sHUSKI Locked')}
        </SmText>
        {totalsHuskiLocked ? (
          <SmText>{totalsHuskiLocked}</SmText>
        ) : (
          <BigText>
            1744.23
          </BigText>
        )}
      </CellContent>
    </StyledCell>
  )
}

export default TotalHuskiLockedCell
