import React from 'react'
import { Flex, Button, Text } from 'husky-uikit'
import QuestionHelper from 'components/QuestionHelper'
import { useTranslation } from 'contexts/Localization'
import { GAS_PRICE_GWEI, GAS_PRICE } from 'state/user/hooks/helpers'
import { useGasPriceManager } from 'state/user/hooks'

const GasSettings = () => {
  const { t } = useTranslation()
  const [gasPrice, setGasPrice] = useGasPriceManager()

  return (
    <Flex flexDirection="column">
      <Flex mb="12px" alignItems="center">
        <Text fontSize="14px" fontWeight="700">
          {t('Default Transaction Speed (GWEI)')}
        </Text>
        <QuestionHelper
          text={t(
            'Adjusts the gas price (transaction fee) for your transaction. Higher GWEI = higher speed = higher fees',
          )}
          placement="top-start"
          ml="4px"
        />
      </Flex>
      <Flex flexWrap="wrap">
        <Button
          mt="4px"
          mr="4px"
          width={100}
          height={35}
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.default)
          }}
          style={{
            fontSize: '14px',
            fontWeight: 'normal',
            padding: 0,
            color: gasPrice === GAS_PRICE_GWEI.default ? '#FFFFFF' : '#6F767E',
            background: gasPrice === GAS_PRICE_GWEI.default ? '#7B3FE4' : '#F4F4F4',
            boxShadow: 'none',
          }}
        >
          {t('Standard (%gasPrice%)', { gasPrice: GAS_PRICE.default })}
        </Button>
        <Button
          mt="4px"
          mr="4px"
          width={88}
          height={35}
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.fast)
          }}
          style={{
            fontSize: '14px',
            fontWeight: 'normal',
            padding: 0,
            color: gasPrice === GAS_PRICE_GWEI.fast ? '#FFFFFF' : '#6F767E',
            background: gasPrice === GAS_PRICE_GWEI.fast ? '#7B3FE4' : '#F4F4F4',
            boxShadow: 'none',
          }}
        >
          {t('Fast (%gasPrice%)', { gasPrice: GAS_PRICE.fast })}
        </Button>
        <Button
          mr="4px"
          mt="4px"
          width={100}
          height={35}
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.instant)
          }}
          style={{
            fontSize: '14px',
            fontWeight: 'normal',
            padding: 0,
            color: gasPrice === GAS_PRICE_GWEI.instant ? '#FFFFFF' : '#6F767E',
            background: gasPrice === GAS_PRICE_GWEI.instant ? '#7B3FE4' : '#F4F4F4',
            boxShadow: 'none',
          }}
        >
          {t('Instant (%gasPrice%)', { gasPrice: GAS_PRICE.instant })}
        </Button>
      </Flex>
    </Flex>
  )
}

export default GasSettings
