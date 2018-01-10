import { handleActions } from 'redux-actions'
import { Map } from 'immutable'
import Web3 from 'web3'
import * as consts from './constants'

const defaultWeb3 = Map({
  'web3': null,
  'gasPrice': ''
})


export default handleActions({
  '@@INIT': (state, action) => {
    console.log('WEB#', Web3)
    const web3 = new Web3('http://localhost:8545')

    return state.set('web3', web3)
  },
  [consts.GET_GAS_PRICE]: (state, action) => {
      const gasPrice = action.payload

      console.log('GAS PRICE:', gasPrice)
      return state.set('gasPrice', gasPrice)
  }
},
defaultWeb3
)
