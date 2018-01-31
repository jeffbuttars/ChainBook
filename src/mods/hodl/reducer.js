import { handleActions } from 'redux-actions'
import { Map, OrderedMap, List } from 'immutable'
import CCC from './ccc-streamer-utilities'
import * as consts from './constants'

const fieldMap = {
  'FROMSYMBOL': 'fsym',
  'TOSYMBOL': 'tsym',
  'LASTUPDATE': 'lastUpdate',
  'LASTVOLUME': 'lastVolume',
  'LASTVOLUMETO': 'lastVolumeTo',
  'LASTTRADEID': 'lastTradedId',
  'VOLUMEHOUR': 'volumeHour',
  'VOLUMEHOURTO': 'volumeHourTo',
  'VOLUME24HOUR': 'volume24Hour',
  'VOLUME24HOURTO': 'volume24HourTo',
  'OPENHOUR': 'openHour',
  'HIGHHOUR': 'highHour',
  'LOWHOUR': 'lowHour',
  'OPEN24HOUR': 'open24Hour',
  'HIGH24HOUR': 'high24Hour',
  'LOW24HOUR': 'low24Hour',
  'LASTMARKET': 'lastMarket'
}

const wsObjToImm = (obj) => Object.keys(obj).reduce(
  (p, k) => p.set(fieldMap[k] || k.toLowerCase(), obj[k])
  ,Map()
)

const unPacker = {
  [CCC.STATIC.TYPE.TRADE]: (msg) => {
    return wsObjToImm(CCC.TRADE.unpack.call(CCC.TRADE, msg))
  },
  [CCC.STATIC.TYPE.CURRENT]: (msg) => {
    return wsObjToImm(CCC.CURRENT.unpack.call(CCC.CURRENT, msg))
  },
  [CCC.STATIC.TYPE.CURRENTAGG]: (msg) => {
    return wsObjToImm(CCC.CURRENT.unpack.call(CCC.CURRENT, msg))
  }
}

const defaults = Map({
  'ETH': Map({
    byDay: OrderedMap()
  }),
  'stream': Map({
    '_socket': null
    // market: {'fsym:tsym': { high24hour, open24hour, low24hour, data: List(Map())}}
  })
})

export default handleActions({
  [consts.START_DATA_SUBSCRIPTION]: (state, action) => {
    return state.setIn(['stream', '_socket'], action.payload)
  },
  [consts.STOP_DATA_SUBSCRIPTION]: (state, action) => {
    const socket = state.getIn(['stream', '_socket'])

    if (socket) {
      socket.close()
    }

    return state.removeIn(['stream', '_socket'])
  },
  [consts.DATA_SUBSCRIPTION_DATA]: (state, action) => {
    // Process the market steam data as it comes in
    const msg = action.payload
    const [mType, exchange, fsym, tsym] = msg.split('~')
    const exc = exchange.toLowerCase()
    const pair = `${fsym}:${tsym}`

    if ((mType !== (consts.STREAM_SUB_CURRENT + '')) || !unPacker[mType]) {
      return state
    }

    let unpacked = unPacker[mType](msg)

    // Get the history object for this market/pair combo,
    // Update any top level vars if they are in the new data
    // and carry over the previous price if there is no price update.
    // Also calculate the 24 hour change in tsym and percentage
    const history = state.getIn(['stream', exc, pair], Map())

    // If this message has no price, use the price from the last message
    // this scenario happens if the price hasn't changed since the last
    // update
    if (!unpacked.get('price')) {
      // console.log('MISSING PRICE!!!! reusing price', history.get('data', List()).get(0, Map()).get('price', 0))
      unpacked = unpacked.set('price', history.get('data', List()).get(0, Map()).get('price', 0))
    }

    const nextHistory = history
      .set('data', history.get('data', List()).unshift(unpacked).slice(0, consts.STREAM_HISTORY_MAX))
      .set('high24Hour', unpacked.get('high24Hour') || history.get('high24Hour'))
      .set('low24Hour', unpacked.get('low24Hour', history.get('low24Hour')))
      .set('open24Hour', unpacked.get('open24Hour', history.get('open24Hour')))
      .set('volume24Hour', unpacked.get('volume24Hour', history.get('volume24Hour')))
      .set('volume24HourTo', unpacked.get('volume24HourTo', history.get('volume24HourTo')))

    // Calc some 24 hour data and add it in
    const price = unpacked.get('price', 1.0)
    const open24 = nextHistory.get('open24Hour', 1.0)

    return state.setIn(
      ['stream', exc, pair],
      nextHistory
        .set('change24Hour', price - open24)
        .set('change24HourPct', ((price - open24) / open24) * 100)
    )
  },
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
