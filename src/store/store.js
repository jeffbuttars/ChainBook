
import { List } from 'immutable'
import { createStore, applyMiddleware, compose } from 'redux'
import promiseMiddleware from 'redux-promise'
import thunkMiddleware from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'
import reducer, { addReducer } from './reducer'


export const history = createHistory()
let middleWares = List.of(thunkMiddleware, promiseMiddleware)

function addMiddleware (mw) {
  middleWares = middleWares.push(mw)
  return middleWares
}

export default function makeStore (initial = {}) {
  let enhancers = applyMiddleware(...middleWares.toJS())

  if (process.env.NODE_ENV !== 'production') {
    // Add the chrome redux dev tools middleware fun
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    enhancers = composeEnhancers(enhancers)
  }

  const red = reducer()
  const store = createStore(red, initial, enhancers)

  return store
}

export { addReducer, addMiddleware }
