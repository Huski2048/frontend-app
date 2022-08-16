import React from 'react'
import { Box, Flex } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import DebtRatioProgress from 'components/DebRatioProgress'
import styled from 'styled-components'
import { BigText, SmText } from 'components/Text/Text'

const Section = styled(Box)`
  &.gray {
    background-color: ${({ theme }) => theme.colors.input};
  }
  background-color: ${({ theme }) => theme.card.background};
  box-shadow: ${({ theme }) => theme.card.boxShadow};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 1rem;

  > ${Flex} {
    padding: 1.2rem 10px 1.2rem 0px;
  }

  input[type='range'] {
    -webkit-appearance: none;
  }
`

export interface DebtProgressOptions {
  debtRatio,
  liquidationThreshold,
  maxValue,
  quoteTokenSymbol, 
  baseTokenSymbol, 
  priceChangeText, 
  priceChangeAbs
}

export interface DebtProgressProps {
  options: DebtProgressOptions
}

const DebtProgress: React.FunctionComponent<DebtProgressProps> = ({ options }) => {
  const { t } = useTranslation()
  
  const quoteTokenSymbol = options?.quoteTokenSymbol
  const baseTokenSymbol = options?.baseTokenSymbol
  const priceChangeText = options?.priceChangeText
  const priceChangeAbs = options?.priceChangeAbs
  return (
    <Section>
      <BigText>{t('My Debt Status')}</BigText>
      <Flex height="150px" alignItems="center" style={{ border: 'none' }}>
        <DebtRatioProgress
          debtRatio={options.debtRatio * 100}
          liquidationThreshold={options.liquidationThreshold}
          max={options.maxValue * 100}
        />
      </Flex>
      <SmText small color="textSubtle">
        {t(
          'Keep in mind: when the price of %farmToken% against %baseToken% %priceChangeText% %priceChangeAbs%%, the debt ratio will exceed the liquidation ratio, your assets might encounter liquidation.',
          { quoteTokenSymbol, baseTokenSymbol, priceChangeText, priceChangeAbs },
        )}
      </SmText>
    </Section>
  )
}

export default DebtProgress