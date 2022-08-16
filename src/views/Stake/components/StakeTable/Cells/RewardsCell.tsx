import React, { useState } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Text, Button, Flex, Skeleton, AutoRenewIcon } from 'husky-uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { useClaimFairLaunch } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { BigText, SmText, HighLightText } from 'components/Text/Text'
import { DEFAULT_TOKEN_DECIMAL } from 'config/index'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 2 0 120px;
  }
`

const RewardsCell = ({ token }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const reward = new BigNumber(parseFloat(token?.userData?.earnings)).div(DEFAULT_TOKEN_DECIMAL)
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastError, toastSuccess, toastInfo } = useToast()
  const claimContract = useClaimFairLaunch()
  const [isPending, setIsPending] = useState<boolean>(false)

  const handleConfirmClick = async () => {
    setIsPending(true)
    toastInfo(t('Pending request...'), t('Please Wait!'))
    try {
      const tx = await callWithGasPrice(claimContract, 'harvest', [token.pid], { gasLimit: 300000 })
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Successful!'), t('bounty has been sent to your wallet.'))
      }
    } catch (error) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    } finally {
      setIsPending(false)
    }
  }

  return (
    <StyledCell role="cell">
      <CellContent>
        <Flex alignItems="center" style={{ gap: '10px' }} className="wrapper">
          <SmText>{t('HUSKI Rewards:')}</SmText>
          {reward ? <BigText>{reward.toPrecision(4)}</BigText> : <Skeleton width="80px" height="16px" />}
        </Flex>
        <Button
          disabled={!account || Number(reward) === 0}
          onClick={handleConfirmClick}
          scale="sm"
          isLoading={isPending}
          endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
        >
          {isPending ? t('Claiming') : t('Claim')}
        </Button>
      </CellContent>
    </StyledCell>
  )
}

export default RewardsCell
