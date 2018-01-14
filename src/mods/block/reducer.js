import { handleActions } from 'redux-actions'
import { Map, List, fromJS } from 'immutable'
// import Web3 from 'web3'
import * as consts from './constants'

const defaultBlock = Map({
  byNumber: Map()
})


// const web3Local = new Web3()

export default handleActions({
  [consts.GET]: (state, action) => {
    console.log('GET', action.payload)

    if (action.error) {
      console.error('GET:', action.payload)
      return state
    }

    const number = action.payload.number
    let block = fromJS(action.payload)
    const trans = block.get('transactions', List())

    if (trans.size > 0) {
      if (typeof trans.get(0) !== 'string') {
        console.log('TRANS OBJECT FOUND', trans.toJS())
        block = block.set('transactions', trans.map(obj => obj.get('hash')))
      }
    }

    return state.setIn(['byNumber', `${number}`], block)
  }
}, defaultBlock)
