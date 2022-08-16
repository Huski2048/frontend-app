import React from 'react'
import { Box, Flex, Text, useTooltip } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { getDisplayApr } from 'views/Farms/helpers'
import InfoItem from 'components/InfoItem'
import { isNull } from 'lodash'

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

export interface FarmDetailsOptions {
  totalApr,
  noLeverageApy,
  targetLeverageApy,
  assetBorrowed,
  tokenInputNum,
  quoteTokenInputNum,
  priceImpact,
  tradingFee,
  tokenPosValue,
  quoteTokenPosValue,
  baseTokenSymbol,
  quoteTokenSymbol,
}

export interface FarmDetailsProps {
  options: FarmDetailsOptions
  farmingType?: string
}

const FarmDetails: React.FunctionComponent<FarmDetailsProps> = ({ options }) => {
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
      <Text>
        {t(
          'Trading fee collected by Huski Finance will be distributed based on our tokenomics. Go to ‘tokenomics’ for more information.',
        )}
      </Text>
    </>,
    { placement: 'top-start' },
  )

  return (
    <Section>
      <InfoItem
        main={t('APR')}
        value={options.totalApr.toFixed(2) + t('%')} />

      <InfoItem
        main={t('APY')}
        value={isNull(getDisplayApr(options.noLeverageApy)) ? null : getDisplayApr(options.noLeverageApy) + t('%')}
        toValue={getDisplayApr(options.targetLeverageApy) + t('%')} />

      <InfoItem
        main={t('Asset Borrowed')}
        value={Number.isNaN(options.assetBorrowed) ? null : options.assetBorrowed.toFixed(3) + t(' ') + options.baseTokenSymbol.replace('wBNB', 'BNB')} />

      <InfoItem
        main={t('Assets Supplied')}
        value={options.tokenInputNum.toFixed(3) + t(' ') + options.baseTokenSymbol.replace('wBNB', 'BNB')
          + t(' ') + t('+') + t(' ')
          + options.quoteTokenInputNum.toFixed(3) + t(' ') + options.quoteTokenSymbol.replace('wBNB', 'BNB')} />

      <InfoItem
        main={t('Price Impact')}
        value={Number.isNaN(options.priceImpact) ? null : options.priceImpact.toPrecision(3) + t('%')}
        tooltipVisible={priceImpactTooltipVisible}
        tooltip={priceImpactTooltip}
        targetRef={priceImpactTargetRef} />

      <InfoItem
        main={t('Trading Fees')}
        value={options.tradingFee.toPrecision(3) + t('%')}
        tooltipVisible={tradingFeesTooltipVisible}
        tooltip={tradingFeesTooltip}
        targetRef={tradingFeesTargetRef} />

      <InfoItem
        main={t('Position Value')}
        value={Number.isNaN(options.tokenPosValue) ? null : (options.tokenPosValue.toFixed(2) + t(' ') + options.baseTokenSymbol.replace('wBNB', 'BNB')
          + t(' ') + t('+') + t(' ')
          + options.quoteTokenPosValue.toFixed(2) + t(' ') + options.quoteTokenSymbol.replace('wBNB', 'BNB'))} />
    </Section>
  )
}

export default FarmDetails