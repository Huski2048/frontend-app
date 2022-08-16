/* eslint-disable no-unused-expressions */
import React, { useState } from 'react'
import styled from 'styled-components'
import { Skeleton, AutoRenewIcon } from 'husky-uikit'
import { useWeb3React } from '@web3-react/core'

import BigNumber from 'bignumber.js'

import {
  BannerRight,
  LineItem,
  LineLeft,
  LineRight,
  BannerIcon,
  BannerBigText,
  BannerSmText,
  SButton,
} from 'components/Banner/Banner'

import { useTranslation } from 'contexts/Localization'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useCakeVaultContract } from 'hooks/useContract'
import useToast from 'hooks/useToast'

const LendBannerRight = ({ isDark, unlockedRewards }) => {
  const [isPending, setIsPending] = useState<boolean>(false)
  const { toastError, toastSuccess, toastInfo } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const cakeVaultContract = useCakeVaultContract()
  const handleConfirmClick = async () => {
    setIsPending(true)
    toastInfo('Pending request...', 'Please Wait!')
    try {
      const tx = await callWithGasPrice(cakeVaultContract, 'harvest', undefined, { gasLimit: 300000 })
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Bounty collected!'), t('CAKE bounty has been sent to your wallet.'))
      }
    } catch (error) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    } finally {
      setIsPending(false)
    }
  }
  const { t } = useTranslation()
  const { account } = useWeb3React()
  return (
    // <SBannerRight isDark={isDark}>
    //   <LineItem>
    //     <LineLeft>
    //       <BannerSmText>{t('Total Value Locked:')}</BannerSmText>
    //     </LineLeft>
    //     <SLineRight>
    //       <BannerIcon src="/images/8826.svg" />
    //     </SLineRight>
    //   </LineItem>
    //   <LineItem>
    //     {totalValueLocked ? (
    //       <BannerBigText my="6px !important"> {totalValueLockedValue} </BannerBigText>
    //     ) : (
    //       <Skeleton width="100%" height="calc(28px * 1.5)" my="6px" />
    //     )}
    //   </LineItem>
    // </SBannerRight>

    <SBannerRight isDark={isDark}>
      <LineItem>
        <LineLeft>
          <BannerSmText>{t('Unstaked Rewards')}</BannerSmText>
        </LineLeft>
        <LineRight>
          <BannerIcon src="/images/crown.png" />
        </LineRight>
      </LineItem>
      <LineItem>
        <LineLeft>
          {!unlockedRewards ? (
            <BannerBigText>{new BigNumber(unlockedRewards).toFixed(3, 1)}</BannerBigText>
          ) : (
            <Skeleton width="50%" height="30px" my="6px" />
          )}
        </LineLeft>
        <LineRight>
          <SButton
            onClick={handleConfirmClick}
            isLoading={isPending}
            disabled={!account || Number(unlockedRewards) === 0}
            endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
          >
            {isPending ? t('Claiming') : t('Claim')}
          </SButton>
        </LineRight>
      </LineItem>
    </SBannerRight>
  )
}

export default LendBannerRight

const SBannerRight = styled(BannerRight)`
  width: 320px;
  ${({ theme }) => theme.screen.phone} {
    width: 100%;
  }
`
