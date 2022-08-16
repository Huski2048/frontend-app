import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Box, Button, Flex, Input, Text } from 'husky-uikit'
import Page from 'components/Layout/Page'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { useTranslation } from 'contexts/Localization'

interface LocationParams {
  data?: any
}

const StyledPage = styled(Page)`
  align-items: center;
  justify-content: start;
  gap: 20px;
`

const ButtonGroup = styled(Flex)`
  gap: 10px;
  align-items: center;
`
const Container = styled(Box) <{ isDark: boolean }>`
  width: 100%;
  background-color: ${({ isDark }) => (isDark ? '#1A1D1F' : 'white')};
  box-shadow: 0px 0px 10px 0px rgba(191, 190, 190, 0.29);
  border-radius: 12px;
  max-width: 500px;
  max-height: 528px;
  padding: 1rem;
  > * {
    margin: 1rem 0;
  }
  &.locked {
    padding-top: 30px;
    padding-bottom: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    > * {
      margin: unset;
    }
  }
`
const MaxContainer = styled(Flex)`
  align-items: center;
  height: 100%;
  ${Box} {
    padding: 0 5px;
  }
`
const Section = styled(Flex) <{ isDark: boolean }>`
  background-color: ${({ isDark }) => (isDark ? '#111315' : '#F7F7F8')};

  border-radius: 12px;
  justify-content: space-between;
  span {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
    font-size: 12px;
  }
  &.gray {
    background-color: ${({ theme }) => theme.colors.backgroundDisabled};
  }
`

const LockAction = () => {
  const { t } = useTranslation()
  const {
    state: { data: lockData },
  } = useLocation<LocationParams>()

  const { name } = lockData

  const balance = 0
  const { isDark } = useTheme()

  const [amount, setAmount] = useState<number>()
  const handleAmountChange = (e) => {
    const invalidChars = ['-', '+', 'e']
    if (invalidChars.includes(e.key)) {
      e.preventDefault()
    }
    const { value } = e.target

    const finalValue = value > balance ? balance : value
    setAmount(finalValue)
  }

  const setAmountToMax = () => {
    setAmount(balance)
  }

  const apy = 0

  return (
    <StyledPage>
      <img src="/images/HuskiPaw.png" alt="" width={48} />
      <Text fontSize="25px" mb="20px" bold>{`${t('Lock')} HUSKI UP`}</Text>
      <Container isDark={isDark}>
        <Flex justifyContent="space-between" flex="1">
          <Text fontSize="14px" fontWeight="700">
            {t('Amount')}
          </Text>
          <Text fontSize="12px">
            {t('Balance')}: <span>200.90 HUSKI</span>
          </Text>
        </Flex>

        <Section justifyContent="space-between" pt="30px" pb="30px" px="10px" isDark={isDark}>
          <Box>
            <Input
              pattern="^[0-9]*[.,]?[0-9]{0,18}$"
              placeholder="0.00"
              onChange={handleAmountChange}
              value={amount}
              style={{
                background: 'unset',
                maxWidth: '70px',
                border: 'transparent',
                padding: '0',
                fontSize: '28px',
                fontWeight: 'bold',
              }}
            />
          </Box>
          <Box>
            <MaxContainer>
              <Box>
                <button
                  type="button"
                  style={{
                    padding: '8px 7px',
                    borderRadius: '8px',
                    border: '1px solid #DDDFE0',
                    background: isDark ? 'white' : 'transparent',
                    cursor: 'pointer',
                  }}
                  onClick={setAmountToMax}
                >
                  <Text color="black">{t('MAX')}</Text>
                </button>
              </Box>
              <img
                src="/images/lock/sHuski.png"
                style={{ marginLeft: '20px', marginRight: '15px' }}
                width="40px"
                alt=""
              />
              <Box>
                <Text style={{ fontWeight: 700 }}>{name}</Text>
              </Box>
            </MaxContainer>
          </Box>
        </Section>
        <Flex justifyContent="space-between" flexWrap="wrap">
          <Text fontWeight="700">Lock HUSKI for</Text>
          <Flex>
            <Text style={{ textDecoration: 'underline' }} color="#7B3FE4" bold>
              &nbsp;3 weeks + 3 Days{' '}
            </Text>
            <Text mx="5px" bold>
              &
            </Text>
            <Text style={{ textDecoration: 'underline' }} color="#7B3FE4" bold>
              &nbsp;Auto-Relock Monthly
            </Text>
          </Flex>
        </Flex>
        <Flex justifyContent="space-between">
          <Text mt="10px">{t('APY')}</Text>
          <Text fontWeight="700">{apy}%</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>{t('Unlock Date Monthly')}</Text>
          <Text fontWeight="700">14th Oct</Text>
        </Flex>
        {/* <Button
          disabled={Number(amount) === 0 || amount === undefined || Number(balance) === 0 || isPending}
          isLoading={isPending}
          endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
          width="100%"
        >
          {isPending ? t('Confirming') : t('Confirm')}
        </Button> */}
        <ButtonGroup
          flexWrap="wrap"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          mb="20px"
          mt="30px!important"
        >
          <Flex flex="0.8" style={{ cursor: 'pointer' }} mb="10px" mt="10px">
            <img src="/images/Cheveron.svg" alt="" />
            <Text fontWeight="bold" fontSize="16px">
              BACK
            </Text>
          </Flex>
          <Flex>
            <Button style={{ width: '150px', height: '50px', borderRadius: '16px', marginRight: '10px' }}>
              Confirm
            </Button>
            <Button
              style={{
                color: '#6F767E',
                backgroundColor: isDark ? 'transparent' : '#F4F4F4',
                width: '150px',
                height: '50px',
                borderRadius: '16px',
                border: isDark ? '1px solid #272B30' : 'none',
              }}
              disabled
            >
              Lock
            </Button>
          </Flex>
        </ButtonGroup>
      </Container>
      <Container isDark={isDark}>
        <Flex justifyContent="space-between" alignItems="center">
          <Text color="text" fontWeight="700" mr="2rem">
            {t('Staked')}
          </Text>
          <Flex>
            <img
              src="/images/lock/sHuski.png"
              style={{ marginLeft: '20px', marginRight: '15px' }}
              width="24px"
              alt=""
            />
            <Text color="text" fontWeight="700">
              56.324 sHUSKI
            </Text>
          </Flex>
        </Flex>
      </Container>
    </StyledPage>
  )
}

export default LockAction
