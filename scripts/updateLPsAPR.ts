import fs from 'fs'
import { request, gql } from 'graphql-request'
import BigNumber from 'bignumber.js'
import { ChainId } from '@pancakeswap/sdk'
import chunk from 'lodash/chunk'
import { sub, getUnixTime } from 'date-fns'


const getWeekAgoTimestamp = () => {
  const weekAgo = sub(new Date(), { weeks: 1 })
  return getUnixTime(weekAgo)
}



