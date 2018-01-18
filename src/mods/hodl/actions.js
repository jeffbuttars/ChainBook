import { createAction } from 'redux-actions'
import axios from 'axios'
import * as consts from './constants'

const API_BASE = 'https://min-api.cryptocompare.com/data'
const getDailyHistoryURL = (symbol, days, priceIn) =>
  `${API_BASE}/histoday?fsym=${symbol}&tsym=${priceIn}&limit=${days}`

export const getDailyHistory = createAction(
  consts.GET_DAILY_HISTORY,
  (symbol = 'ETH', days = 7, priceIn = 'USD') => {
    // Wrap the result in an extra promise so we can return the symbol
    // in the result since the API doesn't and we need the symbol in the
    // reducer.
    const prom = axios.get(getDailyHistoryURL(symbol, days, priceIn))
    return new Promise((resolve, reject) => {
      prom.then(
        result => resolve({symbol, result}),
        error => reject(error),
      )
    })
  }
)
