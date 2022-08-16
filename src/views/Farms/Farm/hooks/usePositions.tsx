import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import multicall from 'utils/multicall'
import { usePools } from 'state/pool/hooks'
import { getAddress } from 'utils/addressHelpers'
import VaultABI from 'config/abi/vault.json'
import WorkerABI from 'config/abi/PancakeswapV2Worker.json'

export const usePositions = () => {
  const { data: poolsData } = usePools()

  const [positionsList, setPositionsList] = useState([])

  useEffect(() => {
    const positions = async () => {
      const posList = []
      poolsData.map((pool) => {
        const positionsOfOwner = pool.userData?.positionsOfOwner
        for (let i = 0; i < positionsOfOwner.length; i++) {
          const position = {
            positionId: parseInt(positionsOfOwner[i]),
            vaultContractAddress: getAddress(pool.pool.address),
          }
          posList.push(position)
        }
        return posList
      })
      setPositionsList(posList)
    };
    positions();
  }, [poolsData])

  return { positionsList };
}

export const fetchPositionInfo = async (positions) => {

  const calls = positions.map((farm) => {
      const { positionId, vaultContractAddress } = farm
      return {
          address: vaultContractAddress,
          name: 'positions',
          params: [positionId],
      }
  })

  const positionsWorker = await multicall(VaultABI, calls)

  const positionsData = positionsWorker.map((data, index) => {

      return {
          positionId: positions[index].positionId,
          worker: data.worker,
          vault: positions[index].vaultContractAddress,
          owner: data.owner,
          debtShares: new BigNumber(data.debtShare._hex).toJSON(),
          serialCode: new BigNumber(data.serialCode._hex).toJSON(), // parseInt(data.serialCode._hex),
          blockNumber: new BigNumber(data.blockNumber._hex).toJSON(),
      }
  });

  return positionsData
}


export const fetchDebtShares = async (data) => {
  const calls = data.map((farm) => {
      return {
          address: farm.worker,
          name: 'shares',
          params: [farm.positionId]
      }
  })

  const rawVaultAllowances = await multicall(WorkerABI, calls)
  const parsedVaultAllowances = rawVaultAllowances.map((lpBalance) => {
      return new BigNumber(lpBalance).toJSON()
  })

  return parsedVaultAllowances
}

export const fetchLpAmount = async (data, debtShares) => {

  const calls = data.map((farm, index) => {
      return {
          address: farm.worker,
          name: 'shareToBalance',
          params: [debtShares[index]]
      }
  })

  const rawVaultAllowances = await multicall(WorkerABI, calls)
  const parsedVaultAllowances = rawVaultAllowances.map((lpBalance) => {
      return new BigNumber(lpBalance).toJSON()
  })

  return parsedVaultAllowances
}

export const fetchPositionsInfo = async (data) => {
  const calls = data.map((farm) => {
      return {
          address: farm.vault,
          name: 'positionInfo',
          params: [farm.positionId]
      }
  })

  const rawVaultAllowances = await multicall(VaultABI, calls)
  const parsedVaultAllowances = rawVaultAllowances.map((lpBalance) => {
      return [new BigNumber(lpBalance[0]._hex).toJSON(), new BigNumber(lpBalance[1]._hex).toJSON()]
  })

  return parsedVaultAllowances
}


interface PositionState {
  positionsData: Record<string, any>[]
  fetchStatus: FetchStatus
}
enum FetchStatus {
  NOT_FETCHED = 'not-fetched',
  SUCCESS = 'success',
  FAILED = 'failed',
}
export const usePositionsData = () => {
  BigNumber.config({ EXPONENTIAL_AT: 1e9 })
  const { positionsList } = usePositions()
  const [posData, setPosData] = useState<PositionState>(
      {
          positionsData: [],
          fetchStatus: FetchStatus.NOT_FETCHED,
      })

  useEffect(() => {
      const positions = async () => {
          try {
              const positionsWorker = await fetchPositionInfo(positionsList)
              const debtShares = await fetchDebtShares(positionsWorker)
              const lpAmount = await fetchLpAmount(positionsWorker, debtShares)
              const positionInfo = await fetchPositionsInfo(positionsWorker)
              const positionsData = positionsWorker.map((worker, index) => {
                  return {
                      positionId: worker.positionId,
                      worker: worker.worker,
                      vault: worker.vault,
                      owner: worker.owner,
                      debtShares: worker.debtShares,
                      serialCode: worker.serialCode,
                      blockNumber: worker.blockNumber,
                      lpAmount: lpAmount[index],
                      debtValue: positionInfo[index][1],
                      positionValueBase: positionInfo[index][0],
                  }
              })
              const positionsDataFilter = positionsData.filter((position) => position.debtShares !== '0')
              setPosData({
                  positionsData: positionsDataFilter,
                  fetchStatus: FetchStatus.SUCCESS,
              })
          } catch (error) {
              console.error(error)
              setPosData((prev) => ({
                  ...prev,
                  fetchStatus: FetchStatus.FAILED,
              }))
          }
      }
      positions()
  }, [positionsList])

  return posData
}

export default usePositionsData
