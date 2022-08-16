import React, { useState, useCallback } from 'react'
import {
  Box,
  Button,
  Flex,
  Text,
  AutoRenewIcon,
  Grid,
  useMatchBreakpoints,
  Skeleton,
  ChevronLeftIcon,
} from 'husky-uikit'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import NumberInput from 'components/NumberInput'
import { getDecimalAmount } from 'utils/formatBalance'
import useTheme from 'hooks/useTheme'
import { getAddress } from 'utils/addressHelpers'
import { ethers } from 'ethers'
import { useVault, useERC20 } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ArrowDownIcon } from 'assets/index'
import { formatDisplayedBalance } from 'utils/formatDisplayedBalance'
import { TokenImage } from 'components/TokenImage'
import { usePoolVaultFromCoingeckoId } from 'state/pool/hooks'

interface DepositProps {
  name: string
  allowance: string
  exchangeRate: BigNumber
  account: any
  tokenData: any
  userTokenBalance: BigNumber
  userTokenBalanceIb: BigNumber
}

const ButtonGroup = styled(Flex)`
  gap: 10px;
  align-items: center;
`
const Section = styled(Flex)`
  align-items: center;
  background-color: #f7f7f8;
  padding: 20px 15px;
  border-radius: ${({ theme }) => theme.radii.card};
`

const MaxContainer = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  height: 100%;
  ${Box} {
    padding: 0 5px;
  }
`

const ApproveBtn = styled(Button)`
  border: 1px solid #7b3fe4;
  background-color: transparent;
  color: #7b3fe4;
  border-radius: 10px;
  font-size: 14px;
  line-height: 24px;
  padding: 8px 32px;
  box-shadow: none;
  height: fit-content;
  &:hover {
    background-color: #7b3fe4;
    color: #ffffff;
    opacity: 1;
  }
`
const ConfirmBtn = styled(Button)`
  // border: 1px solid currentColor;
  border-radius: 10px;
  font-size: 14px;
  line-height: 24px;
  padding: 8px 32px;
  box-shadow: none;
  height: fit-content;
`
const StyledArrowDown = styled(ArrowDownIcon)`
  fill: none;
