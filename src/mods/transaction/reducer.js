import { handleActions } from 'redux-actions'
import { Map, List, fromJS } from 'immutable'
// import Web3 from 'web3'
import * as blkConsts from 'block/constants'

export default handleActions({
  [blkConsts.GET]: (state, action) => {
    // console.log('Trans reducer BLOCK/GET', action.payload)
    if (action.error) {
      console.error('Transaction reducer BLOCK/GET:', action.payload)
      return state
    }

    const block = fromJS(action.payload)
    const trans = block.get('transactions', List())

    if (trans.size > 0) {
      if (typeof trans.get(0) !== 'string') {
        // console.log('trans reducer BLOCK/GET processing trans objects...')
        return trans.reduce((p, v) => p.set(v.get('hash'), v), state)
      }
    }

    // console.log('trans reducer BLOCK/GET ignoring trans hashes')
    return state
  }
}, Map())
