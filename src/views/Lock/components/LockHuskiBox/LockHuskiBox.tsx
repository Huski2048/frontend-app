import React, { useState } from 'react'
import styled from 'styled-components'

import { Button, Flex, Skeleton, AutoRenewIcon } from 'husky-uikit'

import { useTranslation } from 'contexts/Localization'

import { BigText, SuperBigText } from 'components/Text/Text'

import BigNumber from 'bignumber.js'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useToast from 'hooks/useToast'
import { useCakeVaultContract } from 'hooks/useContract'


const HuskiBoxBlock = ({ isSmallScreen, reward, account }) => {
  const { t } = useTranslation()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastError, toastSuccess, toastInfo } = useToast()
  const cakeVaultContract = useCakeVaultContract()
  const [isPending, setIsPending] = useState<boolean>(false)
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
  return (
    <>
      <HuskiBox>
        <BoxLeft>
          <TableIcon src="/images/lock/walletIcon.svg" />
          <Flex alignItems="center" width="fit-content" justifyContent="space-evenly">
            {isSmallScreen ? (
              <BigText>{t('My sHUSKI Wallet Balance')}</BigText>
            ) : (
              <BigText>{t('My sHUSKI Wallet Balance')}</BigText>
            )}
          </Flex>
          <SuperBigText>969,945.57</SuperBigText>
          {/* <MetamaskIcon width="30px" /> */}
          <TableIcon src="/images/lock/metamaskIcon.svg" />
        </BoxLeft>
        <BoxRight className="earnedBalance">
          <TableIcon src="/images/lock/lockIcon.svg" />
          <BigText>{t('HUSKI earned:')}</BigText>
          {reward ? (
            <SuperBigText>{new BigNumber(reward).toFixed(3, 1)}</SuperBigText>
          ) : (
            <Skeleton width="100px" height="30px" my="6px" />
          )}
          <SButton
            disabled={!account || Number(reward) === 0}
            onClick={handleConfirmClick}
            isLoading={isPending}
            endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
          >
            {isPending ? t('Claiming') : t('Claim')}
          </SButton>
        </BoxRight>
      </HuskiBox>
    </>
  )
}

export default HuskiBoxBlock

const HuskiBox = styled(Flex)`
  flex-wrap: wrap;
  padding: 30px 20px;
  border-radius: ${({ theme }) => theme.radius.card};
  background-color: ${({ theme }) => theme.colors.backgroundAlt};

  ${({ theme }) => theme.screen.tablet} {
    padding: 24px 12px;
  }
  ${({ theme }) => theme.screen.phone} {
    flex-direction: column;
    padding: 10px 20px;
    img,
    svg {
      display: none;
    }
  }
`

const BoxLeft = styled(Flex)`
  flex: 1;
  border-right: 2px solid ${({ theme }) => theme.color.tableLine};
  padding-right: 60px;
  justify-content: space-between;
  align-items: center;
  ${({ theme }) => theme.screen.tablet} {
    padding-right: 30px;
  }
  ${({ theme }) => theme.screen.phone} {
    padding: 10px 0;
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.color.tableLine};
    flex-direction: column;
    align-items: flex-start;
  }
`

const BoxRight = styled(Flex)`
  flex: 1;
  padding-left: 60px;
  justify-content: space-between;
  align-items: center;
  ${({ theme }) => theme.screen.tablet} {
    padding-left: 30px;
  }
  ${({ theme }) => theme.screen.phone} {
    padding: 10px 0;
    border-right: none;
    flex-direction: column;
    align-items: flex-start;
  }
`

const TableIcon = styled.img`
  width: 40px;
  height: 40px;
  ${({ theme }) => theme.screen.tablet} {
    width: 30px;
    height: 30px;
  }
`

const SButton = styled(Button)`
  width: 114px;
  height: 40px;
  background-color: #7b3fe4;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  ${({ theme }) => theme.screen.tablet} {
    width: 68px;
    height: 24px;
    border-radius: 6px;
    font-size: 10px;
    box-shadow: none;
  }
`
