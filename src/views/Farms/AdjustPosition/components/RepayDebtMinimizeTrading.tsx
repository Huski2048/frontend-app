import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Box, Flex, Text, InfoIcon, ChevronRightIcon } from 'husky-uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { usePercentageToCloseContext } from '../context'

interface Props {
  currentPositionLeverage: number
  targetPositionLeverage: number
  minimizeTradingValues: any
  quoteTokenName: string
  tokenName: string
  baseTokenAmountValue: any
  farmTokenAmountValue: any
}

const Wrapper = styled(Box)`
  margin-top: 1rem;
  > ${Flex}, ${Box} {
    &:not(:first-child) {
      padding: 1rem 0;
    }
  }
`

const GrayBox = styled(Flex)<{ isDark: boolean }>`
  background-color: ${({ isDark }) => (isDark ? '#111315' : '#F4F4F4')};
  padding: 16px 24px;
  padding-right: 0;
  border-radius: 12px;
`

interface MoveProps {
  move: number
}

const MoveBox = styled(Box)<MoveProps>`
  margin-left: ${({ move }) => move}px;
  margin-top: -20px;
  margin-bottom: 10px;
  color: #83bf6e;
`

const makeLongShadow = (color: any, size: any) => {
  let i = 2
  let shadow = `${i}px 0 0 ${size} ${color}`

  for (; i < 856; i++) {
    shadow = `${shadow}, ${i}px 0 0 ${size} ${color}`
  }

  return shadow
}

const RangeInput = styled.input`
  overflow: hidden;
  display: block;
  appearance: none;
  max-width: 850px;
  width: 100%;
  margin: 0;
  height: 32px;

  cursor: pointer;

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 32px;
    background: linear-gradient(to right, #83bf6e, #83bf6e) 100% 50% / 100% 4px no-repeat transparent;
  }

  &:focus {
    outline: none;
  }

  &::-webkit-slider-thumb {
    position: relative;
    appearance: none !important;
    height: 32px;
    width: 28px;

    background-image: url('/images/RangeHandle1.png');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% 100%;

    border: 0;
    top: 50%;
    transform: translateY(-50%);
    box-shadow: ${makeLongShadow('rgb(193,223,183)', '-13px')};
    transition: background-color 150ms;
    &::before {
      height: 32px;
      width: 32px;
      background: red !important;
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
const ValueText = styled(Text)`
  font-size: 12px;
  font-weight: 700;
  ${({ theme }) => theme.mediaQueries.xxl} {
    font-size: 14px;
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
const RepayDebtMinimizeTrading: React.FC<Props> = ({
  currentPositionLeverage,
  targetPositionLeverage,
  minimizeTradingValues,
  quoteTokenName,
  tokenName,
  baseTokenAmountValue,
  farmTokenAmountValue,
}) => {
  const { needCloseBase, needCloseFarm, remainBase, remainFarm } = minimizeTradingValues
  const { t } = useTranslation()
  const { percentage, setPercentage } = usePercentageToCloseContext()
  const targetRef = React.useRef<any>()
  const [moveVal, setMoveVal] = useState({ width: 0, height: 0 })
  const [margin, setMargin] = useState(0)

  const { isDark } = useTheme()
  useLayoutEffect(() => {
    if (targetRef.current !== null && targetRef.current !== undefined) {
      setMoveVal({
        width: targetRef?.current?.offsetWidth,
        height: targetRef?.current?.offsetHeight,
      })
    }
  }, [percentage])

  useEffect(() => {
    setMargin(((moveVal.width - 32) / 100) * percentage)
  }, [percentage, moveVal.width])

  return (
    <Wrapper>
      <GrayBox isDark={isDark}>
        <InfoIcon />
        <SubText>
          {t(
            'We will convert the minimun required amount to tokens into USDT to payback the debt and return the remaining assets to you.',
            { tokenName },
          )}
        </SubText>
      </GrayBox>
      {(currentPositionLeverage === 1 || targetPositionLeverage === 1) && (
        <Box>
          <MainText>
            {t('What percentage of position value would you like to close?')}{' '}
            {currentPositionLeverage !== 1 && t('(After repay all debt)')}
          </MainText>

          <Flex>
            <Box
              style={{ width: '100%', maxWidth: '850px', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px' }}
            >
              <MoveBox move={margin}>
                <Text color="#83BF6E" bold>
                  {percentage}%
                </Text>
              </MoveBox>
              <Box ref={targetRef} style={{ width: '100%' }} mt="-20px">
                <RangeInput
                  type="range"
                  min="0.0"
                  max="100"
                  step="1"
                  name="leverage"
                  value={percentage}
                  onChange={(e) => setPercentage(Number(e.target.value))}
                  list="percentageToClose"
                  style={{ width: '100%' }}
                />
              </Box>
              <datalist
                style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '-15px' }}
                id="percentageToClose"
              >
                <option value={0} label="0%" style={{ color: '#6F767E', fontWeight: 'bold', fontSize: '13px' }} />
                <option value={25} label="25%" style={{ color: '#6F767E', fontWeight: 'bold', fontSize: '13px' }} />
                <option value={50} label="50%" style={{ color: '#6F767E', fontWeight: 'bold', fontSize: '13px' }} />
                <option value={75} label="75%" style={{ color: '#6F767E', fontWeight: 'bold', fontSize: '13px' }} />
                <option value={100} label="100%" style={{ color: '#6F767E', fontWeight: 'bold', fontSize: '13px' }} />
              </datalist>
            </Box>
          </Flex>
        </Box>
      )}
      <Flex justifyContent="space-between" alignItems="center">
        <MainText>{t('Position Value Assets to Close')}</MainText>
        <ValueText>
          {needCloseFarm?.toFixed(3)} {quoteTokenName} + {needCloseBase?.toFixed(3)} {tokenName}
        </ValueText>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <MainText>{t('Updated Position Value Assets')}</MainText>
        <Flex>
          <ValueText>
            {farmTokenAmountValue?.toFixed(3)} {quoteTokenName} + {baseTokenAmountValue?.toFixed(3)} {tokenName}
          </ValueText>
          <ChevronRightIcon />
          <ValueText>
            {remainFarm?.toFixed(3)} {quoteTokenName} + {remainBase?.toFixed(3)} {tokenName}
          </ValueText>
        </Flex>
      </Flex>
    </Wrapper>
  )
}

export default RepayDebtMinimizeTrading