`

const Deposit: React.FC<DepositProps> = ({
  allowance,
  exchangeRate,
  account,
  tokenData,
  name,
  userTokenBalance,
  userTokenBalanceIb,
}) => {
  // usePollLeverageFarmsWithUserData()
  const { t } = useTranslation()
  const [amount, setAmount] = useState<string>()
  const history = useHistory()

  const setAmountToMax = () => {
    if (name.toLowerCase() === 'bnb') {
      setAmount(new BigNumber(userTokenBalance).toFixed(2, 1))
    } else {
      setAmount(userTokenBalance.toString())
    }
  }

  const { toastError, toastSuccess, toastInfo, toastWarning } = useToast()
  const tokenAddress = getAddress(tokenData.address)
  const { vaultAddress } = usePoolVaultFromCoingeckoId(tokenData.coingeckoId)
  const approveContract = useERC20(tokenAddress)
  const depositContract = useVault(getAddress(vaultAddress))
  const { callWithGasPrice } = useCallWithGasPrice()
  const [isApproved, setIsApproved] = useState<boolean>(Number(allowance) > 0)
  const [isPending, setIsPending] = useState<boolean>(false)
  const [isApproving, setIsApproving] = useState<boolean>(false)
  const { isDark } = useTheme()

  const { isMobile } = useMatchBreakpoints()

  const handleAmountChange = useCallback(
    (event) => {
      // check if input is a number and includes decimals and allow empty string
      if (event.target.value.match(/^[0-9]*[.,]?[0-9]{0,18}$/)) {
        const input = event.target.value
        const finalValue = new BigNumber(input).gt(userTokenBalance) ? userTokenBalance.toString() : input
        setAmount(finalValue)
      } else {
        event.preventDefault()
      }
    },
    [userTokenBalance, setAmount],
  )

  const handleApprove = async () => {
    toastInfo(t('Approving...'), t('Please Wait!'))
    setIsApproving(true)
    try {
      const tx = await approveContract.approve(vaultAddress, ethers.constants.MaxUint256)
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

  const handleDeposit = async (convertedStakeAmount: BigNumber) => {
    const callOptions = {
      gasLimit: 380000,
    }
    const callOptionsBNB = {
      gasLimit: 380000,
      value: convertedStakeAmount.toString(),
    }
    setIsPending(true)
    try {
      toastInfo(t('Transaction Pending...'), t('Please Wait!'))
      const tx = await callWithGasPrice(
        depositContract,
        'deposit',
        [convertedStakeAmount.toString()],
        name === 'BNB' ? callOptionsBNB : callOptions,
      )
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Successful!'), t('Your deposit was successfull'))
      }
    } catch (error) {
      toastError(t('Unsuccessful'), t('Something went wrong your deposit request. Please try again...'))
    } finally {
      setIsPending(false)
      setAmount('')
    }
  }

  const handleConfirm = async () => {
    const convertedStakeAmount = getDecimalAmount(new BigNumber(amount), 18)
    handleDeposit(convertedStakeAmount)
  }
  const assetsReceived = new BigNumber(amount).div(exchangeRate).toFixed(tokenData.decimalsDigits, 1)
  const showButtons = () => {
    if (isMobile) {
      if (isApproved) {
        return (
          <ConfirmBtn
            onClick={handleConfirm}
            disabled={
              !account ||
              !isApproved ||
              Number(amount) === 0 ||
              amount === undefined ||
              Number(userTokenBalance) === 0 ||
              isPending
            }
            isLoading={isPending}
            endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
          >
            {isPending ? t('Transfering') : t('Transfer')}
          </ConfirmBtn>
        )
      }
      return (
        <ApproveBtn
          onClick={handleApprove}
          disabled={!account || isApproving}
          isLoading={isApproving}
          endIcon={isApproving ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
        >
          {isApproving ? t('Approving') : t('Approve')}
        </ApproveBtn>
      )
    }
    return (
      <Flex alignItems="center">
        {isApproved ? null : (
          <ApproveBtn
            onClick={handleApprove}
            disabled={!account || isApproving}
            isLoading={isApproving}
            endIcon={isApproving ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
            mr="10px"
          >
            {isApproving ? t('Approving') : t('Approve')}
          </ApproveBtn>
        )}
        <ConfirmBtn
          onClick={handleConfirm}
          disabled={
            !account ||
            !isApproved ||
            Number(amount) === 0 ||
            amount === undefined ||
            Number(userTokenBalance) === 0 ||
            isPending
          }
          isLoading={isPending}
          endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
        >
          {isPending ? t('Transfering') : t('Transfer')}
        </ConfirmBtn>
      </Flex>
    )
  }

  return (
    <>
      <Flex flexDirection="column">
        <Flex justifyContent="space-between" mb="10px">
          <Text fontWeight="700" fontSize="14px">
            {t('From')}
          </Text>
          <Flex flexDirection={isMobile ? 'column' : 'row'} alignItems={isMobile ? null : 'flex-end'}>
            <Text color="#6F767E " fontSize="12px" mr={isMobile ? null : '5px'}>
              {t('Balance')}:{' '}
            </Text>
            {userTokenBalance ? (
              <Text color={isDark ? 'white' : '#1A1D1F'} fontWeight="500" fontSize="12px">{`${formatDisplayedBalance(
                userTokenBalance,
                tokenData.decimalsDigits,
              )} ${name}`}</Text>
            ) : (
              <Skeleton width="80px" height="1rem" />
            )}
          </Flex>
        </Flex>
        <Section justifyContent="space-between" style={{ background: isDark ? '#111315' : '#F7F7F8' }} mb="25px">
          <Box mr="5px">
            <NumberInput
              pattern="^[0-9]*[.,]?[0-9]{0,18}$"
              placeholder="0.00"
              onChange={handleAmountChange}
              value={amount}
              style={{
                background: 'unset',
                border: 'transparent',
                borderRadius: 'unset',
                padding: '0',
                color: isDark ? 'white' : '#1A1D1F',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            />
          </Box>
          <Flex justifyContent="space-between" width={isMobile ? '100%' : null} alignItems="center">
            <button
              type="button"
              style={{
                borderRadius: '8px',
                border: `1px solid ${isDark ? '#FFFFFF1A' : '#DDDFE0'}`,
                background: isDark ? '#272B30' : '#FFFFFF',
                cursor: 'pointer',
                padding: '7px 8px',
              }}
              onClick={setAmountToMax}
            >
              <Text fontSize="14px" fontWeight="500" lineHeight="20px">
                {t('MAX')}
              </Text>
            </button>
            <Grid gridGap="10px" alignItems="center" gridTemplateRows="1fr" gridTemplateColumns="40px 1fr" ml="10px">
              <TokenImage token={tokenData} width={38} height={38} />
              <Text style={{ fontWeight: 700 }} width={40}>
                {name}
              </Text>
            </Grid>
          </Flex>
        </Section>
      </Flex>
      <Flex flexDirection="column">
        <StyledArrowDown margin="0 auto 10px" width="24px" />
        <Flex justifyContent="space-between" mb="10px">
          <Text fontWeight="700" fontSize="14px">
            {t('Recieve (Estimated)')}
          </Text>
          <Flex flexDirection={isMobile ? 'column' : 'row'} alignItems={isMobile ? null : 'flex-end'}>
            <Text color="#6F767E " fontSize="12px" mr={isMobile ? null : '5px'}>
              {t('Balance')}:{' '}
            </Text>
            {userTokenBalanceIb ? (
              <Text color={isDark ? 'white' : '#1A1D1F'} fontWeight="500" fontSize="12px">{`${formatDisplayedBalance(
                userTokenBalanceIb,
                tokenData.decimalsDigits,
              )} ib${name}`}</Text>
            ) : (
              <Skeleton width="80px" height="1rem" />
            )}
          </Flex>
        </Flex>
        <Section justifyContent="space-between" style={{ background: isDark ? '#111315' : '#F7F7F8' }} mb="20px">
          <Text style={{ backgroundColor: 'transparent', fontSize: '26px', fontWeight: 700 }}>
            {assetsReceived !== 'NaN' ? assetsReceived : 0}
          </Text>
          <Box>
            <MaxContainer>
              <Grid gridGap="10px" alignItems="center" gridTemplateRows="1fr" gridTemplateColumns="40px 1fr">
                <TokenImage token={tokenData} width={38} height={38} />
                <Text style={{ fontWeight: 700 }} width={40}>
                  ib{name}
                </Text>
              </Grid>
            </MaxContainer>
          </Box>
        </Section>
      </Flex>
      <ButtonGroup justifyContent="space-between" alignItems="center">
        <Flex style={{ alignItems: 'center', cursor: 'pointer' }}>
          <ChevronLeftIcon color="#6F767E " width="24px" height="24px" />
          <Text color="#6F767E " fontSize="16px" onClick={() => history.push('/lend')}>
            {t('Back')}
          </Text>
        </Flex>
        {showButtons()}
      </ButtonGroup>
    </>
  )
}

export default Deposit

// NOTE: javascript Number function and BigNumber.js toNumber() function might return a different value than the actual value
// if that value is bigger than MAX_SAFE_INTEGER. so needs to be careful when doing number operations.
// https://stackoverflow.com/questions/35727608/why-does-number-return-wrong-values-with-very-large-integers
