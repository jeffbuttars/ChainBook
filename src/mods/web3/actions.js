import { createAction } from 'redux-actions'
import * as consts from './constants'

export const getGasPrice = createAction(
  consts.GET_GAS_PRICE,
  (web3) => {
    console.log('GET GS', web3.eth.getGasPrice)
    // console.log('GET GS RES', web3.eth.getGasPrice())
    return web3.eth.getGasPrice()
  }
)
