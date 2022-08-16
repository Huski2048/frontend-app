import React from 'react'
import styled from 'styled-components'
import {
  Text,
  useMatchBreakpoints,
  Skeleton,
  Flex,
  InfoIcon,
  ChevronRightIcon,
  useTooltip,
} from 'husky-uikit'
import { BigText, HighLightText } from 'components/Text/Text'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

export const SApyCell = styled(BaseCell)`
  flex: 1 0 200px;
  ${({ theme }) => theme.screen.tablet} {
    flex: 1 0 130px;
  }
  ${({theme}) => theme.screen.phone} {
    flex: 1;
    padding: 10px 0
  }
`

const SSpan = styled.span`
  display: inline;
  ${({ theme }) => theme.screen.tablet} {
    display: none;
  }
`

const ApyCell = ({ apy, yieldFarming, tradingFees, huskyRewards, apyAtOne, borrowingInterest }) => {
  const { isMobile } = useMatchBreakpoints()
  const isSmallScreen = isMobile
  const apr = yieldFarming + tradingFees + huskyRewards - borrowingInterest
  const dailyApr = apr / 365
  const { t } = useTranslation()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small>{t('Yield Farming')}</Text>
        <Text>{yieldFarming?.toFixed(2)}%</Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small>{t('Trading Fees')}</Text>
        <Text>{tradingFees.toFixed(2)}%</Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small>{t('Huski Rewards')}</Text>
        <Text>{huskyRewards.toFixed(2)}%</Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small>{t('Borrowing Interest')}</Text>
        <Text>-{Number(borrowingInterest).toFixed(2)}%</Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small>{t('Total APR')}</Text>
        <Text>{apr.toFixed(2)}%</Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small>{t('Total APY')}</Text>
        <Text>{apy}%</Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small>{t('Daily APR')}</Text>
        <Text>{dailyApr.toFixed(2)}%</Text>
      </Flex>
    </>,
    { placement: 'bottom-start' },
  )
  return (
    <SApyCell role="cell">
      <CellContent>
        {isSmallScreen && (
          <Text color="textSubtle" textAlign="left">
            {t('APY')}
          </Text>
        )}
        {apy ? (
          <Flex alignItems="center">
            <BigText>{apyAtOne}%</BigText>
            <ChevronRightIcon />
            <HighLightText>{apy}%</HighLightText>
            {tooltipVisible && tooltip}
            <SSpan ref={targetRef}>
              <InfoIcon ml="5px" color="#6F767E" />
            </SSpan>
          </Flex>
        ) : (
          <Skeleton width="80px" height="1rem" />
        )}
      </CellContent>
    </SApyCell>
  )
}

export default ApyCell
