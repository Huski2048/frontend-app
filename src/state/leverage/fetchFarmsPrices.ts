import BigNumber from 'bignumber.js'
import tokens from 'config/constants/tokens'
import { BIG_ZERO } from 'config/index'
import { LeverageFarm } from 'state/types'

const getFarmBaseTokenPrice = (farm: LeverageFarm, coingeckoPrices: any): BigNumber => {
  let baseTokenPrice = BIG_ZERO
  coingeckoPrices.forEach(coingeckoPrice => {
    if (coingeckoPrice.id === farm.token.coingeckoId) {
      baseTokenPrice = new BigNumber(coingeckoPrice.current_price)
    }
  })

  return baseTokenPrice
}

const getFarmQuoteTokenPrice = (farm: LeverageFarm, coingeckoPrices: any): BigNumber => {
  let quoteTokenPrice = BIG_ZERO
  coingeckoPrices.forEach(coingeckoPrice => {
    if (coingeckoPrice.id === farm.quoteToken.coingeckoId) {
      quoteTokenPrice = new BigNumber(coingeckoPrice.current_price)
    }
  })

  return quoteTokenPrice
}

const fetchFarmsPrices = async (farms) => {
  const coingeckoIds = []
  Object.keys(tokens).forEach((item) => { 
    coingeckoIds.push(item, tokens[item].coingeckoId)
  })
  
  const tokensPriceCoinGecko = `https://api.coingecko.com/api/v3/coins/markets?ids=${coingeckoIds}&vs_currency=usd&per_page=200`;
  const res = await fetch(tokensPriceCoinGecko);
  const coingeckoPrices = await res.json();

  const farmsWithPrices = farms.map((farm) => {
    const baseTokenPrice = getFarmBaseTokenPrice(farm, coingeckoPrices)
    const quoteTokenPrice = getFarmQuoteTokenPrice(farm, coingeckoPrices)
    const tokenPriceUsd = baseTokenPrice.toJSON()
    const quoteTokenPriceUsd = quoteTokenPrice.toJSON()
    return { ...farm, tokenPriceUsd, quoteTokenPriceUsd }
  })

  return farmsWithPrices
}

export default fetchFarmsPrices
