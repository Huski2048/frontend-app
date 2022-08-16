import React, { useState, useCallback } from 'react'
import { BigText } from 'components/Text/Text'
import styled, { useTheme } from 'styled-components'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Flex,
  Text,
  useMatchBreakpoints,
  Button,
} from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

export const SLeverageCell = styled(BaseCell)`
  flex: 1 0 160px;
  ${({ theme }) => theme.screen.tablet} {
    flex: 1 0 100px;
  }
  ${({ theme }) => theme.screen.phone} {
    flex: 1;
    padding-bottom: 5px;
  }
`
const LeverageContainer = styled(Flex)`
  border-radius: 10px;
  height: 40px;
  text-align: center;
  align-items: center;
  border: 1px solid ${({ theme }) => (theme.isDark ? '#272B30' : '#EFEFEF')};
  ${({ theme }) => theme.screen.tablet} {
    height: 36px;
  }
`

const CustomButton = styled(Button)`
  border-radius: 0;
  border: none;
  padding: 0;
  &:first-child {
    border-bottom: 1px solid ${({ theme }) => (theme.isDark ? '#272B30' : '#EFEFEF')};
  }
  max-height: 50%;
  flex: 0 1 auto;
`

export default function LeverageCell({
  leverage,
  onChange,
  childLeverage,
}: {
  leverage: any
  onChange: (value: any) => void
  childLeverage: any
}) {
  const [lvgValue, setLvgValue] = useState(childLeverage)
  React.useEffect(() => {
    setLvgValue(childLeverage)
  }, [childLeverage])

  const increaseLvgValue = useCallback(() => {
    const input = lvgValue + 0.5
    setLvgValue(input)
    onChange(input)
  }, [lvgValue, onChange])
  const decreaseLvgValue = useCallback(() => {
    const input = lvgValue - 0.5
    setLvgValue(input)
    onChange(input)
  }, [lvgValue, onChange])

  const { isMobile } = useMatchBreakpoints()
  const isSmallScreen = isMobile
  const { t } = useTranslation()
  const { isDark } = useTheme()

  return (
    <SLeverageCell role="cell">
      <CellContent>
        {isSmallScreen && (
          <Text color="textSubtle" textAlign="left">
            {t('Leverage')}
          </Text>
        )}
        <LeverageContainer alignItems="start">
          <Flex
            padding="0 1rem"
            borderRight={`1px solid ${isDark ? '#272B30' : '#EFEFEF'}`}
            height="100%"
            alignItems="center"
          >
            <BigText>{lvgValue?.toFixed(2)}</BigText>
          </Flex>
          <Flex flexDirection="column" height="100%">
            <CustomButton scale="xs" variant="secondary" onClick={increaseLvgValue} disabled={lvgValue === leverage}>
              <ChevronUpIcon color={lvgValue === leverage ? '#6F767E' : isDark ? '#6F767E' : '#292D32'} />
            </CustomButton>
            <CustomButton scale="xs" variant="secondary" onClick={decreaseLvgValue} disabled={lvgValue === 1}>
              <ChevronDownIcon color={lvgValue === 1 ? '#6F767E' : isDark ? '#6F767E' : '#292D32'} />
            </CustomButton>
          </Flex>
        </LeverageContainer>
      </CellContent>
    </SLeverageCell>
  )
}
