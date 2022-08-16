/* eslint-disable no-unused-expressions */
import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, Box, Text, Button, AutoRenewIcon, useMatchBreakpoints } from 'husky-uikit'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import { TokenImage } from 'components/TokenImage'
import { useLocation, useHistory } from 'react-router-dom'
import { useClaimFairLaunch } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL } from 'config/index'

interface RewardsProps {
  name: string
  debtPoolId: number
  earnings: number
  token: any
}

interface LocationState {
  farmsData: Record<string, any>
}

const Container = styled(Flex)`
  flex-direction: column;
  gap: 0.75rem;
  margin: 0 auto;
  width: 100%;
  max-width: 850px;
  margin-bottom: unset !important;
  border-radius: unset !important;
`
const Cell = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  padding: 1rem;
  width: 100%;
  border-radius: ${({ theme }) => theme.radii.default};
  justify-content: space-between;
  align-items: center;
`

const ClaimBtn = styled(Button)`
  width: 100%;
  height: unset;
  max-width: 90px;
  padding: 7px 10px;
  border-radius: 6px;
  font-size: 10px;
  ${({ theme }) => theme.mediaQueries.xl} {
    padding: 10px;
    font-size: 12px;
    border-radius: 8px;
  }
`

const MainText = styled(Text)`
  font-size: 12px;
  ${({ theme }) => theme.mediaQueries.xl} {
    font-size: 14px;
  }
`
const SubText = styled(Text)`
  font-size: 10px;
  ${({ theme }) => theme.mediaQueries.xl} {
    font-size: 12px;
  }
`
const TitleText = styled(Text)`
  margin: 0 auto;
  font-weight: 700;
  font-size: 12px;
  ${({ theme }) => theme.mediaQueries.xl} {
    font-size: 20px;
  }
`

const Rewards: React.FC<RewardsProps> = ({ name, earnings, token, debtPoolId }) => {
  const { t } = useTranslation()
  const [isPending, setIsPending] = useState(false)

  const rewards = new BigNumber(earnings).div(DEFAULT_TOKEN_DECIMAL).toNumber()
  const { toastError, toastSuccess, toastInfo } = useToast()
  const claimContract = useClaimFairLaunch()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { isMobile } = useMatchBreakpoints()

  const handleConfirm = async () => {
    setIsPending(true)
    try {
      toastInfo(t('Transaction Pending...'), t('Please Wait!'))
      const tx = await callWithGasPrice(claimContract, 'harvest', [debtPoolId], { gasLimit: 300000 })
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Bounty collected!'), t('bounty has been sent to your wallet.'))
      }
    } catch (error) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Cell>
      <Flex alignItems="center" maxWidth="300px" flex="1 1 auto">
        <TokenImage token={token} width={isMobile ? 20 : 44} height={isMobile ? 20 : 44} mr="8px" />
        <Box>
          <SubText color="#6F767E">{t(`Rewards from positions on`)}</SubText>
          <MainText>{t(`${name} pairs`)}</MainText>
        </Box>
      </Flex>
      <Flex flex="1 0 auto" alignItems="center" justifyContent="center">
        <Box>
          <MainText>{t('HUSKI Earned')}</MainText>
          <Text bold color="secondary">
            {rewards.toPrecision(4)}
          </Text>
        </Box>
      </Flex>
      <Flex flex="1 0 auto" alignItems="center" justifyContent="flex-end">
        <ClaimBtn
          disabled={isPending || !rewards}
          isLoading={isPending}
          onClick={handleConfirm}
          endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
        >
          {isPending ? t('Claiming') : t('Claim')}
        </ClaimBtn>
      </Flex>
    </Cell>
  )
}

const Claim: React.FC = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const {
    pathname,
    state: { farmsData },
  } = useLocation<LocationState>()

  const hash = {}
  const positionsWithEarnings = (() => {
    if (pathname.includes('single-assets')) {
      return farmsData
        .filter((f) => f.singleFlag === 0)
        ?.reduce((cur, next) => {
          hash[next.TokenInfo.token.poolId] ? '' : (hash[next.TokenInfo.token.poolId] = true && cur.push(next))
          return cur
        }, [])
    }
    return farmsData?.reduce((cur, next) => {
      hash[next.TokenInfo.token.poolId] ? '' : (hash[next.TokenInfo.token.poolId] = true && cur.push(next))
      return cur
    }, [])
  })()

  const rewards = []
  positionsWithEarnings?.forEach((pool, index) => {
    if (pool?.TokenInfo?.token?.symbol === positionsWithEarnings[index + 1]?.TokenInfo?.token?.symbol) {
      const sum =
        Number(pool?.userData?.farmEarnings) + Number(positionsWithEarnings[index + 1]?.userData?.farmEarnings)
      rewards.push({
        name: pool?.TokenInfo?.token?.symbol,
        earnings: sum,
        token: pool?.TokenInfo?.token,
      })
    }
  })

  if (pathname.includes('single-assets')) {
    return (
      <Page>
        <TitleText>{t('Harvest')}</TitleText>
        <Container>
          {positionsWithEarnings?.map((pool) => (
            <Rewards
              name={pool?.TokenInfo?.token?.symbol.replace('wBNB', 'BNB')}
              debtPoolId={pool?.TokenInfo?.token?.debtPoolId}
              earnings={Number(pool?.userData?.farmEarnings)}
              key={pool?.TokenInfo?.token?.debtPoolId}
              token={pool?.TokenInfo?.token}
            />
          ))}
          <Flex style={{ alignItems: 'center', cursor: 'pointer' }} width="100%" mt="20px">
            <img src="/images/Cheveron.svg" alt="" />
            <Text
              color="textSubtle"
              fontWeight="bold"
              fontSize="16px"
              style={{ height: '100%' }}
              onClick={() => history.goBack()}
            >
              {t('Back')}
            </Text>
          </Flex>
        </Container>
      </Page>
    )
  }
  return (
    <Page>
      {/*  <Flex justifyContent="center">
        <img src="/images/harvest.png" alt="haverst" width="193px" height="75px" />
      </Flex> */}
      <TitleText>{t('Harvest')}</TitleText>
      <Container>
        {positionsWithEarnings.map((pool) => (
          <Rewards
            name={pool?.TokenInfo?.token?.symbol.replace('wBNB', 'BNB')}
            debtPoolId={pool?.TokenInfo?.token?.debtPoolId}
            earnings={Number(pool?.userData?.farmEarnings)}
            key={pool?.TokenInfo?.token?.debtPoolId}
            token={pool?.TokenInfo?.token}
          />
        ))}
        <Flex style={{ alignItems: 'center', cursor: 'pointer' }} width="100%" mt="20px">
          <img src="/images/Cheveron.svg" alt="" />
          <Text
            color="textSubtle"
            fontWeight="bold"
            fontSize="16px"
            style={{ height: '100%' }}
            onClick={() => history.goBack()}
          >
            {t('Back')}
          </Text>
        </Flex>
      </Container>
    </Page>
  )
}

export default Claim
