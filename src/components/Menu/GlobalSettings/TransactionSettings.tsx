import React, { useState } from 'react'
import { Text, Button, Input, Flex, Box } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import { useUserSlippageTolerance } from 'state/user/hooks'
import { useTheme } from 'styled-components'
import QuestionHelper from '../../QuestionHelper'

enum SlippageError {
  InvalidInput = 'InvalidInput',
  RiskyLow = 'RiskyLow',
  RiskyHigh = 'RiskyHigh',
}

// enum DeadlineError {
//   InvalidInput = 'InvalidInput',
// }

const SlippageTabs = () => {
  const [userSlippageTolerance, setUserSlippageTolerance] = useUserSlippageTolerance()
  // const [ttl, setTtl] = useUserTransactionTTL()
  const [slippageInput, setSlippageInput] = useState('')
  // const [deadlineInput, setDeadlineInput] = useState('')

  const { t } = useTranslation()
  const { isDark } = useTheme()

  const slippageInputIsValid =
    slippageInput === '' || (userSlippageTolerance / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2)
  // const deadlineInputIsValid = deadlineInput === '' || (ttl / 60).toString() === deadlineInput

  let slippageError: SlippageError | undefined
  if (slippageInput !== '' && !slippageInputIsValid) {
    slippageError = SlippageError.InvalidInput
  } else if (slippageInputIsValid && userSlippageTolerance < 50) {
    slippageError = SlippageError.RiskyLow
  } else if (slippageInputIsValid && userSlippageTolerance > 500) {
    slippageError = SlippageError.RiskyHigh
  } else {
    slippageError = undefined
  }

  // let deadlineError: DeadlineError | undefined
  // if (deadlineInput !== '' && !deadlineInputIsValid) {
  //   deadlineError = DeadlineError.InvalidInput
  // } else {
  //   deadlineError = undefined
  // }

  const parseCustomSlippage = (value: string) => {
    setSlippageInput(value)

    try {
      const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString())
      if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
        setUserSlippageTolerance(valueAsIntFromRoundedFloat)
      }
    } catch (error) {
      console.error(error)
    }
  }

  // const parseCustomDeadline = (value: string) => {
  //   setDeadlineInput(value)

  //   try {
  //     const valueAsInt: number = Number.parseInt(value) * 60
  //     if (!Number.isNaN(valueAsInt) && valueAsInt > 0) {
  //       setTtl(valueAsInt)
  //     }
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  return (
    <Flex flexDirection="column">
      <Flex mb="12px" alignItems="center">
        <Text fontSize="14px" fontWeight="700">
          {t('Slippage Tolerance')}
        </Text>
        <QuestionHelper
          text={t(
            'Setting a high slippage tolerance can help transactions succeed, but you may not get such a good price. Use with caution.',
          )}
          placement="top-start"
          ml="4px"
        />
      </Flex>
      <Flex flexWrap="wrap">
        <Button
          mt="4px"
          mr="4px"
          width={60}
          height={35}
          onClick={() => {
            setSlippageInput('')
            setUserSlippageTolerance(10)
          }}
          style={{
            fontSize: '14px',
            fontWeight: 'normal',
            padding: 0,
            color: userSlippageTolerance === 10 ? '#FFFFFF' : '#6F767E',
            background: userSlippageTolerance === 10 ? '#7B3FE4' : '#F4F4F4',
            boxShadow: 'none',
          }}
        >
          0.1%
        </Button>
        <Button
          mt="4px"
          mr="4px"
          width={60}
          height={35}
          onClick={() => {
            setSlippageInput('')
            setUserSlippageTolerance(50)
          }}
          style={{
            fontSize: '14px',
            fontWeight: 'normal',
            padding: 0,
            color: userSlippageTolerance === 50 ? '#FFFFFF' : '#6F767E',
            background: userSlippageTolerance === 50 ? '#7B3FE4' : '#F4F4F4',
            boxShadow: 'none',
          }}
        >
          0.5%
        </Button>
        <Button
          mr="4px"
          mt="4px"
          width={60}
          height={35}
          onClick={() => {
            setSlippageInput('')
            setUserSlippageTolerance(100)
          }}
          style={{
            fontSize: '14px',
            fontWeight: 'normal',
            padding: 0,
            color: userSlippageTolerance === 100 ? '#FFFFFF' : '#6F767E',
            background: userSlippageTolerance === 100 ? '#7B3FE4' : '#F4F4F4',
            boxShadow: 'none',
          }}
        >
          1.0%
        </Button>
        <Flex alignItems="center" height={35}>
          <Box width="80px" mt="4px" height={35}>
            <Input
              placeholder={(userSlippageTolerance / 100).toFixed(2)}
              value={slippageInput}
              onBlur={() => {
                parseCustomSlippage((userSlippageTolerance / 100).toFixed(2))
              }}
              onChange={(e) => parseCustomSlippage(e.target.value)}
              isWarning={!slippageInputIsValid}
              isSuccess={![10, 50, 100].includes(userSlippageTolerance)}
              style={{
                borderRadius: '10px',
                border: isDark ? '1px solid #272B30' : 'none',
                height: '35px',
                marginTop: '2px',
                fontWeight: 'normal',
                fontSize: '14px',
                color: '#7B3FE4',
                backgroundColor: isDark ? 'transparent' : '#F4F4F4',
              }}
            />
          </Box>
          <Text ml="2px">%</Text>
        </Flex>
      </Flex>
      {!!slippageError && (
        <Text fontSize="14px" color={slippageError === SlippageError.InvalidInput ? 'red' : '#F3841E'} mt="8px">
          {slippageError === SlippageError.InvalidInput
            ? t('Enter a valid slippage percentage')
            : slippageError === SlippageError.RiskyLow
            ? t('Your transaction may fail')
            : t('Your transaction may be frontrun')}
        </Text>
      )}
    </Flex>
  )
}

export default SlippageTabs
