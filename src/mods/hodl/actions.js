import { createAction } from 'redux-actions'
import SocketIO from 'socket.io-client'
import axios from 'axios'
import * as consts from './constants'

// const tickerRefresh = process.env.REACT_APP_TICKER_REFRESH_MS ? parseInt(process.env.REACT_APP_TICKER_REFRESH_MS, 10) : null
const API_BASE_URL = 'https://min-api.cryptocompare.com/data'
const WS_BASE_URL = 'https://streamer.cryptocompare.com'

const getMinuteHistoryURL = (symbol, days, priceIn) =>
  `${API_BASE_URL}/histominute?fsym=${symbol}&tsym=${priceIn}&limit=${days}`
const getHourHistoryURL = (symbol, days, priceIn) =>
  `${API_BASE_URL}/histohour?fsym=${symbol}&tsym=${priceIn}&limit=${days}`
const getDailyHistoryURL = (symbol, days, priceIn) =>
  `${API_BASE_URL}/histoday?fsym=${symbol}&tsym=${priceIn}&limit=${days}`

const getPricePairURL = (from, to) =>
  `${API_BASE_URL}/price?fsym=${from}&tsyms=${to}&extraParmas=ChainBook`

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

// const _tickerTimerRef = createAction(consts.TICKER_TIMER_REF, timer => timer)

export const getPricePair = createAction(
  consts.GET_PRICE_PAIR,
  (fsym, to) => {
    const tsyms = Array.isArray(to) ? to.join(',') : to

    // Encapsulate the from symbol in the result
    return new Promise((resolve, reject) =>
      axios.get(getPricePairURL(fsym, tsyms))
        .then(
          result => resolve({result, fsym}),
          err => reject(err)
        )
    )
  }
)

export const startPricePairTicker = (pairs = [['ETH', 'USD']]) => (dispatch, getState) => {
  const state = getState()
  const _timer = state.hodl.get('_tickers_timer')

  if (_timer) {
      clearTimeout(_timer)
  }

  // if (tickerRefresh) {
  //   dispatch(_tickerTimerRef(
  //     setTimeout(dispatch, tickerRefresh, startPricePairTicker(pairs))
  //   ))
  // }

  // console.log('startPricePairTicker pairs', pairs, ...pairs)
  pairs.map(pair => dispatch(getPricePair(...pair)))
}

const _streamData = createAction(consts.DATA_SUBSCRIPTION_DATA)
const _streamSocket = createAction(consts.START_DATA_SUBSCRIPTION)

export const startDataSubscription = (queries) => (dispatch, getState) => {
  console.log('startDataSubscription')

  // Get or create the socket
  const socket = getState().hodl.getIn(['stream', '_socket']) || new SocketIO(WS_BASE_URL)
  console.log('WS FROM STATE', socket)

  // Set the socket in the store
  dispatch(_streamSocket(socket))

  // Build the subscription strings from the query objects
  queries = queries || [
    // {subId: consts.STREAM_SUB_TRADE, exchange: 'Coinbase', fsym: 'ETH', tsym: 'USD'},
    {subId: consts.STREAM_SUB_CURRENT, exchange: 'Coinbase', fsym: 'ETH', tsym: 'USD'}
    // {subId: consts.STREAM_SUB_CURRENTAGG, exchange: 'Coinbase', fsym: 'ETH', tsym: 'USD'}
  ]
  const subs = queries.reduce((p, v) => p.concat(`${v.subId}~${v.exchange}~${v.fsym}~${v.tsym}`) ,[])

  console.log('SUBSCRIBE', 'SubAdd', {subs})
  // Subscribe !
  socket.emit('SubAdd', {subs})

  console.log('SETTING WS CALLBACK', socket)
  // Dispatch the data as it comes in
  socket.on('m', msg => dispatch(_streamData(msg)))
}

export const stopDataSubscription = createAction(consts.STOP_DATA_SUBSCRIPTION)
