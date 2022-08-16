import React, { useState, useCallback } from 'react'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import styled from 'styled-components'
import {
  useMatchBreakpoints,
  Flex,
  Text,
  ChevronDownIcon,
  ChevronUpIcon,
  Button,
  AutoRenewIcon,
} from 'husky-uikit'
import { BigText, SmText } from 'components/Text/Text'
import { useHuskiPrice, useTokenPrice } from 'state/leverage/hooks'
import { usePoolVaultData } from 'state/pool/hooks'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL } from 'config/index'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useClaimFairLaunch, useERC20 } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import { getBalanceAmount, getDecimalAmount } from 'utils/formatBalance'
import { getAddress, getFairLaunchAddress } from 'utils/addressHelpers'
import NumberInput from 'components/NumberInput'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { formatDisplayedBalance } from 'utils/formatDisplayedBalance'
import { getStakeApy } from '../../helpers'
import AprCell from './Cells/AprCell'
import TotalVolumeCell from './Cells/TotalVolumeCell'
import MyPosCell from './Cells/MyPosCell'
import NameCell from './Cells/NameCell'
import TotalValueCell from './Cells/TotalValueCell'

const StyledActionPanel = styled(Flex) <{ expanded: boolean }>`
  max-height: ${({ expanded }) => (expanded ? '1000px' : '0px')};
  opacity: ${({ expanded }) => (expanded ? '1' : '0')};
  overflow-y: hidden;
  transition: max-height 0.3s, opacity 0.3s;
  .expandedArea {
    ::-webkit-scrollbar {
      height: 8px;
    }
    /* flex-direction: column; */
    // padding: 30px 20px;
    flex-direction: row;
    align-items: center;
  }
`
const StakeContainer = styled(Flex)`
  flex-direction: column;
  margin: 0 94px 0 0;
  flex: 1 0 205px;
  ${({ theme }) => theme.screen.tablet} {
    flex: 1 0 220px;
    margin: 0 44px 0 0;
  }
  ${({ theme }) => theme.screen.phone} {
    flex: 1;
    width: 100%;
    margin: 0 0 20px 0;
    padding: 0;
  }
`
const SStakeContainer = styled(Flex)`
  flex-direction: column;
  margin-top: 10px;
  flex: 1 0 205px;
  margin-right: 48px;
  border-left: 2px solid ${({ theme }) => theme.color.tableLine};
  ${({ theme }) => theme.screen.tablet} {
    flex: 1 0 170px;
    margin-right: 6px;
  }
  ${({ theme }) => theme.screen.phone} {
    flex: 1;
    width: 100%;
    margin: 0 0 20px 0;
    padding: 0;
    border-left: none;
  }
`
const SNumberInput = styled(NumberInput) <{ isDark: boolean }>`
  background: ${({ isDark }) => (isDark ? '#111315' : '#F7F7F8')};
  color: ${({ isDark }) => (isDark ? '#fff' : '#1A1D1F')};
  height: 40px;
  font-size: 22px;
  font-weight: bold;
  padding-left: 10px;
  border-radius: 10px;
  border-color: transparent;
  flex: 1;
  ${({ theme }) => theme.screen.tablet} {
    height: 30px;
    font-size: 16px;
    border-radius: 6px;
  }
`

const SBigText = styled(Text)`
  width: 100px;
  height: 40px;
  font-size: 22px;
  font-weight: 700;
  ${({ theme }) => theme.screen.tablet} {
    width: 48px;
    height: 24px;
    font-size: 16px;
  }
`

const StyledButton = styled(Button)`
  background: ${({ disabled }) => (disabled ? '#FFFFFF' : '#7B3FE4')};
  border-radius: 10px;
  color: ${({ disabled }) => (!disabled ? 'white' : '#6F767E')};
  text-align: center;
  width: 100px;
  height: 40px;
  font-weight: 400;
  border: ${({ disabled }) => (disabled ? '1px solid #EFEFEF' : 'none')};
  box-shadow: none;
  ${({ theme }) => theme.screen.tablet} {
    width: 60px;
    height: 30px;
    font-size: 10px;
    border-radius: 6px;
  }
`

const MaxContainer = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  height: 100%;
  border-radius: 12px;
  margin-top: 14px;
  ${({ theme }) => theme.screen.phone} {
    gap: 20px;
    flex-direction: row;
  }
