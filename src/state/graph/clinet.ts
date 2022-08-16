import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client'

export const tradingFeeClient = new ApolloClient({
    uri: 'https://bsc.streamingfast.io/subgraphs/name/pancakeswap/exchange-v2',
    cache: new InMemoryCache(),
    queryDeduplication: true,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache',
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
        },
    },
});

export const volumeClient = new ApolloClient({
    uri: 'https://thegraph.huski.finance/subgraphs/name/huskifinance/Vault',
    cache: new InMemoryCache(),
    queryDeduplication: true,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache',
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
        },
    },
});

let tradingFeeNetwork = 0
let volume24hNetwork = 0

export const changeTradingFeeNetwork = () => {
    const maxTradingFeeNetwork = 1
    if (tradingFeeNetwork <= maxTradingFeeNetwork) {
        tradingFeeNetwork++
    }
}

export const changeVolume24hNetwork = () => {
    const maxVolume24hNetwork = 1
    if (volume24hNetwork <= maxVolume24hNetwork) {
        volume24hNetwork++
    }
}

export function getVolumeClient(): ApolloClient<NormalizedCacheObject> {
    switch (volume24hNetwork) {
        case 0:
            return volumeClient
        default:
            return volumeClient
    }
}

export function getTradeFeesClient(): ApolloClient<NormalizedCacheObject> {
    switch (tradingFeeNetwork) {
        case 0:
            return tradingFeeClient
        default:
            return volumeClient
    }
}

export function getClients(): {
    tradeFeesClient: ApolloClient<NormalizedCacheObject>
    volume24Client: ApolloClient<NormalizedCacheObject>
} {
    const tradeFeesClient = getTradeFeesClient()
    const volume24Client = getVolumeClient()
    return { tradeFeesClient, volume24Client }
}