import { gql } from "@apollo/client";
import { leverageFarmsConfig } from 'config/constants'
import { TradingFee } from '../types'
import { getClients, changeTradingFeeNetwork } from './clinet'

export const TRADING_FEE_GQL = gql`
query getTradingfees($pairAddress: [String]) {
    pairDayDatas(
    first:176
    orderBy:date
    orderDirection:desc
    where: {pairAddress_in: $pairAddress }
) {
    id
    pairAddress {
        id
    }
    date
    dailyVolumeUSD
    reserveUSD
    totalSupply
}
}
`

export const fetchedTradingFeesSubgraph = async (pairAddres: string[]) => {
    const { tradeFeesClient } = getClients()
    try {
        const { errors, data } = await tradeFeesClient.query({
            query: TRADING_FEE_GQL,
            variables: {
                pairAddress: pairAddres,
            }
        })
        if (errors === undefined) {
            return data.pairDayDatas
        }
    } catch {
        changeTradingFeeNetwork()
    }
    return null
}

export const fetchTradingFees = async () => {
    const TradeFees: TradingFee[] = []
    const farmsToFetch = leverageFarmsConfig
    const pairAddress = farmsToFetch.map((farmToFetch) => farmToFetch.lpAddresses[56].toLocaleLowerCase())
    const response = await fetchedTradingFeesSubgraph(pairAddress)
    if (response === null) {
        return TradeFees
    }
    for (let i = 0; i < pairAddress.length; i++) {
        const t: any[] = response.filter((f) => f.pairAddress.id === pairAddress[i])
        const tradeFee = []
        if (t.length !== 0) {
            let totalVolumeUSD = 0
            let totalreserveUSD = 0
            let apr
            for (let j = 1; j < t.length; j++) {
                totalVolumeUSD = Number(t[j].dailyVolumeUSD)
                totalreserveUSD = Number(t[j].reserveUSD)
                if (totalreserveUSD > 0) {
                    apr = totalVolumeUSD * 0.17 / totalreserveUSD
                    // apr = totalVolumeUSD * 365 * 0.17 / 100 / totalreserveUSD
                    tradeFee.push(apr)
                }
            }
        }
        const initialValue = 0;
        const sumWithInitial = tradeFee.reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            initialValue
        );
        const pids = farmsToFetch.find((f) => f.lpAddresses[56].toLocaleLowerCase() === pairAddress[i])
        TradeFees.push({
            pid: pids.pid,
            tradingFee: sumWithInitial / 7,
            tradingFee7day: tradeFee
        })
    }
    return TradeFees
}