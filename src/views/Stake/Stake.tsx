import React from 'react'
import BigNumber from 'bignumber.js'
import {
  useMatchBreakpoints
} from 'husky-uikit'
import { usePools } from 'state/pool/hooks'

import Page from 'components/Layout/Page'
import { DEFAULT_TOKEN_DECIMAL, BIG_ZERO } from 'config/index'
import StakeTable from './components/StakeTable/StakeTable'

import StakeBannerBlock from './components/StakeBannerBlock/StakeBannerBlock'

const Stake: React.FC = () => {
  // const { t } = useTranslation()
  const { data: poolsData, userDataLoaded } = usePools()


  // const { callWithGasPrice } = useCallWithGasPrice()
  // const { toastError, toastSuccess, toastInfo } = useToast()
  // const cakeVaultContract = useCakeVaultContract()
  // const [isPending, setIsPending] = useState<boolean>(false)
  // const handleConfirmClick = async () => {
  //   setIsPending(true)
  //   toastInfo('Pending request...', 'Please Wait!')
  //   try {
  //     const tx = await callWithGasPrice(cakeVaultContract, 'harvest', undefined, { gasLimit: 300000 })
  //     const receipt = await tx.wait()
  //     if (receipt.status) {
  //       toastSuccess(t('Bounty collected!'), t('CAKE bounty has been sent to your wallet.'))
  //     }
  //   } catch (error) {
  //     toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
  //   } finally {
  //     setIsPending(false)
  //   }
  // }

  let reward = 0
  poolsData.map((stake) => {
    const earnings = new BigNumber(parseFloat(stake?.userData?.earnedHuski)).div(DEFAULT_TOKEN_DECIMAL).toNumber()
    reward += earnings
    return reward
  })

  // const { balance } = useTokenBalance(getHuskiAddress())
  // const alpacaBalance = balance ? balance.dividedBy(BIG_TEN.pow(18)) : BIG_ZERO
  const alpacaBalance = BIG_ZERO

  // let remainingLockedAmount = 0
  // farmsData.map((stake) => {
  //   remainingLockedAmount = new BigNumber(parseFloat(stake?.userData?.unlockedRewards))
  //     .div(DEFAULT_TOKEN_DECIMAL)
  //     .toNumber()
  //   return remainingLockedAmount
  // })

  let unlockedRewards = 0
  poolsData.map((stake) => {
    unlockedRewards = new BigNumber(parseFloat(stake?.userData?.earningHuski)).div(DEFAULT_TOKEN_DECIMAL).toNumber()
    return unlockedRewards
  })

  const { isMobile } = useMatchBreakpoints()

  return (
    <Page>
      <StakeBannerBlock isMobile={isMobile} reward={reward} alpacaBalance={alpacaBalance} unlockedRewards={unlockedRewards} />
      <StakeTable poolsData={poolsData} userDataLoaded={userDataLoaded} />
    </Page>
  )
}

export default Stake
