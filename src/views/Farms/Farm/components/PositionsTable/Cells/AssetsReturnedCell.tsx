import React from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints, Skeleton, Flex } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import { BigText, SmText } from 'components/Text/Text';
import BaseCell, { CellContent } from './BaseCell'

export const SAssetsReturnedCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
  ${({ theme }) => theme.screen.phone} {
    flex: 1;
    padding: 10px 0px
  }
`

const AssetsReturnedCell = ({ assetsReturned }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { t } = useTranslation()

  return (
    <SAssetsReturnedCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Flex alignItems="center">
            <SmText textAlign="left">
              {t('Assets Returned')}
            </SmText>
          </Flex>
        )}
        {assetsReturned ? (
          <BigText>
            {assetsReturned}
          </BigText>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </SAssetsReturnedCell>
  )
}

export default AssetsReturnedCell
