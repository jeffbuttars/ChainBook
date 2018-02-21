import { handleActions } from 'redux-actions'
import { Map } from 'immutable'
import Web3 from 'web3'
import {APP_INIT_ACTION} from 'store/store'
import * as consts from './constants'

const defaultWeb3 = Map({
  'web3': null,
  'gasPrice': Map({
    wei: '',
    eth: ''
  }),
  // 'coinbase': '',
  'blockNumber': '',
  'hashRate': '',
  // 'work': '',
  '_globalInfoTimer': null
})


const web3Local = new Web3()

const simpleCheckSet = (state, action, name) => {
  if (action.error) {
    console.error(`${action.type} ERROR:`, action.payload)
    return state
  }

  return state.set(name, action.payload)
}

export default handleActions({
  [APP_INIT_ACTION]: (state, action) => {
    const web3 = new Web3(process.env.REACT_APP_ETH_NODE_ADDR)
    // console.log(`${APP_INIT_ACTION}, creating Web3 instance for ${process.env.REACT_APP_ETH_NODE_ADDR} : ${web3}`)
    return state.set('web3', web3)
  },
  [consts.GLOBAL_TIMER_REF]: (state, action) => state.set('_globalTimerRef', action.payload || null),
  [consts.GET_COINBASE]: (state, action) => simpleCheckSet(state, action, 'coinbase'),
  [consts.GET_BLOCK_NUMBER]: (state, action) => simpleCheckSet(state, action, 'blockNumber'),
  [consts.GET_HASHRATE]: (state, action) => simpleCheckSet(state, action, 'hashRate'),
  [consts.GET_GAS_PRICE]: (state, action) => {
    const gasPrice = action.payload

    if (action.error) {
      console.error('GET_GAS_PRICE:', action.payload)
      return state
    }

    return state.set('gasPrice', Map({wei: gasPrice, eth: web3Local.utils.fromWei(gasPrice)}))
  }
},
  defaultWeb3
)
