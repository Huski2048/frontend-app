import React from 'react'
import styled from 'styled-components'
import { Skeleton } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import { formatBigNumberToFixed } from 'utils/formatBalance'
import { BigText, SmText } from 'components/Text/Text'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 100px;
  /* justify-content: center; */
  ${({ theme }) => theme.screen.phone} {
    align-items: center;
    height: 34px;
    flex: 1;
  }
  ${CellContent} {
    ${({ theme }) => theme.screen.phone} {
      width: 100%;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }
`
const SText = styled(SmText)`
  /* margin-bottom: 10px; */
`

const TotalVolumeCell = ({ volumeLocked, name }) => {

  const { t } = useTranslation()
  const formatedSupply1 = volumeLocked && parseFloat(formatBigNumberToFixed(Number(volumeLocked)).replace(/,/g, ''))
  const formatedSupply = formatedSupply1.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

  return (
    <StyledCell role="cell">
      <CellContent>
        <SText>
          {t('Total %name% Locked', { name })}
        </SText>
        {volumeLocked ? (
          <BigText>
            {formatedSupply}
          </BigText>
        ) : (
          <Skeleton width="80px" height="20px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default TotalVolumeCell
