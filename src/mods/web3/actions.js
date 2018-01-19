import { createAction } from 'redux-actions'
import * as consts from './constants'

const _globalTimerRef = createAction(consts.GLOBAL_TIMER_REF, timer => timer)

export const getGasPrice = createAction(consts.GET_GAS_PRICE, w3 => w3.eth.getGasPrice())
export const getHashrate = createAction(consts.GET_HASHRATE, w3 => w3.eth.getHashrate())
export const getBlockNumber = createAction(consts.GET_BLOCK_NUMBER, w3 => w3.eth.getBlockNumber())
// const getCoinbase = createAction(consts.GET_COINBASE, w3 => w3.eth.getCoinbase())
// const getWork = createAction(consts.GET_WORK, w3 => w3.eth.getWork())

export const getGlobalInfo = () => (dispatch, getState) => {
  // build a thunk for handling the timeout.
  const state = getState()
  const w3 = state.web3.get('web3')
  const _timer = state.web3.getIn(['gasPrice', '_timer'])

  if (_timer) {
      clearTimeout(_timer)
  }

  if (process.env.REACT_APP_GLOBAL_REFRESH_MS) {
    dispatch(_globalTimerRef(
      setTimeout(() => dispatch(getGlobalInfo()), parseInt(process.env.REACT_APP_GLOBAL_REFRESH_MS, 10))
    ))
  }

  dispatch(getGasPrice(w3))
  dispatch(getBlockNumber(w3))
  // dispatch(getCoinbase(w3))
  dispatch(getHashrate(w3))
  // dispatch(getWork(w3))
}
