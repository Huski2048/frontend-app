import React, { useCallback, useState } from 'react'
import { Box, Button, Flex, Text, Skeleton } from 'husky-uikit'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
import NumberInput from 'components/NumberInput'
import BigNumber from 'bignumber.js'
import { TokenImage } from 'components/TokenImage'
import { useTranslation } from 'contexts/Localization'
import { formatDisplayedBalance } from 'utils/formatDisplayedBalance'
import { useAddCollateralContext } from '../context'

const InputArea = styled(Flex)`
  background: ${({ theme }) => (theme.isDark ? '#111315' : '#f7f7f8')};
  border-radius: 12px;
  padding: 0.5rem;
  align-items: center;
  input {
    font-weight: bold;
    border: none;
    box-shadow: none;
    background: none;
    &:focus:not(:disabled) {
      box-shadow: none;
    }
  }
`
const MainText = styled(Text)`
  font-size: 12px;
  ${({ theme }) => theme.mediaQueries.xxl} {
    font-size: 14px;
  }
  span {
    vertical-align: middle;
    display: inline-flex;
    margin-left: 5px;
    svg {
      width: 12px;
      ${({ theme }) => theme.mediaQueries.xxl} {
        width: 14px;
      }
    }
  }
`
const SubText = styled(Text)<{ bolder?: boolean }>`
  font-size: 10px;
  font-weight: ${({ bolder }) => (bolder ? '500' : '400')};
  color: ${({ theme, bolder }) => (bolder ? theme.colors.text : theme.colors.textSubtle)};
  ${({ theme }) => theme.mediaQueries.xxl} {
    font-size: 12px;
  }
`

