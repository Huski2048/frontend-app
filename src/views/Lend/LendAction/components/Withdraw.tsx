import React, { useState, useCallback } from 'react'
import {
  Box,
  Button,
  Flex,
  Text,
  AutoRenewIcon,
  Input,
  Grid,
  useMatchBreakpoints,
  Skeleton,
  ChevronLeftIcon,
} from 'husky-uikit'
import { useHistory } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { useVault } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ArrowDownIcon } from 'assets/index'
import { getDecimalAmount } from 'utils/formatBalance'
import useTheme from 'hooks/useTheme'
import { formatDisplayedBalance } from 'utils/formatDisplayedBalance'
import styled from 'styled-components'
import { TokenImage } from 'components/TokenImage'
import { usePoolVaultFromCoingeckoId } from 'state/pool/hooks'
import { getAddress } from 'utils/addressHelpers'

interface WithdrawProps {
  name: string
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
  background-color: #f7f7f8;
  padding: 20px 15px;
  border-radius: ${({ theme }) => theme.radii.card};
  align-items: center;
`

const MaxContainer = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  height: 100%;
  ${Box} {
    padding: 0 5px;
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

const Withdraw: React.FC<WithdrawProps> = ({
  name,
  exchangeRate,
  account,
  tokenData,
  userTokenBalanceIb,
  userTokenBalance,
}) => {
  // usePollLeverageFarmsWithUserData()
  const { t } = useTranslation()
  const [amount, setAmount] = useState<string>()
  const history = useHistory()

  const setAmountToMax = () => {
    setAmount(userTokenBalanceIb.toString())
  }

  const { isMobile } = useMatchBreakpoints()
  const { toastError, toastSuccess, toastInfo } = useToast()
  const { vaultAddress } = usePoolVaultFromCoingeckoId(tokenData.coingeckoId)
  const withdrawContract = useVault(getAddress(vaultAddress))
  const { callWithGasPrice } = useCallWithGasPrice()
  const assetsReceived = new BigNumber(amount)
    .times(exchangeRate)
    .toFixed(tokenData.decimalsDigits, 1)
  const [isPending, setIsPending] = useState<boolean>(false)
  const { isDark } = useTheme()

  const handleAmountChange = useCallback(
    (event) => {
      // check if input is a number and includes decimals and allow empty string
      if (event.target.value.match(/^[0-9]*[.,]?[0-9]{0,18}$/)) {
        const input = event.target.value
        const finalValue = new BigNumber(input).gt(userTokenBalanceIb) ? userTokenBalanceIb.toString() : input
        setAmount(finalValue)
      } else {
        event.preventDefault()
      }
    },
    [userTokenBalanceIb, setAmount],
  )

  const handleConfirm = () => {
    toastInfo(t('Pending Transaction...'), t('Please Wait!'))
    const convertedStakeAmount = getDecimalAmount(new BigNumber(amount), 18)
    handleWithdrawal(convertedStakeAmount)
  }

  const callOptions = {
    gasLimit: 380000,
  }

  const handleWithdrawal = async (convertedStakeAmount: BigNumber) => {
    setIsPending(true)
    // .toString() being called to fix a BigNumber error in prod
    // as suggested here https://github.com/ChainSafe/web3.js/issues/2077
    try {
      const tx = await callWithGasPrice(withdrawContract, 'withdraw', [convertedStakeAmount.toString()], callOptions)
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Successful!'), t('Your withdraw was successfull'))
      }
    } catch (error) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    } finally {
      setIsPending(false)
      setAmount('')
    }
  }

  const balance = formatDisplayedBalance(userTokenBalanceIb, tokenData.decimalsDigits)

  return (
    <>
      <Flex flexDirection="column">
        <Flex justifyContent="space-between" mb="10px">
          <Text fontWeight="700" fontSize="14px">
            {t('From')}
          </Text>
          <Flex flexDirection={isMobile ? 'column' : 'row'} alignItems={isMobile ? null : 'flex-end'}>
            <Text color="#6F767E " fontSize="12px" mr={isMobile ? null : '5px'}>
              {t('Balance')}:
            </Text>
            {userTokenBalanceIb ? (
              <Text color={isDark ? 'white' : '#1A1D1F'} fontSize="12px" fontWeight="500">
                {`${balance} ib${name}`}
              </Text>
            ) : (
              <Skeleton width="80px" height="1rem" />
            )}
          </Flex>
        </Flex>
        <Section justifyContent="space-between" style={{ background: isDark ? '#111315' : '#F7F7F8' }} mb="25px">
          <Box mr="5px">
            <Input
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
              <Text color="textFarm" style={{ fontWeight: 700 }} width={40}>
                ib{name}
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
            {userTokenBalance ? (
              <Text color={isDark ? 'white' : '#1A1D1F'} fontWeight="500" fontSize="12px">
                {`${formatDisplayedBalance(userTokenBalance, tokenData.decimalsDigits)} ${name}`}
              </Text>
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
                  {name}
                </Text>
              </Grid>
            </MaxContainer>
          </Box>
        </Section>
      </Flex>
      <ButtonGroup flexDirection="row" justifyContent="space-between">
        <Flex style={{ alignItems: 'center', cursor: 'pointer' }}>
          <ChevronLeftIcon color="#6F767E" width="24px" height="24px" />
          <Text color="#6F767E" fontSize="16px" onClick={() => history.push('/lend')}>
            {t('Back')}
          </Text>
        </Flex>

        <ConfirmBtn
          onClick={handleConfirm}
          disabled={
            !account ||
            Number(userTokenBalanceIb) === 0 ||
            Number(amount) === 0 ||
            amount === undefined ||
            isPending ||
            exchangeRate.isNaN()
          }
          isLoading={isPending}
          endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
        >
          {isPending ? t('Confirming') : t('Confirm')}
        </ConfirmBtn>
      </ButtonGroup>
    </>
  )
}

export default Withdraw
