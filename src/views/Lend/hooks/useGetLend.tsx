/* eslint-disable no-unused-expressions */
import BigNumber from 'bignumber.js'



export const useGetLend = (farmsData) => {
  const hash = {}
  const lendData = farmsData.reduce((cur, next) => {
    hash[next.TokenInfo.token.poolId] ? '' : (hash[next.TokenInfo.token.poolId] = true && cur.push(next))
    return cur
  }, [])
 
  console.log(lendData)


  return lendData

}
