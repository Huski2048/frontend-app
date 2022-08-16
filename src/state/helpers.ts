import chunk from "lodash/chunk"
import { multicallv2 } from "utils/multicall"

export const fetchDatas = async (
    abi: any[],
    calls: any[],
    length: number
): Promise<any[]> => {
    const chunkSize = calls.flat().length / length
    const aggregatedCalls = calls
        .filter((call) => call[0] !== null && call[1] !== null)
        .flat()
    const multiCallResult = await multicallv2(abi, aggregatedCalls)
    const chunkedResultRaw = chunk(multiCallResult, chunkSize)
    let chunkedResultCounter = 0
    return calls.map((call) => {
        if (call[0] === null && call[1] === null) {
            return [null, null]
        }
        const data = chunkedResultRaw[chunkedResultCounter]
        chunkedResultCounter++
        return data
    })
}
