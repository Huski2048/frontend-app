import React from 'react'
import { Box, Flex, Text, useTooltip } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import InfoItem from 'components/InfoItem'
import { isNull } from 'lodash'
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

export interface RepayDebtDetailsOptions {
  amountToTrade,
  activePriceImpact,
  activeTradingFees,
  convertedTokenValue,
  convertedQuoteTokenValue,
  convertedAssetsValue,
  updatedDebt,
  remainFarm,
  remainBase,
  willTokenReceive,
  willQuoteTokenReceive,
  willReceive,
  minimumTokenReceive,
  minimumQuoteTokenReceive,
  minimumReceived,
  tokenSymbol,
  quoteTokenSymbol,
}

export interface RepayDebtDetailsProps {
  options: RepayDebtDetailsOptions
  isConvertTo?: boolean
}

const RepayDebtDetails: React.FunctionComponent<RepayDebtDetailsProps> = ({ options, isConvertTo }) => {
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
        main={t('Amount to Trade')}
        value={Number.isNaN(options.amountToTrade) ? null : Number(options.amountToTrade).toPrecision(4) + t(' ') + options.quoteTokenSymbol} />

      <InfoItem
        main={t('Price Impact')}
        value={Number.isNaN(options.activePriceImpact) ? null : options.activePriceImpact?.toPrecision(3) + t('%')}
        tooltipVisible={priceImpactTooltipVisible}
        tooltip={priceImpactTooltip}
        targetRef={priceImpactTargetRef} />

      <InfoItem
        main={t('Trading Fees')}
        value={Number.isNaN(options.activeTradingFees) ? null : options.activeTradingFees?.toPrecision(3) + t('%')}
        tooltipVisible={tradingFeesTooltipVisible}
        tooltip={tradingFeesTooltip}
        targetRef={tradingFeesTargetRef} />

      <InfoItem
        main={t('Converted Position Value Assets')}
        value={Number.isNaN(options.convertedAssetsValue) ? null : (isConvertTo
          ? (Number(options.convertedAssetsValue).toPrecision(3) + t(' ') + options.tokenSymbol)
          : (Number(options.convertedQuoteTokenValue).toPrecision(4) + t(' ')
            + options.quoteTokenSymbol
            + t(' + ')
            + Number(options.convertedTokenValue).toPrecision(4) + t(' ')
            + options.tokenSymbol))} />

      <InfoItem
        main={t('Amount of Debt to Repay')}
        value={Number.isNaN(options.updatedDebt) ? null : options.updatedDebt.toPrecision(3) + t(' ') + options.tokenSymbol} />

      <InfoItem
        main={t('Updated Position Value Assets')}
        value={Number.isNaN(options.remainFarm) ? null : options.remainFarm?.toFixed(3) + t(' ') + options.quoteTokenSymbol
          + t(' ') + t('+') + t(' ') + options.remainBase?.toFixed(3) + t(' ') + options.tokenSymbol} />

      {
        isNull(options.willReceive) || Number.isNaN(options.willReceive) ? null :
          <InfoItem
            main={t('You will receive approximately')}
            value={(isConvertTo
              ? (new BigNumber(options.willReceive).toFixed(3, 1) + t(' ') + options.tokenSymbol)
              : (new BigNumber(options.willQuoteTokenReceive).toFixed(3, 1) + t(' ')
                + options.quoteTokenSymbol
                + t(' ') + t('+') + t(' ') +
                + Number(options.willTokenReceive).toPrecision(4) + t(' ')
                + options.tokenSymbol))} />
      }

      {
       isNull(options.willReceive) ||  Number.isNaN(options.minimumReceived) ? null :
          <InfoItem
            main={t('Minimum Received')}
            value={(isConvertTo
              ? (Number(options.minimumReceived).toPrecision(4) + t(' ') + options.tokenSymbol)
              : (Number(options.minimumQuoteTokenReceive).toPrecision(4) + t(' ')
                + options.quoteTokenSymbol
                + t(' ') + t('+') + t(' ') +
                + Number(options.minimumTokenReceive).toPrecision(4) + t(' ')
                + options.tokenSymbol))} />
      }
    </Section>
  )
}

export default RepayDebtDetails