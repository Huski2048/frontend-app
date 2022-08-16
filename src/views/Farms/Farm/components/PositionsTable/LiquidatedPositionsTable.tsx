import React from 'react'
import styled, { useTheme } from 'styled-components'
import { useMatchBreakpoints, Skeleton, Flex, Text } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import { useLocation } from 'react-router-dom'
import { FetchStatus } from 'hooks/useTokenBalance'
import LiquidatedPositionsRow from './LiquidatedPositionsRow'
import LiquidatedPositionsHeaderRow from './LiquidatedPositionsHeaderRow'

const StyledTable = styled.div`
  background-color: ${({ theme }) => theme.card.background};
  padding-bottom: 20px;
`

const SLoader = styled(Flex)`
  justify-content: space-between;
  padding: 1rem 0;
  margin: 0 24px;
`

const LiquidatedPositionsTable: React.FC<{ data: Record<string, any>; status?: FetchStatus }> = ({ data, status }) => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()

  const { isDark } = useTheme()
  const isSmallScreen = isMobile || isTablet
  const { pathname } = useLocation()

  const Loader = () => {
    if (isSmallScreen) {
      return (
        <div style={{ padding: '0 24px' }}>
          {[...Array(2)].map((_, i) => (
            <Flex justifyContent="space-between" alignItems="center" padding="1rem 0">
              <Skeleton key={_} width={i % 2 === 0 ? '200px' : '90px'} />
              <Skeleton key={_} width={i % 2 === 0 ? '90px' : '200px'} />
            </Flex>
          ))}
          <Skeleton width="100%" />
        </div>
      )
    }
    return (
      <>
        <SLoader>
          {[...Array(pathname === 'farms' ? 10 : 8)].map((_) => (
            <Skeleton key={_} width="80px" />
          ))}
        </SLoader>
        <SLoader>
          <Skeleton width="100%" height="1.5rem" />
        </SLoader>
      </>
    )
  }

  if (status === 'not-fetched' || status === 'failed') {
    return (
      <StyledTable role="table">
        <Loader />
      </StyledTable>
    )
  }

  return (
    <StyledTable role="table">
      {!(isMobile || isTablet) && data && <LiquidatedPositionsHeaderRow />}
      {data ? (
        <LiquidatedPositionsRow token={null} quoteToken={null} />
      ) : (
        <Flex height="calc(3.5rem + 20px)" alignItems="center" justifyContent="center">
          <Text
            textAlign="center"
            fontSize="18px"
            fontWeight="500"
            lineHeight="48px"
            color={isDark ? '#fff' : '#9d9d9d'}
          >
            {t('No Liquidated Positions')}
          </Text>
        </Flex>
      )}
    </StyledTable>
  )
}

export default LiquidatedPositionsTable
