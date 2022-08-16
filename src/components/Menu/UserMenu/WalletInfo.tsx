import React from 'react'
import { Box, Button, Flex, InjectedModalProps, LinkExternal, Message, Text } from 'husky-uikit'
import { useWeb3React } from '@web3-react/core'
import { useGetBnbBalance } from 'hooks/useTokenBalance'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'
import { getBscScanLink } from 'utils'
import { getFullDisplayBalance } from 'utils/formatBalance'
import CopyAddress from './CopyAddress'

interface WalletInfoProps {
  hasLowBnbBalance: boolean
  onDismiss: InjectedModalProps['onDismiss']
}

const WalletInfo: React.FC<WalletInfoProps> = ({ hasLowBnbBalance, onDismiss }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { balance } = useGetBnbBalance()

  const { logout } = useAuth()

  const handleLogout = () => {
    onDismiss()
    logout()
  }

  return (
    <>
      <Text fontSize="14px" textTransform="uppercase" fontWeight="bold" mb="8px">
        {t('Your Wallet Address')}
      </Text>
      <CopyAddress account={account} mb="24px" />
      {hasLowBnbBalance && (
        <Message variant="warning" mb="24px">
          <Box>
            <Text fontWeight="bold">{t('Insufficient BNB')}</Text>
            <Text as="p">{t('You need more BNB to send a transaction')}</Text>
          </Box>
        </Message>
      )}
      <Flex alignItems="center" justifyContent="space-between">
        <Text>{t('BNB Balance')}</Text>
        <Text bold>{getFullDisplayBalance(balance, 18, 6)} BNB</Text>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" mb="24px" mt="10px">
        <Text>{t('CAKE Balance')}</Text>
        <Text bold>{getFullDisplayBalance(balance, 18, 3)} HUSKI</Text>
      </Flex>
      <Flex alignItems="center" mb="24px" justifyContent="space-between">
        <Text color="#7B3FE4" bold>
          {t('View on BscScan')}
        </Text>
        <LinkExternal href={getBscScanLink(account, 'address')} width={20} color="#292D32" />
      </Flex>
      <Button width="100%" onClick={handleLogout}>
        {t('Disconnect Wallet')}
      </Button>
    </>
  )
}

export default WalletInfo
