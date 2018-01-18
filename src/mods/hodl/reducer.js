import { handleActions } from 'redux-actions'
import { Map, OrderedMap, fromJS } from 'immutable'
import * as consts from './constants'

const defaults = Map({
  'ETH': Map({
    byDay: OrderedMap()
  })
})

export default handleActions({
  [consts.GET_DAILY_HISTORY]: (state, action) => {
    console.log('HODL/GET_DAILY_HISTORY', action.payload)

    if (action.error) {
      console.error('GET:', action.payload)
      return state
    }
    // Result has the shape:
    // {
    //   "Aggregated": false,
    //   "ConversionType": {
    //     "conversionSymbol": "",
    //     "type": "direct"
    //   },
    //   "Data": [
    //     {
    //       "close": 1139.32,
    //       "high": 1333.92,
    //       "low": 1100.85,
    //       "open": 1248.96,
    //       "time": 1515628800,
    //       "volumefrom": 1056985.76,
    //       "volumeto": 1270849838.43
    //     },
    //     ...
    //   ],
    //   "FirstValueInArray": true,
    //   "Response": "Success",
    //   "TimeFrom": 1515628800,
    //   "TimeTo": 1516233600,
    //   "Type": 100
    // }

    const {symbol, result: { data: { Data } }} = action.payload
    // const {symbol, result} = action.payload

    console.log('HODL DAILIES symbol', symbol)
    console.log('HODL DAILIES Data', Data)

    // Merge and Order the results by time, earliest to recent
    const symData = state.get(symbol, Map())
    const byDay = symData.get('byDay', OrderedMap())

    const merged = Data.reduce((p, v) => p.set(v.time, v), byDay)
    const sorted = merged.sort((a, b) => {
      if (a.time < b.time) {
        return -1
      }

      if (a.time > b.time) {
        return 1
      }

      return 0
    })

    return state.set(symbol, symData.set('byDay', sorted))
  }
}, defaults)