`

const StyledRow = styled.div<{ huski?: boolean; expanded?: boolean }>`
  background-color: ${({ theme }) => theme.card.background};
  border-left: ${({ theme, huski }) => (huski ? `2px solid  ${theme.colors.secondary}` : 'unset')};
  display: flex;
  flex-direction: column;
  padding: 23px 20px;
  border-radius: ${({ theme }) => theme.radii.card};
  &:not(:last-child) {
    margin-bottom: 8px;
  }
  > ${Flex}:first-child {
    flex-direction: column;
    ${({ theme }) => theme.mediaQueries.lg} {
      flex-direction: row;
      // padding: 23px 20px 23px 20px;
    }
  }

  ${({ theme }) => theme.screen.tablet} {
    padding: 24px 12px;
  }
`

const MaxButton = styled.button<{ isDark: boolean }>`
  width: 40px;
  height: 40px;
  margin: 0 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  border: ${({ isDark }) => (isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #dddfe0')};
  font-size: 13px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  ${({ theme }) => theme.screen.tablet} {
    width: 30px;
    height: 30px;
    border-radius: 6px;
    font-size: 10px;
  }
`

const StakeActionItem = styled(Flex)`
  overflow: auto;
  margin-top: 18px;
  padding: 35px 0 12px;
  border-top: 2px solid ${({ theme }) => theme.color.tableLine};
  ${({ theme }) => theme.screen.tablet} {
    padding: 16px 0 0;
  }
  ${({ theme }) => theme.screen.phone} {
    padding: 16px 0 0;
    flex-direction: column !important;
  }
`

const StakeRow = ({ poolData, userDataLoaded }) => {
  const { account } = useWeb3React()
  const { isTablet, isMobile } = useMatchBreakpoints()
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)
  const huskyPrice = useHuskiPrice()
  const tokenPrice = useTokenPrice(poolData?.token.coingeckoId)
  const { t } = useTranslation()
  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }
  const isSmallScreen = isMobile || isTablet
  const { userData } = poolData
  const { totalToken, totalSupply, totalStaked } = usePoolVaultData(poolData.pid)
  const tokenName = poolData?.token.symbol.replace('WBNB', 'BNB')
  const { isDark } = useTheme()
  
  const userTokenBalance = getBalanceAmount(userData.ibTokenBalance)
  const userStakedBalance = getBalanceAmount(userData.fairLaunchAmount)
  const reward = new BigNumber(poolData?.userData?.earnedHuski).div(DEFAULT_TOKEN_DECIMAL)
  const totalVolLocked = new BigNumber(totalStaked || 0)
    .times(tokenPrice || 0)
    .times(Number(totalToken) / Number(totalSupply) || 0)
  const allowance = userDataLoaded ? getBalanceAmount(userData.ibTokenAllowance) : 0
  const [isApproved, setIsApproved] = useState(Number(allowance) > 0)

  // stake operations
  const { toastError, toastSuccess, toastInfo, toastWarning } = useToast()
  // const tokenAddress = getAddress(poolData.token.address)
  const { callWithGasPrice } = useCallWithGasPrice()
  const claimContract = useClaimFairLaunch()
  const vaultIbAddress = getAddress(poolData.pool.address)
  const approveContract = useERC20(vaultIbAddress)
  const fairLaunchAddress = getFairLaunchAddress()
  const [isPending, setIsPending] = useState<boolean>(false)
  const [isPendingUnstake, setIsPendingUnstake] = useState<boolean>(false)
  const [isPendingClaim, setIsPendingClaim] = useState<boolean>(false)
  const [isApproving, setIsApproving] = useState<boolean>(false)
  const [stakeAmount, setStakeAmount] = useState<string>()
  const handleStakeInput = useCallback(
    (event) => {
      // check if input is a number and includes decimals and allow empty string
      if (event.target.value.match(/^[0-9]*[.,]?[0-9]{0,18}$/)) {
        const input = event.target.value
        const finalValue = new BigNumber(input).gt(userTokenBalance) ? userTokenBalance.toString() : input
        setStakeAmount(finalValue)
      } else {
        event.preventDefault()
      }
    },
    [userTokenBalance, setStakeAmount],
  )

  const setStakeAmountToMax = () => {
    setStakeAmount(userTokenBalance.toString())
  }

  const handleStake = async (convertedStakeAmount: BigNumber) => {
    const callOptions = {
      gasLimit: 380000,
    }

    toastInfo(t('Pending request...'), t('Please Wait!'))
    setIsPending(true)
    try {
      const tx = await callWithGasPrice(
        claimContract,
        'deposit',
        [account, poolData.pid, convertedStakeAmount.toString()],
        callOptions,
      )
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Successful!'), t('Your stake was successful'))
      }
    } catch (error) {
      toastError(t('Unsuccessful'), t('Something went wrong your request. Please try again...'))
      console.error('transaction failed', error)
    } finally {
      setIsPending(false)
      setStakeAmount('')
    }
  }

  const handleStakeConfirm = async () => {
    const convertedStakeAmount = getDecimalAmount(new BigNumber(stakeAmount), 18)
    handleStake(convertedStakeAmount)
  }

  // unstake operations
  const [unstakeAmount, setUnstakeAmount] = useState<string>()
  const handleUnstakeInput = useCallback(
    (event) => {
      // check if input is a number and includes decimals and allow empty string
      if (event.target.value.match(/^[0-9]*[.,]?[0-9]{0,18}$/)) {
        const input = event.target.value
        const finalValue = new BigNumber(input).gt(userStakedBalance) ? userStakedBalance.toString() : input
        setUnstakeAmount(finalValue)
      } else {
        event.preventDefault()
      }
    },
    [userStakedBalance, setUnstakeAmount],
  )

  const setUnstakeAmountToMax = () => {
    setUnstakeAmount(userStakedBalance.toString())
  }

  const handleUnStake = async (convertedStakeAmount: BigNumber) => {
    const callOptions = {
      gasLimit: 380000,
    }

    setIsPendingUnstake(true)
    try {
      const tx = await callWithGasPrice(
        claimContract,
        'withdraw',
        [account, poolData.pid, convertedStakeAmount.toString()],
        callOptions,
      )
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Successful!'), t('Your unstake was successfull'))
      }
    } catch (error) {
      toastError(t('Unsuccessful'), t('Something went wrong your unstake request. Please try again...'))
      console.error('transaction failed', error)
    } finally {
      setIsPendingUnstake(false)
      setUnstakeAmount('')
    }
  }

  const handleUnstakeConfirm = async () => {
    const convertedStakeAmount = getDecimalAmount(new BigNumber(unstakeAmount), 18)
    handleUnStake(convertedStakeAmount)
  }

  // claim operations
  const handleClaimConfirm = async () => {
    setIsPendingClaim(true)
    toastInfo(t('Pending request...'), t('Please Wait!'))
    try {
      const tx = await callWithGasPrice(claimContract, 'harvest', [poolData.pid], { gasLimit: 300000 })
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Successful!'), t('bounty has been sent to your wallet.'))
      }
    } catch (error) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    } finally {
      setIsPendingClaim(false)
    }
  }

  const handleApprove = async () => {
    toastInfo(t('Approving...'), t('Please Wait!'))
    setIsApproving(true)
    try {
      const tx = await approveContract.approve(fairLaunchAddress, ethers.constants.MaxUint256)
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Approved!'), t('Your request has been approved'))
        setIsApproved(true)
      } else {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      }
    } catch (error: any) {
      toastWarning(t('Error'), error.message)
    } finally {
      setIsApproving(false)
    }
  }

  return (
    <StyledRow role="row" huski={poolData?.token.symbol.toLowerCase() === 'shuski'} expanded={expanded}>
      <Flex onClick={toggleExpanded}>
        <NameCell poolData={poolData} />
        <AprCell getApyData={userDataLoaded ? getStakeApy(poolData, huskyPrice, tokenPrice) : 0} />
        <MyPosCell staked={userStakedBalance} name={tokenName} />
        <TotalValueCell valueStaked={totalStaked} name={tokenName} />
        <TotalVolumeCell volumeLocked={totalVolLocked} name={tokenName} />
        {shouldRenderActionPanel ? <ChevronUpIcon mr="10px" /> : <ChevronDownIcon mr="10px" />}
      </Flex>
      <StyledActionPanel flexDirection="column" expanded={expanded}>
        {shouldRenderActionPanel ? (
          <>
            <StakeActionItem className="expandedArea">
              <StakeContainer>
                <Flex alignItems="center" justifyContent="space-between">
                  <BigText>{t('I Want to Stake')}</BigText>
                  <SmText>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#6F767E' }}>{t('Balance:')}</span>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: isDark ? '#FFFFFF' : '#1A1D1F' }}>
                      {formatDisplayedBalance(userTokenBalance, poolData?.token?.decimalsDigits)} {tokenName}
                    </span>
                  </SmText>
                </Flex>
                <MaxContainer flexDirection={isSmallScreen ? 'column' : 'row'}>
                  <SNumberInput isDark={isDark} placeholder="0.00" onChange={handleStakeInput} value={stakeAmount} />
                  <MaxButton
                    type="button"
                    isDark={isDark}
                    style={{
                      background: isDark ? '#272B30' : '#FFFFFF',
                    }}
                    onClick={setStakeAmountToMax}
                    disabled={Number(userTokenBalance) === 0 || Number(allowance) === 0}
                  >
                    <SmText>{t('MAX')}</SmText>
                  </MaxButton>
                  {isApproved ? (
                    <StyledButton
                      onClick={handleStakeConfirm}
                      disabled={
                        !account ||
                        !(Number(allowance) > 0) ||
                        Number(stakeAmount) === 0 ||
                        stakeAmount === undefined ||
                        Number(userTokenBalance) === 0 ||
                        isPending
                      }
                      isLoading={isPending}
                      endIcon={isPending ? <AutoRenewIcon spin color="primary" /> : null}
                    >
                      {isPending ? t('Staking') : t('Stake')}
                    </StyledButton>
                  ) : (
                    <StyledButton
                      onClick={handleApprove}
                      disabled={!account || isPending}
                      isLoading={isApproving}
                      endIcon={isApproving ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
                    >
                      {isApproving ? t('Approving') : t('Approve')}
                    </StyledButton>
                  )}
                </MaxContainer>
              </StakeContainer>
              <StakeContainer>
                <Flex alignItems="center" justifyContent="space-between">
                  <BigText>{t('I Want to Unstake  ')}</BigText>
                  <SmText>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#6F767E' }}>{t('Balance:')}</span>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: isDark ? '#FFFFFF' : '#1A1D1F' }}>
                      {formatDisplayedBalance(userStakedBalance, poolData?.token?.decimalsDigits)} {tokenName}
                    </span>
                  </SmText>
                </Flex>
                <MaxContainer flexDirection={isSmallScreen ? 'column' : 'row'}>
                  <SNumberInput
                    isDark={isDark}
                    pattern="^[0-9]*[.,]?[0-9]{0,18}$"
                    placeholder="0.00"
                    onChange={handleUnstakeInput}
                    value={unstakeAmount}
                  />
                  <MaxButton
                    type="button"
                    isDark={isDark}
                    style={{
                      background: isDark ? '#272B30' : '#FFFFFF',
                    }}
                    onClick={setUnstakeAmountToMax}
                    disabled={Number(userStakedBalance) === 0}
                  >
                    <SmText fontSize="14px">{t('MAX')}</SmText>
                  </MaxButton>
                  <StyledButton
                    onClick={handleUnstakeConfirm}
                    disabled={
                      !account ||
                      Number(unstakeAmount) === 0 ||
                      unstakeAmount === undefined ||
                      Number(userStakedBalance) === 0 ||
                      isPendingUnstake
                    }
                    isLoading={isPendingUnstake}
                    endIcon={isPendingUnstake ? <AutoRenewIcon spin color="primary" /> : null}
                  >
                    {isPendingUnstake ? t('Unstaking') : t('Unstake')}
                  </StyledButton>
                </MaxContainer>
              </StakeContainer>
              <SStakeContainer paddingLeft={20}>
                <Flex alignItems="center" justifyContent="space-between">
                  <BigText>{t('HUSKI Rewards')}</BigText>
                </Flex>
                <MaxContainer>
                  <Flex alignItems="center">
                    <SBigText>
                      {reward.gt(0) ? (reward.lt(0.01) ? reward.toFixed(4, 1) : reward.toFixed(2, 1)) : '0.00'}
                    </SBigText>
                    <Flex alignItems="center">
                      <StyledButton
                        disabled={!account || Number(reward) === 0 || isPendingClaim}
                        onClick={handleClaimConfirm}
                        scale="sm"
                        isLoading={isPendingClaim}
                        endIcon={isPendingClaim ? <AutoRenewIcon spin color="primary" /> : null}
                      >
                        {isPendingClaim ? t('Claiming') : t('Claim')}
                      </StyledButton>
                    </Flex>
                  </Flex>
                </MaxContainer>
              </SStakeContainer>
            </StakeActionItem>
          </>
        ) : null}
      </StyledActionPanel>
    </StyledRow>
  )
}

export default StakeRow
