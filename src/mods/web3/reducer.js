import { handleActions } from 'redux-actions'
import { Map } from 'immutable'
import Web3 from 'web3'
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
  '@@INIT': (state, action) => state.set('web3', new Web3(process.env.REACT_APP_ETH_NODE_ADDR)),
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

    // if (gasPrice === '0') {
    //   return state.set('gasPrice', Map({wei: '', eth: ''}))
    // }
    return state.set('gasPrice', Map({wei: gasPrice, eth: web3Local.utils.fromWei(gasPrice)}))
  }
},
  defaultWeb3
)
