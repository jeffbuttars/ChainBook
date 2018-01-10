import { createAction } from 'redux-actions'
import * as consts from './constants'

export const getGasPrice = createAction(
  consts.GET_GAS_PRICE,
  (web3) => new Promise((resolve, reject) => {
      web3.eth.getGasPrice((error, result) => {
        if (error) {
            reject(error)
            return
        }

        resolve(result)
      })
  })
)
