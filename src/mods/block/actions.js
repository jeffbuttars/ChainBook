import { createAction } from 'redux-actions'
import * as consts from './constants'

export const get = createAction(
  consts.GET,
  (w3, blockNumber, full = false) => w3.eth.getBlock(blockNumber, full)
)
