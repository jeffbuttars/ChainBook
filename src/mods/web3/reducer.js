import { handleActions } from 'redux-actions'
import { Map } from 'immutable'
import Web3 from 'web3'
import * as consts from './constants'

const defaultWeb3 = Map({
  'web3': null,
  'gasPrice': ''
})


const web3Local = new Web3()


export default handleActions({
  '@@INIT': (state, action) => {
    console.log('WEB#', process.env.REACT_APP_ETH_NODE_ADDR)
    const web3 = new Web3(process.env.REACT_APP_ETH_NODE_ADDR)

    return state.set('web3', web3)
  },
  [consts.GET_GAS_PRICE]: (state, action) => {
      console.log('GAS PRICE ERROR:', action.error)
      const gasPrice = action.payload

      console.log('GAS PRICE:', gasPrice, web3Local.utils.fromWei(gasPrice))
      return state.set('gasPrice', gasPrice)
  }
},
defaultWeb3
)
