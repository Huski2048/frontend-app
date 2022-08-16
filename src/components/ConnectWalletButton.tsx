import React from 'react'
import { Button, useWalletModal } from 'husky-uikit'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'

import styled from 'styled-components'

const StyledButton = styled(Button)`
  background-color: #7b3fe4;
  padding: 6px 10px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  margin-left: 20px;
  align-items: center;
  &:hover {
    opacity: 0.65;
  }
`

const ConnectWalletButton = (props) => {
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const hasProvider: boolean = !!window.ethereum || !!window.BinanceChain
  const { onPresentConnectModal } = useWalletModal(login, logout, hasProvider)

  return (
    <StyledButton onClick={onPresentConnectModal} {...props} heigth="36px">
      {t('Connect Wallet')}
    </StyledButton>
  )
}

export default ConnectWalletButton
