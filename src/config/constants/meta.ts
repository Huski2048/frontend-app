import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'Huski',
  description:
    'The most popular AMM on BSC by user count! Earn CAKE through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by Huski), NFTs, and more, on a platform you can trust.',
  image: 'https://pancakeswap.finance/images/hero.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  switch (path) {
    case '/':
      return {
        title: `${t('Home')} | ${t('Huski')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('Huski')}`,
      }

    case '/farms':
      return {
        title: `${t('Farms')} | ${t('Huski')}`,
      }
    case '/leverage':
      return {
        title: `${t('Leverage')} | ${t('Huski')}`,
      }

    default:
      return null
  }
}
