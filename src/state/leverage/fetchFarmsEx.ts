import { LeverageFarmConfig } from 'config/constants/types'
import { fetchMasterChefDatas } from './fetchMasterChefData'
import { fetchPancakeLpDatas } from './fetchPancakeLpData'
import { fetchTokenDatas } from './fetchTokenData'

const fetchFarmsEx = async (farmsToFetch: LeverageFarmConfig[]) => {
  const farmsMasterChefDatas = await fetchMasterChefDatas(farmsToFetch)
  const farmsPancakeLpDatas = await fetchPancakeLpDatas(farmsToFetch)
  const farmsTokenDatas = await fetchTokenDatas(farmsToFetch)

  return farmsToFetch.map((farm, index) => {
    const [masterChefPoolInfo, masterChefTotalAllocPoint, masterChefUserInfo] = farmsMasterChefDatas[index]
    const [lpReserves, lpTotalSupply, lpMasterChefBalance] = farmsPancakeLpDatas[index]
    const [tokenLpBalance, quoteTokenLpBalance, tokenDecimals, quoteTokenDecimals] = farmsTokenDatas[index]
    
    return {
      ...farm,
  
      masterChefData: {
        poolAllocPoint: masterChefPoolInfo.allocPoint?._hex,
        totalAllocPoint: masterChefTotalAllocPoint[0]._hex,
        userInfo: masterChefUserInfo[0]._hex
      },
      pancakeLpData: {
        token0Reserve: lpReserves[0]._hex,
        token1Reserve: lpReserves[1]._hex,
        totalSupply: lpTotalSupply[0]._hex,
        masterChefBalance: lpMasterChefBalance[0]._hex,
      },
      tokensLpData: {
        tokenLpBalance: tokenLpBalance[0]._hex,
        quoteTokenLpBalance: quoteTokenLpBalance[0]._hex,
        tokenDecimals: tokenDecimals[0],
        quoteTokenDecimals: quoteTokenDecimals[0],
      }
    }
  })
}

export default fetchFarmsEx
