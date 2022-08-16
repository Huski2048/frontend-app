import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Skeleton, Flex, InfoIcon, useTooltip } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import { BigText, SmText } from 'components/Text/Text'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 6rem;
  }
  ${({ theme }) => theme.screen.phone} {
    flex: 1;
    height: 34px;
  }
  ${CellContent} {
    ${({ theme }) => theme.screen.phone} {
      flex: 1;
      width: 100%;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }
`

const AprCell = ({ getApyData }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { t } = useTranslation()

  const { stakeApr, apy } = getApyData

  const apyCell = (e) => {
    const value = e * 100
    return `${value.toFixed(2)}%`
  }
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small mr="10px">
          {t('Total APR')}
        </Text>
        <Text>{apyCell(stakeApr)}</Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small mr="10px">
          {t('Total APY')}
        </Text>
        <Text>{apyCell(apy)}</Text>
      </Flex>
    </>,
    { placement: 'bottom-start' },
  )

  return (
    <StyledCell role="cell">
      <CellContent>
        <SmText>
          {t('APY')}
        </SmText>
        {apy ? (
          <Flex alignItems="center">
            <BigText>{apyCell(apy)}</BigText>
            {tooltipVisible && tooltip}
            <span ref={targetRef}>
              <InfoIcon marginTop={isMobile || isTablet ? '0px' : '8px'} ml="10px" />
            </span>
          </Flex>
        ) : (
          <Skeleton width="80px" height="20px"  />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default AprCell
