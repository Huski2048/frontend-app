import React, { useRef } from 'react'
import styled from 'styled-components'
import { Button, Box, useMatchBreakpoints, ChevronUpIcon } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import LeverageRow from './LeverageRow'
import LeverageHeaderRow from './LeverageHeaderRow'

const StyledTable = styled.div`
  > ${Box} {
    overflow: auto;
    ::-webkit-scrollbar {
      height: 8px;
    }
  }
`

const StyledTableBorder = styled.div`
  border-collapse: collapse;
  font-size: 14px;
  border-radius: 4px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
`

const TableContainer = styled.div`
  position: relative;
`

const TableWrapper = styled.div`
  overflow: visible;
  scroll-margin-top: 64px;

  &::-webkit-scrollbar {
    display: none;
  }
`

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

const LeverageTable = ({ leverageData, farmsData }) => {
  const { isMobile } = useMatchBreakpoints()

  const { t } = useTranslation()
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }

  return (
    <>
      <StyledTableBorder>
        <TableContainer>
          <TableWrapper ref={tableWrapperEl}>
            <StyledTable>
              {isMobile ? null : <LeverageHeaderRow />}
              {leverageData.map((farmData) => (
                farmData.duplicate ? null : <LeverageRow farmData1={farmData} farmData2={farmsData.find((f) => f.pid === farmData.pid && f.token.coingeckoId === farmData.quoteToken.coingeckoId)} key={farmData?.pid} />
              ))}
            </StyledTable>
          </TableWrapper>
          <ScrollButtonContainer>
            <Button variant="text" onClick={scrollToTop}>
              {t('To Top')}
              <ChevronUpIcon color="primary" />
            </Button>
          </ScrollButtonContainer>
        </TableContainer>
      </StyledTableBorder>
    </>
  )
}

export default LeverageTable
