import React from 'react'
import {
  Box,
  Flex,
  ButtonMenu as UiKitButtonMenu,
  ButtonMenuItem as UiKitButtonMenuItem,
} from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { NormalText, NormalTextBold } from 'components/Text/Text'
import styled from 'styled-components'
import { TokenImage } from 'components/TokenImage'
import NumberInput from 'components/NumberInput'
import { formatDisplayedBalance } from 'utils/formatDisplayedBalance'
import { Token } from 'config/constants/types'
import BigNumber from 'bignumber.js'

const InputArea = styled(Flex) <{ isDark: boolean }>`
  background-color: ${({ isDark }) => (isDark ? '#111315' : '#F7F7F8')};
  border-radius: 12px;
  height: 48px;
  padding: 0.5rem;
  margin: 0 0 22px 0;
  flex: 1;
  align-items: center;
  ${({ theme }) => theme.screen.tablet} {
    height: 30px;
    border-radius: 8px;
  }
`

const ImgBox = styled(Box)`
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  ${({ theme }) => theme.screen.tablet} {
    height: 18px;
    width: 18px;
  }
`

const StyledNumberInput = styled(NumberInput)`
  background: transparent;
  border: none;
  box-shadow: none;
  font-size: 16px;
  font-weight: 700;
  &:focus {
    box-shadow: none !important;
  }
  ${({ theme }) => theme.screen.tablet} {
    font-size: 10px;
  }
`

const ButtonMenu = styled(UiKitButtonMenu)`
  border-radius: 6px;
  width: 100%;
  height: 25px;
  padding: 3px 4px;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.xxl} {
    height: 40px;
    border-radius: 12px;
  }
`

const ButtonMenuItem = styled(UiKitButtonMenuItem)`
  font-weight: 600;
  font-size: 12px;
  border-radius: 6px;
  height: 100%;
  ${({ theme }) => theme.mediaQueries.xxl} {
    font-size: 12px;
    border-radius: 12px;
  }
  padding: 0;
  color: ${({ isActive }) => (isActive ? '#FF6A55' : '#6F767E')};
  box-shadow: ${({ isActive }) =>
    isActive
      ? '0px 4px 8px -4px rgba(0, 0, 0, 0.25), inset 0px -1px 1px rgba(0, 0, 0, 0.04), inset 0px 2px 0px rgba(255, 255, 255, 0.25);'
      : 'none'};
`

export interface FarmInputsProps {
  token: Token
  balance: BigNumber
  tokenInput: string
  onTokenInput?: (event) => void
  buttonMenuIndex: number
  onTokenInputToFraction?: (index) => any
}

const FarmInputs: React.FunctionComponent<FarmInputsProps> = ({ 
  token,
  balance,
  tokenInput, 
  onTokenInput,
  buttonMenuIndex, 
  onTokenInputToFraction }) => {
  const { t } = useTranslation()
  const { isDark } = useTheme()

  return (
    <Box>
      <Flex>
        <NormalText style={{ marginRight: '5px' }}>
          {t('Balance:')}
        </NormalText>
        <NormalText>
          {formatDisplayedBalance(balance.toJSON(), 18)}
        </NormalText>
      </Flex>
      <InputArea justifyContent="space-between" mb="1rem" background="backgroundAlt.0" isDark={isDark}>
        <Flex alignItems="center" flex="1">
          <ImgBox mr="5px" ml="10px">
            <TokenImage token={token} width={40} height={40} />
          </ImgBox>
          <StyledNumberInput placeholder="0.00" value={tokenInput} onChange={onTokenInput} />
        </Flex>
        <NormalTextBold>{token.symbol.replace('wBNB', 'BNB')}</NormalTextBold>
      </InputArea>

      <ButtonMenu onItemClick={onTokenInputToFraction} activeIndex={buttonMenuIndex} isDark={isDark}>
        <ButtonMenuItem>25%</ButtonMenuItem>
        <ButtonMenuItem>50%</ButtonMenuItem>
        <ButtonMenuItem>75%</ButtonMenuItem>
        <ButtonMenuItem>100%</ButtonMenuItem>
      </ButtonMenu>
    </Box>
  )
}

export default FarmInputs