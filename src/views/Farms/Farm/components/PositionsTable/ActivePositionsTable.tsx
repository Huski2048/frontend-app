import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import {
  useMatchBreakpoints,
  Skeleton,
  Flex,
  Text,
  ArrowBackIcon,
  ArrowForwardIcon,
} from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import { useLocation } from 'react-router-dom'
import { Position } from 'state/types'
import { Arrow, PageButtons } from '../PaginationButtons'
import ActivePositionsRow from './ActivePositionsRow'
import ActivePositionsHeaderRow from './ActivePositionsHeaderRow'

const StyledTable = styled.div`
  background-color: ${({ theme }) => theme.card.background};
  padding-bottom: 20px;
`

const SLoader = styled(Flex)`
  justify-content: space-between;
  padding: 1rem 0;
  margin: 0 24px;
`

const SPagination = styled.div`
  position: relative;
  > ${Flex} {
    position: absolute;
    right: 0;
    top: -60px;
    ${({ theme }) => theme.screen.phone} {
      top: -40px;
    }
  }
`

const SHeaderRow = styled.div`
  ${({ theme }) => theme.screen.phone} {
    display: none;
  }
`

const ActivePositionsTable = ({positionsData, fetchStatus}) => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { isDark } = useTheme()
  const isSmallScreen = isMobile || isTablet
  const { pathname } = useLocation()

  const MAX_PER_PAGE = isMobile ? 1 : 5

  // const { positionsData, fetchStatus } = usePositionsData()

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

  const [currentPage, setCurrentPage] = useState(1)

  const totalPageCount = Math.ceil(positionsData.length / MAX_PER_PAGE) || 1
  const goToNextPage = () => {
    if (currentPage < totalPageCount) {
      setCurrentPage(currentPage + 1)
    }
  }
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }
  // const [activitiesSlice, setActivitiesSlice] = useState<Position[]>([])
  // const [paginationData, setPaginationData] = useState<{
  //   activity: Position[]
  //   currentPage?: number
  //   maxPage: number
  // }>({
  //   activity: positionFarmsData,
  //   currentPage: 1,
  //   maxPage: Math.ceil(positionFarmsData.length / MAX_PER_PAGE) || 1, // total page count
  // })

  const currentTableData = React.useMemo<Array<Position>>(() => {
    const start = (currentPage - 1) * MAX_PER_PAGE
    const end = currentPage * MAX_PER_PAGE
    return positionsData?.slice(start, end)
  }, [MAX_PER_PAGE, currentPage, positionsData])

  // React.useEffect(() => {
  //   setPaginationData({
  //     activity: positionFarmsData,
  //     currentPage: 1,
  //     maxPage: Math.ceil(positionFarmsData.length / MAX_PER_PAGE) || 1,
  //   })
  // }, [positionFarmsData])
  //
  // useEffect(() => {
  //   const slice = paginationData.activity.slice(
  //     MAX_PER_PAGE * (paginationData.currentPage - 1),
  //     MAX_PER_PAGE * paginationData.currentPage,
  //   )
  //   setActivitiesSlice(slice)
  // }, [paginationData])

  if (fetchStatus === 'not-fetched' || fetchStatus === 'failed') {
    return (
      <StyledTable role="table">
        <Loader />
      </StyledTable>
    )
  }

  return (
    <StyledTable role="table">
      {positionsData?.length ? (
        <SPagination>
          <Flex flexDirection="column" justifyContent="space-between" height="100%">
            <PageButtons>
              <Arrow onClick={goToPreviousPage}>
                <ArrowBackIcon
                  color={currentPage === 1 ? 'textDisabled' : 'primary'}
                  style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                />
              </Arrow>
              <Text>
                {t('Page %page% of %maxPage%', {
                  page: currentPage,
                  maxPage: totalPageCount,
                })}
              </Text>
              <Arrow onClick={goToNextPage}>
                <ArrowForwardIcon
                  color={currentPage === totalPageCount ? 'textDisabled' : 'primary'}
                  style={{ cursor: currentPage === totalPageCount ? 'not-allowed' : 'pointer' }}
                />
              </Arrow>
            </PageButtons>
          </Flex>
        </SPagination>
      ) : null}
      <SHeaderRow>{positionsData.length ? <ActivePositionsHeaderRow /> : null}</SHeaderRow>
      {fetchStatus === 'success' && positionsData.length > 0 ? (
        currentTableData.map((pd) => <ActivePositionsRow data={pd} key={pd?.positionId} />)
      ) : (
        <Flex height="calc(3.5rem + 20px)" alignItems="center" justifyContent="center">
          <Text
            textAlign="center"
            fontSize="18px"
            fontWeight="500"
            lineHeight="48px"
            color={isDark ? '#fff' : '#9d9d9d'}
          >
            {t('No Active Positions')}
          </Text>
        </Flex>
      )}
    </StyledTable>
  )
}

export default ActivePositionsTable
