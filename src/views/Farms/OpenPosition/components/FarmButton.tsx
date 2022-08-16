import React, { useState } from 'react'
import { AutoRenewIcon, Box, Button, Flex, Text } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import { formatDisplayedBalance } from 'utils/formatDisplayedBalance'

export interface FarmOptions {
  approved,
  disabled,
  ltMinimumDebt,
  isBnbInput,
  leverage,
  miniDebt,
  symbol,
}

export interface FarmButtonProps {
  options: FarmOptions
  onApprove?: () => any
  onFarm?: () => any
}

const FarmButton: React.FunctionComponent<FarmButtonProps> = ({ options, onApprove, onFarm }) => {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const [isApproving, setIsApproving] = useState<boolean>(false)
  const [isPending, setIsPending] = useState(false)
  const { toastError, toastSuccess, toastInfo, toastWarning } = useToast()

  const getWrapText = (): string => {
    if (options.isBnbInput) {
      return t(`Wrap BNB & ${options.leverage}x Farm`)
    }
    return t(`${options.leverage}x Farm`)
  }

  const handleApprove = async () => {
    toastInfo(t('Approving...'), t('Please Wait!'))
    setIsApproving(true)
    try {
      const receipt = await onApprove()
      if (receipt.status) {
        toastSuccess(t('Approved!'), t('Your request has been approved'))
      } else {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      }
    } catch (error: any) {
      toastWarning(t('Error'), error.message)
    } finally {
      setIsApproving(false)
    }
  }

  const handleFarm = async () => {
    setIsPending(true)
    try {
      toastInfo(t('Pending Request!'), t('Please Wait'))
      const receipt = await onFarm()
      if (receipt.status) {
        toastSuccess(t('Successful!'), t('Your farm was successfull'))
      }
    } catch (error) {
      toastError('Unsuccessfulll', 'Something went wrong your farm request. Please try again...')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Box>
      <Flex justifyContent="center" paddingBottom="20px!important">
        {options.approved ? (
          <Button
            style={{ border: !isDark && '1px solid lightgrey', width: 290, height: 50 }}
            onClick={handleFarm}
            isLoading={isPending}
            endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
            disabled={options.disabled || isPending}
          >
            {isPending ? t('Confirming') : getWrapText()}
          </Button>
        ) : (
          <Button
            style={{ border: !isDark && '1px solid lightgrey', width: 290, height: 50 }}
            onClick={handleApprove}
            disabled={isApproving}
            isLoading={isApproving}
            endIcon={isApproving ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
          >
            {isApproving ? t('Approving') : t('Approve')}
          </Button>
        )}
      </Flex>
      <Text mx="auto" color="red" textAlign="center">
        {options.ltMinimumDebt
          ? t('Minimum Debt Size: %minimumDebt% %symbol%', {
            minimumDebt: formatDisplayedBalance(Number(options.miniDebt), 18),
            symbol: options.symbol.toUpperCase().replace('WBNB', 'BNB'),
          })
          : null}
      </Text>
    </Box>
  )
}

export default FarmButton