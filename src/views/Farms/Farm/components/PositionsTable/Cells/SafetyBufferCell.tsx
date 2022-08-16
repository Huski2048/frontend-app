import React from 'react'
import styled from 'styled-components'
import {
  Text,
  useMatchBreakpoints,
  Skeleton,
  Flex,
  useTooltip,
  Box,
} from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import { BigText } from 'components/Text/Text';
import BaseCell, { CellContent } from './BaseCell'

interface Props {
  safetyBuffer: number
  quoteTokenName: string
  tokenName: string
  priceDrop: number | string
  noDebt?: boolean
  debtRatioRound?: any
  liquidationThresholdData?: any
}

export const SSafetyBufferCell = styled(BaseCell)`
  flex: 1 0 100px;
  ${({ theme }) => theme.screen.phone} {
    flex: 1;
    padding: 10px 0px
  }
`
const SBLinearProgress = styled.div`
  display: flex;
  position: relative;
  background-color: #e2e2e2;
  width: 60px;
  height: 6px;
  border-radius: 6px;
  > div {
    height: 6px;
    position: absolute;
  }
`

const SafetyBufferCell: React.FC<Props> = ({
  safetyBuffer,
  noDebt,
  liquidationThresholdData,
  debtRatioRound,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const {
    targetRef: bufferTargetRef,
    tooltip: bufferTooltip,
    tooltipVisible: bufferTooltipVisible,
  } = useTooltip(
    <>
      <Text>Debt Ratio - {debtRatioRound.toFixed(2)}%</Text>
    </>,
    { placement: 'bottom', bgcolor: '#2E2D2E' },
  )
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text>Liquidation Ratio - {liquidationThresholdData.toFixed(2)}%</Text>
    </>,
    { placement: 'bottom', bgcolor: '#7B3FE4' },
  )
  if (noDebt) {
    return (
      <SSafetyBufferCell role="cell">
        <CellContent>
          {(isMobile) && (
              <BigText textAlign="left">
                {t('Safety Buffer')}
              </BigText>
         )}
          <Text bold>{t('No Debt')}</Text>
        </CellContent>
      </SSafetyBufferCell>
    )
  }
  return (
    <SSafetyBufferCell role="cell">
      <CellContent>
        {(isMobile) && (
          <Flex alignItems="center">
            <BigText textAlign="left">
              {t('Safety Buffer')}
            </BigText>
          </Flex>
        )}
        {safetyBuffer ? (
          <>
            <Flex alignItems="center" style={{ gap: '10px' }}>
              <BigText>
                {safetyBuffer}%
              </BigText>
              {/* <SBLinearProgress
                variant="determinate"
                value={safetyBuffer}
                style={{ height: '6px', width: '40px', color: '#7B3FE4', background: '#CCCCCC', borderRadius: 6 }}
              /> */}
              <SBLinearProgress>
                {bufferTooltipVisible && bufferTooltip}
                <Box
                  borderRadius="50%"
                  width="6px"
                  background="#2E2D2E"
                  zIndex={1}
                  ref={bufferTargetRef}
                  left={`${(debtRatioRound / 100) * 60}px`}
                />
                <Box
                  background="#9054DB"
                  left={`${(Math.min(liquidationThresholdData, debtRatioRound) / 100) * 60 + 4}px`}
                  width={`${(Math.abs(liquidationThresholdData - debtRatioRound) / 100) * 60}px`}
                />
                {tooltipVisible && tooltip}
                <Box
                  borderRadius="50%"
                  width="6px"
                  background="#5D12DD"
                  zIndex={1}
                  ref={targetRef}
                  left={`${(liquidationThresholdData / 100) * 60}px`}
                />
              </SBLinearProgress>
            </Flex>
          </>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </SSafetyBufferCell>
  )
}

export default SafetyBufferCell
