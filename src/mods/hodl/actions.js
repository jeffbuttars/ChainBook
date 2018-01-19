import { createAction } from 'redux-actions'
import axios from 'axios'
import * as consts from './constants'

const API_BASE = 'https://min-api.cryptocompare.com/data'

const getMinuteHistoryURL = (symbol, days, priceIn) =>
  `${API_BASE}/histominute?fsym=${symbol}&tsym=${priceIn}&limit=${days}`
const getHourHistoryURL = (symbol, days, priceIn) =>
  `${API_BASE}/histohour?fsym=${symbol}&tsym=${priceIn}&limit=${days}`
const getDailyHistoryURL = (symbol, days, priceIn) =>
  `${API_BASE}/histoday?fsym=${symbol}&tsym=${priceIn}&limit=${days}`

const intervalMap = {
  '1Y': (symbol, priceIn) => getDailyHistoryURL(symbol, 365, priceIn), // One Year
  '6M': (symbol, priceIn) => getDailyHistoryURL(symbol, 183, priceIn), // 6 Months
  '3M': (symbol, priceIn) => getDailyHistoryURL(symbol, 91, priceIn), // 3 Months
  '1M': (symbol, priceIn) => getDailyHistoryURL(symbol, 31, priceIn), // 1 Month
  '1w': (symbol, priceIn) => getHourHistoryURL(symbol, 7 * 24, priceIn), // 1 Week
  '1d': (symbol, priceIn) => getHourHistoryURL(symbol, 24, priceIn), // 1 Day
  '12h': (symbol, priceIn) => getHourHistoryURL(symbol, 12, priceIn), // 12 Hours
  '6h': (symbol, priceIn) => getMinuteHistoryURL(symbol, 6 * 60, priceIn), // 6 Hours
  '1h': (symbol, priceIn) => getMinuteHistoryURL(symbol, 60, priceIn), // 1 Hour
  '15m': (symbol, priceIn) => getMinuteHistoryURL(symbol, 15, priceIn) // 15 Minutes
}

export const getDailyHistory = createAction(
  consts.GET_DAILY_HISTORY,
  (symbol = 'ETH', interval = '1d', priceIn = 'USD') => {
    // Wrap the result in an extra promise so we can return the symbol
    // in the result since the API doesn't and we need the symbol in the
    // reducer.
    // const prom = axios.get(getDailyHistoryURL(symbol, 1, priceIn))
    if (!intervalMap[interval]) {
      console.warn('Invalid interval:', interval)
      interval = '1d'
    }

    const prom = axios.get(intervalMap[interval](symbol, priceIn))
    return new Promise((resolve, reject) => {
      prom.then(
        result => resolve({symbol, result, interval, priceIn}),
        error => reject(error),
      )
    })
  }
)
