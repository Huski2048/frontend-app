import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Button, useWalletModal } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import useAuth from 'hooks/useAuth'
import BaseCell, { CellContent } from './BaseCell'

export const SActionCell = styled(BaseCell)`
  flex: 1 0 234px;
  ${({ theme }) => theme.screen.tablet} {
    flex: 1 0 140px;
  }
  ${({ theme }) => theme.screen.phone} {
    width: 100%;
    flex: 1;
  }
  ${CellContent} {
    align-items: unset;
    justify-content: center;
    ${({ theme }) => theme.screen.phone} {
      justify-content: space-between;
      margin: 0 0 20px 0;
    }
  }
`
const StyledButton = styled(Button)`
  font-size: 13px;
  box-shadow: none;
  word-break: initial;
  border-radius: 10px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  color: ${({ disabled, theme }) => (disabled ? '#6F767E' : theme.isDark ? 'white' : '#7b3fe4')};
  background-color: ${({ theme }) => (theme.isDark ? '#1A1D1F' : 'white')};
  border: 1px solid ${({ theme, disabled }) => (disabled ? '#6F767E' : theme.isDark ? '#272B30' : '#7B3FE4')};
  width: 120px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.screen.tablet} {
    width: 68px;
    height: 24px;
    border-radius: 6px;
    font-size: 10px;
  }
  &:hover {
    background-color: ${({ disabled }) => (disabled ? 'transparent' : '#7b3fe4')};
    border: 1px solid ${({ disabled }) => (disabled ? '#6F767E' : '#7b3fe4')};
    color: ${({ disabled }) => (disabled ? '#6F767E' : 'white')};
  }
`

const ActionCell = ({ lendData }) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()

  const { login, logout } = useAuth()
  const hasProvider: boolean = !!window.ethereum || !!window.BinanceChain
  const { onPresentConnectModal } = useWalletModal(login, logout, hasProvider)

  return (
    <SActionCell role="cell">
      {account ? (
        <CellContent>
          <StyledButton
            style={{ marginRight: '5px' }}
            as={Link}
            to={{
              pathname: `/lend/deposit/${lendData.name.replace('wBNB', 'BNB')}`,
              state: { lendData },
            }}
          >
            {t('Deposit')}
          </StyledButton>
          <StyledButton
            as={Link}
            to={{ pathname: `/lend/withdraw/${lendData.name.replace('wBNB', 'BNB')}`, state: { lendData } }}
            // disabled={!apyReady || !account}
            // onClick={(e) => !account || (!apyReady && e.preventDefault())}
          >
            {t('Withdraw')}
          </StyledButton>
        </CellContent>
      ) : (
        <CellContent>
          <StyledButton style={{ marginRight: '5px' }} onClick={onPresentConnectModal}>
            {t('Deposit')}
          </StyledButton>
          <StyledButton style={{ marginRight: '5px' }} onClick={onPresentConnectModal}>
            {t('Withdraw')}
          </StyledButton>
        </CellContent>
      )}
    </SActionCell>
  )
}

export default ActionCell
