import { createAction } from 'redux-actions'
import * as consts from './constants'

const _getGasPrice = createAction(
  consts.GET_GAS_PRICE,
  (w3, timer) => new Promise(
    (resolve, reject) => {
        const prom = w3.eth.getGasPrice()
        prom.then(
          (gasPrice) => resolve({gasPrice, timer}),
          (error) => reject({error, timer})
        )
      }
    )
  )

export const getGasPrice = () => (dispatch, getState) => {
  // build a thunk for handling the timeout.
  const state = getState()
  const w3 = state.web3.get('web3')
  const _timer = state.web3.getIn(['gasPrice', '_timer'])

  if (_timer) {
      clearTimeout(_timer)
  }

  const timer = setTimeout(() => dispatch(getGasPrice()), 10000)

  // Dispatch the action that does the actual call
  dispatch(_getGasPrice(w3, timer))
}
