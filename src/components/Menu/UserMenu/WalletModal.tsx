import React, { useState } from 'react'
import {
  ButtonMenu,
  ButtonMenuItem,
  CloseIcon,
  Heading,
  IconButton,
  InjectedModalProps,
  ModalBody,
  ModalContainer,
  ModalHeader as UIKitModalHeader,
  ModalTitle,
} from 'husky-uikit'
import styled, { useTheme } from 'styled-components'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { FetchStatus, useGetBnbBalance } from 'hooks/useTokenBalance'
import WalletInfo from './WalletInfo'
import WalletTransactions from './WalletTransactions'

export enum WalletView {
  WALLET_INFO,
  TRANSACTIONS,
}

interface WalletModalProps extends InjectedModalProps {
  initialView?: WalletView
  onDismiss?: any
}

export const LOW_BNB_BALANCE = new BigNumber('2000000000') // 2 Gwei

const ModalHeader = styled(UIKitModalHeader)``

const Tabs = styled.div`
  padding: 16px 24px;
`

const WalletModal: React.FC<WalletModalProps> = ({ initialView = WalletView.WALLET_INFO, onDismiss }) => {
  const [view, setView] = useState(initialView)
  const { t } = useTranslation()
  const { balance, fetchStatus } = useGetBnbBalance()
  const hasLowBnbBalance = fetchStatus === FetchStatus.SUCCESS && balance.lte(LOW_BNB_BALANCE)
  const { isDark } = useTheme()

  const handleClick = (newIndex: number) => {
    setView(newIndex)
  }

  return (
    <ModalContainer title={t('Welcome!')} minWidth="350px">
      <ModalHeader>
        <ModalTitle>
          <Heading>{t('Your Wallet')}</Heading>
        </ModalTitle>
        <IconButton variant="text" onClick={onDismiss}>
          <CloseIcon width={24} />
        </IconButton>
      </ModalHeader>
      <Tabs>
        <ButtonMenu scale="sm" variant="subtle" onItemClick={handleClick} activeIndex={view} fullWidth isDark={isDark}>
          <ButtonMenuItem>{t('Wallet')}</ButtonMenuItem>
          <ButtonMenuItem>{t('Transactions')}</ButtonMenuItem>
        </ButtonMenu>
      </Tabs>
      <ModalBody p="24px" maxWidth="400px" width="100%">
        {view === WalletView.WALLET_INFO && <WalletInfo hasLowBnbBalance={hasLowBnbBalance} onDismiss={onDismiss} />}
        {view === WalletView.TRANSACTIONS && <WalletTransactions />}
      </ModalBody>
    </ModalContainer>
  )
}

export default WalletModal
