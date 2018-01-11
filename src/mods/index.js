import web3Reducer from './web3/reducer'
import blockReducer from './block/reducer'

const reducers = {
  'web3': web3Reducer,
  'block': blockReducer
}

export { reducers }
