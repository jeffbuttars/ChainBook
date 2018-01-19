import { handleActions } from 'redux-actions'
import { Map, OrderedMap } from 'immutable'
import * as consts from './constants'

const defaults = Map({
  'ETH': Map({
    byDay: OrderedMap()
  })
})

export default handleActions({
  [consts.GET_DAILY_HISTORY]: (state, action) => {
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
    // Merge and Order the results by time, earliest to recent
    const symData = state.get(symbol, Map())

    // //////////////////////////////
    // Reverse for chart testing
    // let idx = Data.length - 1
    // const data = Data.reduce((p, v) => {
    //   const otherTime = Data[idx].time
    //   const d = Object.assign({}, v)
    //   d.time = otherTime * 1000
    //   idx -= 1
    //   return p.set(d.time, Map(d))
    // }, OrderedMap())
    // console.log('REVERSED:', data.toJS())
    // //////////////////////////////

    // the incoming timestamps are number of seconds since 1970, so we need to
    // convert them to milliseconds.
    const data = Data.reduce(
      (p, v) => {
        v.time = v.time * 1000
        return p.set(v.time, Map(v))
      }, OrderedMap())

    return state.set(symbol, symData.set('byDay', data))
  }
}, defaults)
