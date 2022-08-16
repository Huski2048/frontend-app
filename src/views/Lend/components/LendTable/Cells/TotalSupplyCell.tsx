import React from 'react'
import styled from 'styled-components'
import { BigText, SmText } from 'components/Text/Text'
import { useMatchBreakpoints, Skeleton, Box } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import nFormatter from 'utils/nFormatter'
import { formatBigNumberToFixed } from 'utils/formatBalance'
import BaseCell, { CellContent } from './BaseCell'

const UpText = styled(BigText)`
  margin: 2px 0 8px 0;
`

export const STotalSupplyCell = styled(BaseCell)`
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

const TotalSupplyCell = ({ supply, supplyUSD, name }) => {
  const { isMobile } = useMatchBreakpoints()

  const formatedSupply = supply && Number(formatBigNumberToFixed(supply).replace(/,/g, ''))
  const formatedSupplyUSD = supplyUSD && Number(formatBigNumberToFixed(supplyUSD).replace(/,/g, ''))
  const { t } = useTranslation()

  return (
    <STotalSupplyCell role="cell">
      <CellContent>
        {isMobile && <SmText>{t('Total Supply')}</SmText>}
        {supply ? (
          <Box>
            <UpText bold>
              {nFormatter(formatedSupply)} {name}
            </UpText>
            <SmText>{`$${nFormatter(formatedSupplyUSD)}`}</SmText>
          </Box>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </STotalSupplyCell>
  )
}

export default TotalSupplyCell
