import BigNumber from "bignumber.js"
// FUNCTION TO FORMAT big numbers to K, M, B
// If the function doesnt work check if the number comes as a comma separated string
// ef.: 999,999,999

const nFormatter = (value: number) => {
  if (value >= 1000000000) {
    return `${new BigNumber(value).div(1000000000).toFixed(2, 1).replace(/\.0$/, '')}B`
  }
  if (value >= 1000000) {
    return `${new BigNumber(value).div(1000000).toFixed(2, 1).replace(/\.0$/, '')}M`
  }
  if (value >= 1000) {
    return `${new BigNumber(value).div(1000).toFixed(2, 1).replace(/\.0$/, '')}K`
  }
  return new BigNumber(value).toFixed(2, 1).replace(/\.0$/, '')
}
export default nFormatter