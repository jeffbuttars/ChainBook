
import { List } from 'immutable'
import { createStore, applyMiddleware, compose } from 'redux'
import promiseMiddleware from 'redux-promise'
import thunkMiddleware from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'
import reducer, { addReducer } from './reducer'


export const APP_INIT_ACTION = Symbol('APP/INIT').toString()

export const history = createHistory()
let middleWares = List.of(thunkMiddleware, promiseMiddleware)

function addMiddleware (mw) {
  middleWares = middleWares.push(mw)
  return middleWares
}

export default function makeStore (initial = {}) {
  const composeEnhancers = (process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      serialize: true
    }) : compose

    const store = createStore(reducer(), initial, composeEnhancers(
      applyMiddleware(...middleWares.toJS())
    ))

  // Send our init action!
  store.dispatch({type: APP_INIT_ACTION})

  return store
}

export { addReducer, addMiddleware }
