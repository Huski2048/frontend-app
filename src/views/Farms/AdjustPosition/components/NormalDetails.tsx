import React from 'react'
import { Box, Flex, Text, useTooltip } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import InfoItem from 'components/InfoItem'
import BigNumber from 'bignumber.js'

const Section = styled(Box)`
  &.gray {
    background-color: ${({ theme }) => theme.colors.input};
  }
  background-color: ${({ theme }) => theme.card.background};
  box-shadow: ${({ theme }) => theme.card.boxShadow};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 0 20px;

  > ${Flex} {
    padding: 1.2rem 10px 1.2rem 0px;
  }

  input[type='range'] {
    -webkit-appearance: none;
  }
`

export interface NormalDetailsOptions {
  tokenInputValue,
  quoteTokenInputValue,
  assetsBorrowed,
  priceImpact,
  tradingFees,
  baseTokenInPosition,
  quoteTokenInPosition,
  tokenSymbol,
  quoteTokenSymbol,
}

export interface NormalDetailsProps {
  params: NormalDetailsOptions
  isAddCollateral: boolean
  isAddLeverage: boolean
}

const NormalDetails: React.FunctionComponent<NormalDetailsProps> = ({
  params,
  isAddCollateral = false,
  isAddLeverage = false }) => {
  const { t } = useTranslation()

  const {
    targetRef: priceImpactTargetRef,
    tooltip: priceImpactTooltip,
    tooltipVisible: priceImpactTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t('Price impact will be calculated based on your supplied asset value and the current price.')}</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: tradingFeesTargetRef,
    tooltip: tradingFeesTooltip,
    tooltipVisible: tradingFeesTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t('PancakeSwap trading fees')}</Text>
      <Text>{t('HUSKI trading fees')}</Text>
    </>,
    { placement: 'top-start' },
  )
  return (
    <Section>
      <InfoItem
        main={t('Assets Supplied')}
        value={new BigNumber(params.tokenInputValue).toFixed(3, 1) + t(' ')
          + params.tokenSymbol
          + t(' + ')
          + new BigNumber(params.quoteTokenInputValue).toFixed(3, 1) + t(' ')
          + params.quoteTokenSymbol} />

      {isAddCollateral && !isAddLeverage ?
        <InfoItem
          main={t('Collateral to be Added')}
          value={new BigNumber(params.tokenInputValue).toFixed(3, 1) + t(' ')
            + params.tokenSymbol
            + t(' + ')
            + new BigNumber(params.quoteTokenInputValue).toFixed(3, 1) + t(' ')
            + params.quoteTokenSymbol} />
        : null}

      {isAddLeverage ?
        <InfoItem
          main={t('Assets to be borrowed')}
          value={Number.isNaN(params.assetsBorrowed) ? null : params.assetsBorrowed.toFixed(3) + t(' ') + params.tokenSymbol} />
        : null}

      <InfoItem
        main={t('Price Impact')}
        value={Number.isNaN(params.priceImpact) ? null : params.priceImpact?.toPrecision(3) + t('%')}
        tooltipVisible={priceImpactTooltipVisible}
        tooltip={priceImpactTooltip}
        targetRef={priceImpactTargetRef} />

      <InfoItem
        main={t('Trading Fees')}
        value={Number.isNaN(params.tradingFees) ? null : params.tradingFees?.toPrecision(3) + t('%')}
        tooltipVisible={tradingFeesTooltipVisible}
        tooltip={tradingFeesTooltip}
        targetRef={tradingFeesTargetRef} />

      <InfoItem
        main={t('Updated Total Assets')}
        value={Number.isNaN(params.baseTokenInPosition) ? null : params.baseTokenInPosition?.toFixed(2) + t(' ') + params.tokenSymbol
          + t(' ') + t('+') + t(' ') + params.quoteTokenInPosition?.toFixed(2) + t(' ') + params.quoteTokenSymbol} />

    </Section>
  )
}

export default NormalDetails