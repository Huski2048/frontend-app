import React from 'react'
import styled from 'styled-components'
import {
  Text,
  useMatchBreakpoints,
  Skeleton,
  Flex,
  InfoIcon,
  useTooltip,
} from 'husky-uikit'

import { useTranslation } from 'contexts/Localization'
import { BigText } from 'components/Text/Text'
import BaseCell, { CellContent } from './BaseCell'

export const SApyCell = styled(BaseCell)`
  flex: 1 0 100px;
  ${({ theme }) => theme.screen.phone} {
    flex: 1;
    padding: 10px 0px;
  }
`

const ApyCell = ({ apy, huskyRewards, apr, dailyApr, borrowingInterest, yieldFarming, tradingFees }) => {
  const { isMobile } = useMatchBreakpoints()
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Flex justifyContent="space-between">
        <Text small>{t('Current Yield Farming APR:')}</Text>
        {yieldFarming ? <Text small>{yieldFarming.toFixed(2)}%</Text> : <Skeleton width="80px" height="16px" />}
      </Flex>
      <Flex justifyContent="space-between">
        <Text small>{t('Current Trading Fees APR:')}</Text>
        {tradingFees ? <Text small>{tradingFees.toFixed(2)}%</Text> : <Skeleton width="80px" height="16px" />}
      </Flex>
      <Flex justifyContent="space-between">
        <Text small>{t('Current HUSKI Rewards APR')}</Text>
        {huskyRewards ? <Text small>{huskyRewards.toFixed(2)}%</Text> : <Skeleton width="80px" height="16px" />}
      </Flex>
      <Flex justifyContent="space-between">
        <Text small>{t('Current Borrowing Interest APR:')}</Text>
        {borrowingInterest ? (
          <Text small>-{borrowingInterest?.toFixed(2)}%</Text>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </Flex>
      <Flex justifyContent="space-between">
        <Text small>{t('Total APR:')}</Text>
        {apr ? <Text small>{apr.toFixed(2)}%</Text> : <Skeleton width="80px" height="16px" />}
      </Flex>
      <Flex justifyContent="space-between">
        <Text small>{t('Daily APR:')}</Text>
        {apr ? <Text small>{dailyApr.toFixed(2)}%</Text> : <Skeleton width="80px" height="16px" />}
      </Flex>
      <Flex justifyContent="space-between">
        <Text small>{t('Total APY:')}</Text>
        {apy ? <Text small>{apy}%</Text> : <Skeleton width="80px" height="16px" />}
      </Flex>
    </>,
    { placement: 'top-start' },
  )
  return (
    <SApyCell role="cell">
      <CellContent>
        {isMobile && (
          <Flex alignItems="center">
            <BigText textAlign="left">{t('APY')}</BigText>
          </Flex>
        )}
        {apy ? (
          <Flex alignItems="center">
            <BigText>{apy}%</BigText>
            {tooltipVisible && tooltip}
            <span ref={targetRef}>
              <InfoIcon ml="5px" color="#6F767E" />
            </span>
          </Flex>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </SApyCell>
  )
}

export default ApyCell