const AddColateral = ({
  userQuoteTokenBalance,
  userTokenBalance,
  quoteTokenName,
  tokenName,
  quoteToken,
  token,
  tokenInput,
  quoteTokenInput,
  setTokenInput,
  setQuoteTokenInput,
}) => {
  const { t } = useTranslation()
  const [active1, setActive1] = useState(-1)
  const [active2, setActive2] = useState(-1)
  BigNumber.config({ EXPONENTIAL_AT: 1e9 })
  const handleQuoteTokenInput = useCallback(
    (event) => {
      // check if input is a number and includes decimals and allow empty string
      if (event.target.value.match(/^[0-9]*[.,]?[0-9]{0,18}$/)) {
        const input = event.target.value
        const finalValue = new BigNumber(input).gt(userQuoteTokenBalance) ? input : input
        setQuoteTokenInput(finalValue)
      } else {
        event.preventDefault()
      }
    },
    [setQuoteTokenInput, userQuoteTokenBalance],
  )
  const setQuoteTokenInputToFraction = (e: any) => {
    if (e.target.innerText === '25%') {
      setQuoteTokenInput(userQuoteTokenBalance.times(0.25).toString())
    } else if (e.target.innerText === '50%') {
      setQuoteTokenInput(userQuoteTokenBalance.times(0.5).toString())
    } else if (e.target.innerText === '75%') {
      setQuoteTokenInput(userQuoteTokenBalance.times(0.75).toString())
    } else if (e.target.innerText === '100%') {
      setQuoteTokenInput(userQuoteTokenBalance.toString())
    }
    setActive1(Number(e.target.innerText.replace('%', '')) / 25 - 1)
  }

  const handleTokenInput = useCallback(
    (event) => {
      // check if input is a number and includes decimals
      if (event.target.value.match(/^[0-9]*[.,]?[0-9]{0,18}$/)) {
        const input = event.target.value
        const finalValue = new BigNumber(input).gt(userTokenBalance) ? input : input
        setTokenInput(finalValue)
      } else {
        event.preventDefault()
      }
    },
    [setTokenInput, userTokenBalance],
  )

  const setTokenInputToFraction = (e) => {
    if (e.target.innerText === '25%') {
      setTokenInput(userTokenBalance.times(0.25).toString())
    } else if (e.target.innerText === '50%') {
      setTokenInput(userTokenBalance.times(0.5).toString())
    } else if (e.target.innerText === '75%') {
      setTokenInput(userTokenBalance.times(0.75).toString())
    } else if (e.target.innerText === '100%') {
      setTokenInput(userTokenBalance.toString())
    }
    setActive2(Number(e.target.innerText.replace('%', '')) / 25 - 1)
  }
  // cleanup input when changing between repay debt and add collateral
  const { isAddCollateral } = useAddCollateralContext()
  const { isDark } = useTheme()
  React.useEffect(() => {
    setTokenInput('')
    setQuoteTokenInput('')
  }, [isAddCollateral, setQuoteTokenInput, setTokenInput])

  if (!isAddCollateral) {
    return null
  }

  return (
    <>
      <Box>
        <MainText mt="15px">{t('Collateral')}</MainText>
        <SubText>
          {t('To form a yield farming position,assets deposited will be converted to LPs based on a 50:50 ratio.')}
        </SubText>
      </Box>
      <Box mt="30px">
        <Flex flexDirection="column" justifyContent="space-between" flex="1">
          <Box>
            <Flex alignItems="center" justifyContent="space-between">
              <Flex>
                <SubText>
                  {t('Balance')}:{' '}
                  {userQuoteTokenBalance ? (
                    <SubText as="span" bolder>
                      {formatDisplayedBalance(userQuoteTokenBalance, quoteToken?.decimalsDigits)}
                    </SubText>
                  ) : (
                    <Skeleton width="80px" height="16px" />
                  )}
                </SubText>
              </Flex>
              {/* <Flex>
                <Text small>
                  1 {quoteTokenName} = {quoteTokenPrice} BUSD
                </Text>
              </Flex> */}
            </Flex>
            <InputArea justifyContent="space-between" mb="1rem" background="backgroundAlt">
              <Box width={40} height={40} mr="5px">
                <TokenImage token={quoteToken} width={40} height={40} />
              </Box>
              <NumberInput
                style={{ border: 'none', background: 'unset' }}
                placeholder="0.00"
                value={quoteTokenInput}
                onChange={handleQuoteTokenInput}
              />
              <MainText>{quoteTokenName}</MainText>
            </InputArea>
            <Flex
              justifyContent="space-around"
              background={isDark ? '#111315' : '#F4F4F4'}
              padding="4px"
              borderRadius="12px"
            >
              <CustomButton
                variant="secondary"
                isDark={isDark}
                onClick={setQuoteTokenInputToFraction}
                active={active1 === 0}
              >
                25%
              </CustomButton>
              <CustomButton
                variant="secondary"
                isDark={isDark}
                onClick={setQuoteTokenInputToFraction}
                active={active1 === 1}
              >
                50%
              </CustomButton>
              <CustomButton
                variant="secondary"
                isDark={isDark}
                onClick={setQuoteTokenInputToFraction}
                active={active1 === 2}
              >
                75%
              </CustomButton>
              <CustomButton
                variant="secondary"
                isDark={isDark}
                onClick={setQuoteTokenInputToFraction}
                active={active1 === 3}
              >
                100%
              </CustomButton>
            </Flex>
          </Box>
          <Box mt="30px">
            <Flex alignItems="center" justifyContent="space-between">
              <Flex>
                <SubText>
                  {t('Balance')}:{' '}
                  {userTokenBalance ? (
                    <SubText as="span">{formatDisplayedBalance(userTokenBalance, token?.decimalsDigits)}</SubText>
                  ) : (
                    <Skeleton width="80px" height="16px" />
                  )}
                </SubText>
              </Flex>
              {/*  <Flex>
                <Text small>
                  1 {tokenName} = {tokenPrice} BUSD
                </Text> 
              </Flex> */}
            </Flex>
            <InputArea justifyContent="space-between" mb="1rem" background="backgroundAlt.0">
              <Flex alignItems="center" flex="1">
                <Box width={40} height={40} mr="5px">
                  <TokenImage token={token} width={40} height={40} />
                </Box>
                <NumberInput placeholder="0.00" value={tokenInput} onChange={handleTokenInput} />
              </Flex>
              <MainText>{tokenName}</MainText>
            </InputArea>
            <Flex
              justifyContent="space-around"
              background={isDark ? '#111315' : '#F4F4F4'}
              padding="4px"
              borderRadius="12px"
            >
              <CustomButton
                variant="secondary"
                isDark={isDark}
                onClick={setTokenInputToFraction}
                active={active2 === 0}
              >
                25%
              </CustomButton>
              <CustomButton
                variant="secondary"
                isDark={isDark}
                onClick={setTokenInputToFraction}
                active={active2 === 1}
              >
                50%
              </CustomButton>
              <CustomButton
                variant="secondary"
                isDark={isDark}
                onClick={setTokenInputToFraction}
                active={active2 === 2}
              >
                75%
              </CustomButton>
              <CustomButton
                variant="secondary"
                isDark={isDark}
                onClick={setTokenInputToFraction}
                active={active2 === 3}
              >
                100%
              </CustomButton>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </>
  )
}
interface custombuttonprops {
  active: boolean
  isDark: boolean
}
const CustomButton = styled(Button)<custombuttonprops>`
  box-shadow: ${({ active, isDark }) =>
    active
      ? isDark
        ? '0px 4px 8px -4px rgba(0, 0, 0, 0.25), inset 0px -1px 1px rgba(0, 0, 0, 0.04), inset 0px 2px 0px rgba(255, 255, 255, 0.06)'
        : '0px 4px 8px -4px rgba(0, 0, 0, 0.25), inset 0px -1px 1px rgba(0, 0, 0, 0.04), inset 0px 2px 0px rgba(255, 255, 255, 0.25)'
      : 'none'}!important;
  color: ${({ active, isDark }) => (active ? (isDark ? '#FF6A55' : 'black') : 'lightgrey')}!important;
  background: ${({ active, isDark }) => (active ? (isDark ? '#272B30' : 'white') : 'transparent')}!important;
  border: none !important;
  width: 25%;
`
export default AddColateral
