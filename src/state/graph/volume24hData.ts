import { gql } from '@apollo/client'
import moment from 'moment'
import { leverageFarmsConfig } from 'config/constants'
import { Volume24h } from '../types'
import { getClients, changeVolume24hNetwork } from './clinet'

export const VOLUME_24H_GQL = gql`
query getVolume($date: BigInt) {
    vaultDayDatas(
        first:10
        where: {  date: $date }
    ) {
        id
        baseTokenAddress
        baseTokenTVL
    }
}`

export const fetchedVolume24hSubgraph = async (timestamp: number) => {
    const { volume24Client } = getClients()
    try {
        const { errors, data } = await volume24Client.query({
            query: VOLUME_24H_GQL,
            variables: {
                date: timestamp,
            }
        })
        if (errors === undefined) {
            return data.vaultDayDatas
        }
    } catch (error) {
        changeVolume24hNetwork()
    }
    return null
}

export const fetchedVolume24h = async () => {
    const volume24h: Volume24h[] = []
    const farmsToFetch = leverageFarmsConfig
    const pairAddress = farmsToFetch.map((farmToFetch) => farmToFetch.lpAddresses[56].toLocaleLowerCase())
    const date = moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00');
    const timestamp = moment(date).unix()
    const response = await fetchedVolume24hSubgraph(timestamp)
    if (response === null) {
        return volume24h
    }
    if (response.length !== 0) {
        for (let i = 0; i < pairAddress.length; i++) {
            const pids = farmsToFetch.find((f) => f.lpAddresses[56].toLocaleLowerCase() === response[i].baseTokenAddress )
            volume24h.push({
                pid: pids.pid,
                volume24h:response[i].baseTokenTVL
            })
        }
    }
    return volume24h
}