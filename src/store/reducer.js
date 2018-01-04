import { Map } from 'immutable'
import { combineReducers } from 'redux'


export const LODAPP_STORE_CLEAR_ALL = Symbol('LODAPP/STORE_CLEAR_ALL').toString()


let reducerMap = Map()

export function addReducer (name, reducer) {
  if (typeof name === 'string') {
    reducerMap = reducerMap.set(name, reducer)
  } else if (Map.isMap(name)) {
    // A bit wonky so we can support accepting a Map of reducers
    reducerMap = reducerMap.mergeDeep(name)
  }

  return reducerMap
}

export default () => {
  const appReducer = combineReducers(reducerMap.toJS())

  const rootReducer = (state, action) => {
    if (action.type === LODAPP_STORE_CLEAR_ALL) {
      // Reset the state! A new state to reset to can be specified.
      state = action.payload || {}
    }
    return appReducer(state, action)
  }

  return rootReducer
}
