import { useMemo } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import {
  getVaultContract,
  getBep20Contract,
  getClaimFairLaunchContract,
  getProfileContract,
  getMasterchefContract,
  getErc721Contract,
  getCakeVaultContract,
} from 'utils/contractHelpers'
import { getMulticallAddress } from 'utils/addressHelpers'

// Imports below migrated from Exchange useContract.ts
import { Contract } from '@ethersproject/contracts'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { ERC20_BYTES32_ABI } from '../config/abi/erc20'
import ERC20_ABI from '../config/abi/erc20.json'
import multiCallAbi from '../config/abi/Multicall.json'
import { getContract } from '../utils'

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useERC20 = (address: string) => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getBep20Contract(address, library.getSigner()), [address, library])
}

export const useVault = (address: string) => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getVaultContract(address, library.getSigner()), [address, library])
}

/**
 * @see https://docs.openzeppelin.com/contracts/3.x/api/token/erc721
 */
export const useERC721 = (address: string) => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getErc721Contract(address, library.getSigner()), [address, library])
}


export const useClaimFairLaunch = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getClaimFairLaunchContract(library.getSigner()), [library])
}

export const useProfile = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getProfileContract(library.getSigner()), [library])
}

export const useMasterchef = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getMasterchefContract(library.getSigner()), [library])
}

export const useCakeVaultContract = () => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getCakeVaultContract(library.getSigner()), [library])
}

// Code below migrated from Exchange useContract.ts

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible)
}

export function useMulticallContract(): Contract | null {
  return useContract(getMulticallAddress(), multiCallAbi, false)
}
