import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { State } from 'state/types'
import { useAppDispatch } from 'state'
import { getClients } from './clinet'
import { fetchTradingFees } from './tradingFeesData'
import { fetchedVolume24h } from './volume24hData'
import { setTradingFee, setVolume24h } from './index'

export const useTradingFees = () => {
    const { tradeFeesClient } = getClients()
    const dispatch = useAppDispatch()
    const timestamp = Date.parse(new Date().toString())
    const day = Math.floor(timestamp / 86400000)
    useEffect(() => {
        (async () => {
            const tradingFee = await fetchTradingFees()
            dispatch(setTradingFee(tradingFee))
        })();
    }, [dispatch, day, tradeFeesClient])
}

export const useVolume24hData = () => {
    const { volume24Client } = getClients()
    const dispatch = useAppDispatch()
    const timestamp = Date.parse(new Date().toString())
    const day = Math.floor(timestamp / 86400000)
    useEffect(() => {
        (async () => {
            const volume24h = await fetchedVolume24h()
            dispatch(setVolume24h(volume24h))
        })();
    }, [dispatch, day, volume24Client])
}

export const useTradeFees = () => {
    const tradingFees = useSelector((state: State) => state.graph.tradingFees)
    return tradingFees
}

export const useTradeFeesFromPid = (pid) => {
    let tradingFee = 0
    const tradeFees = useSelector((state: State) => state.graph.tradingFees.find((f) => f.pid === pid))
    if (tradeFees !== undefined) {
        tradingFee = tradeFees?.tradingFee
    }
    return { tradingFee }
}

export const useTradeFees7Days = (pid) => {
    let tradingFees7Days = []
    const tradeFee = useSelector((state: State) => state.graph.tradingFees.find((f) => f.pid === pid))
    if (tradeFee !== undefined) {
        tradingFees7Days = tradeFee.tradingFee7day
    }
    return { tradingFees7Days }
}

export const useVolume24h = () => {
    const volume24hs = useSelector((state: State) => state.graph.volume24hs)
    const volumes = volume24hs.map((volume24h) => volume24h.volume24h)
    const initialValue = 0;
    const sumVolume24h = volumes.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        initialValue
    );
    return sumVolume24h / (10 ** 18)
}

