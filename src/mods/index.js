import web3Reducer from './web3/reducer'
import blockReducer from './block/reducer'
import transReducer from './transaction/reducer'

const reducers = {
  'web3': web3Reducer,
  'block': blockReducer,
  'transaction': transReducer
}

export { reducers }
