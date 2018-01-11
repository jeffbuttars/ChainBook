import { handleActions } from 'redux-actions'
import { Map, fromJS } from 'immutable'
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

    const block = action.payload

    return state.setIn(['byNumber', `${block.number}`], fromJS(block))
  }
}, defaultBlock)
