import { ChainId, Token } from '@pancakeswap/sdk'

export const CAKE: { [chainId: number]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    18,
    'CAKE',
    'PancakeSwap Token',
  ),
  [ChainId.TESTNET]: new Token(
    ChainId.TESTNET,
    '0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe',
    18,
    'CAKE',
    'PancakeSwap Token',
  ),
}
export const BUSD: { [chainId: number]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    18,
    'BUSD',
    'Binance USD',
  ),
  [ChainId.TESTNET]: new Token(
    ChainId.TESTNET,
    '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
    18,
    'BUSD',
    'Binance USD',
  ),
}

export const WBNB = new Token(ChainId.MAINNET, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'WBNB', 'Wrapped BNB')
export const DAI = new Token(ChainId.MAINNET, '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', 18, 'DAI', 'Dai Stablecoin')
export const USDT = new Token(ChainId.MAINNET, '0x55d398326f99059fF775485246999027B3197955', 18, 'USDT', 'Tether USD')
export const BTCB = new Token(ChainId.MAINNET, '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', 18, 'BTCB', 'Binance BTC')
export const UST = new Token(
  ChainId.MAINNET,
  '0x23396cF899Ca06c4472205fC903bDB4de249D6fC',
  18,
  'UST',
  'Wrapped UST Token',
)
export const ETH = new Token(
  ChainId.MAINNET,
  '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
  18,
  'ETH',
  'Binance-Peg Ethereum Token',
)
export const USDC = new Token(
  ChainId.MAINNET,
  '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  18,
  'USDC',
  'Binance-Peg USD Coin',
)

const tokens = {
  cake: {
    symbol: 'CAKE',
    address: {
      56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
      97: '0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe',
    },
    decimals: 18,
    decimalsDigits: 3,
    projectLink: 'https://pancakeswap.finance/',
    coingeckoId: 'pancakeswap-token',
  },
  dodo: {
    symbol: 'DODO',
    address: {
      56: '0x67ee3cb086f8a16f34bee3ca72fad36f7db929e2',
      97: '',
    },
    decimals: 18,
    decimalsDigits: 4,
    projectLink: 'https://dodoex.io/',
    coingeckoId: 'dodo',
  },
  alpaca: {
    symbol: 'ALPACA',
    address: {
      56: '0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F',
      97: '',
    },
    decimals: 18,
    decimalsDigits: 3,
    projectLink: 'https://www.alpacafinance.org/',
    coingeckoId: 'alpaca-finance',
  },
  huski: {
    symbol: 'ALPACA',
    address: {
      56: '0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F',
      97: '',
    },
    decimals: 18,
    decimalsDigits: 3,
    projectLink: 'https://www.alpacafinance.org/',
    coingeckoId: 'alpaca-finance',
  },
  salpaca: {
    symbol: 'ALPACA',
    address: {
      56: '0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F',
      97: '',
    },
    decimals: 18,
    decimalsDigits: 3,
    projectLink: 'https://www.alpacafinance.org/',
    coingeckoId: 'alpaca-finance',
  },
  wbnb: {
    symbol: 'wBNB',
    address: {
      56: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      97: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
    },
    decimals: 18,
    decimalsDigits: 4,
    projectLink: 'https://pancakeswap.finance/',
    coingeckoId: 'binancecoin',
  },
  xvs: {
    symbol: 'XVS',
    address: {
      56: '0xcf6bb5389c92bdda8a3747ddb454cb7a64626c63',
      97: '',
    },
    decimals: 18,
    decimalsDigits: 4,
    projectLink: 'https://venus.io/',
    coingeckoId: 'venus',
  },
  sushi: {
    symbol: 'SUSHI',
    address: {
      56: '0x947950bcc74888a40ffa2593c5798f11fc9124c4',
      97: '',
    },
    decimals: 18,
    decimalsDigits: 4,
    projectLink: 'https://sushi.com/',
    coingeckoId: 'sushi',
  },
  busd: {
    symbol: 'BUSD',
    address: {
      56: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      97: '',
    },
    decimals: 18,
    decimalsDigits: 2,
    projectLink: 'https://www.paxos.com/busd/',
    coingeckoId: 'binance-usd',
  },
  eth: {
    symbol: 'ETH',
    address: {
      56: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
      97: '',
    },
    decimals: 18,
    decimalsDigits: 5,
    projectLink: 'https://ethereum.org/en/',
    coingeckoId: 'binance-eth',
  },
  usdc: {
    symbol: 'USDC',
    address: {
      56: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      97: '',
    },
    decimals: 18,
    decimalsDigits: 2,
    projectLink: 'https://www.centre.io/usdc',
    coingeckoId: 'usd-coin',
  },
  dai: {
    symbol: 'DAI',
    address: {
      56: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
      97: '',
    },
    decimals: 18,
    decimalsDigits: 4,
    projectLink: 'https://www.makerdao.com/',
    coingeckoId: 'dai',
  },
  dot: {
    symbol: 'DOT',
    address: {
      56: '0x7083609fce4d1d8dc0c979aab8c869ea2c873402',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://polkadot.network/',
    coingeckoId: 'polkadot',
  },
  link: {
    symbol: 'LINK',
    address: {
      56: '0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    decimalsDigits: 4,
    projectLink: 'https://chain.link/',
    coingeckoId: 'chainlink',
  },
  usdt: {
    symbol: 'USDT',
    address: {
      56: '0x55d398326f99059ff775485246999027b3197955',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    decimalsDigits: 2,
    projectLink: 'https://tether.to/',
    coingeckoId: 'tether',
  },
  btcb: {
    symbol: 'BTCB',
    address: {
      56: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    decimalsDigits: 6,
    projectLink: 'https://bitcoin.org/',
    coingeckoId: 'binance-bitcoin',
  },
  uni: {
    symbol: 'UNI',
    address: {
      56: '0xbf5140a22578168fd562dccf235e5d43a02ce9b1',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    decimalsDigits: 4,
    projectLink: 'https://uniswap.org/',
    coingeckoId: 'uniswap',
  },
  trx: {
    symbol: 'TRX',
    address: {
      56: '0x85eac5ac2f758618dfa09bdbe0cf174e7d574d5b',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    decimalsDigits: 4,
    projectLink: 'https://tron.network/',
    coingeckoId: 'tron',
  },
  btt: {
    symbol: 'BTT',
    address: {
      56: '0x8595f9da7b868b1822194faed312235e43007b49',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    decimalsDigits: 4,
    projectLink: 'https://www.bittorrent.com/',
    coingeckoId: 'bittorrent-2',
  },
  ada: {
    symbol: 'ADA',
    address: {
      56: '0x3ee2200efb3400fabb9aacf31297cbdd1d435d47',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    decimalsDigits: 4,
    projectLink: 'https://www.cardano.org/',
    coingeckoId: 'binance-peg-cardano',
  },
  axs: {
    symbol: 'AXS',
    address: {
      56: '0x715D400F88C167884bbCc41C5FeA407ed4D2f8A0',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    decimalsDigits: 4,
    projectLink: 'https://axieinfinity.com/',
    coingeckoId: 'axie-infinity',
  },
}

export default tokens
