
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
  // let enhancers = applyMiddleware(...middleWares.toJS())
  const composeEnhancers = (process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      serialize: true
    }) : compose

  // if (process.env.NODE_ENV === 'development') {
  //   // Add the chrome redux dev tools middleware fun
  //   console.log('Adding Redux Devtools Middleware')
  //   const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({serialize: true}) || compose
  //   enhancers = composeEnhancers(enhancers)
  // }

  // enhancers = composer(enhancers)
    const store = createStore(reducer(), initial, composeEnhancers(
      applyMiddleware(...middleWares.toJS())
    ))

  // console.log('enhancers:', enhancers)
  // console.table(enhancers)

  // console.log('STORE:', store)
  // console.table(store)

  return store
}

export { addReducer, addMiddleware }
