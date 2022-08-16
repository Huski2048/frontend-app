import React from 'react'
import styled from 'styled-components'
import { Text, Skeleton } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import { formatBigNumberToFixed } from 'utils/formatBalance'
import nFormatter from 'utils/nFormatter'
import { BigText, SmText } from 'components/Text/Text'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 80px;
  justify-content: center;
  ${({ theme }) => theme.screen.phone} {
    height: 34px;
    flex: 1;
    align-items: center;
  }
  ${CellContent} {
    ${({ theme }) => theme.screen.phone} {
      width: 100%;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      ${Text} {
        margin: 0;
      }
    }
  }
`
const SText = styled(SmText)`
  /* margin-bottom: 10px; */
  line-height: 22px;
`

const TotalValueCell = ({ valueStaked, name }) => {
  const { t } = useTranslation()
  const formatedSupply = valueStaked && parseFloat(formatBigNumberToFixed(Number(valueStaked)).replace(/,/g, ''))

  return (
    <StyledCell role="cell">
      <CellContent>
        <SText>
          {t('Total %name% Staked', { name })}
        </SText>

        {valueStaked ? (
          <BigText>
            {nFormatter(formatedSupply)}
          </BigText>
        ) : (
          <Skeleton width="80px" height="20px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default TotalValueCell
