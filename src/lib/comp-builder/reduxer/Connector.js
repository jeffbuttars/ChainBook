import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {getAttr} from 'comp-builder'

const isObj = obj => typeof obj === 'object' && !Array.isArray(obj)

const stateFromPath = (state, path) => {
  // Return a piece of state defined by it's dot deliminited path
  // path: 'path.to.piece.of.state'
  // Expects that immutable objects are used within the path given
  console.log('stateFromPath', state, path)
  const parts = path.split('.')
  const root = state[parts[0]]
  const tail = parts.slice(1)

  if (tail.length === 0) {
    return root
  }

  return root.getIn(tail)
}

// 'Decorator' to catch common cases
const funcOrObj = func => {
  return (fobj, ...args) => {
    if (typeof fobj === 'function') {
      return fobj
    }

    if (!isObj(fobj)) {
      return null
    }

    return func(fobj)
  }
}

const getActionFunc = funcOrObj(actions => {
  // For a given `actions` object from `componentState` return a function
  // that will be used as `mapDispatchToProps` to props in `connect()`
  return d => ({
    actions: Object.keys(actions).reduce(
      (p, k) => Object.assign(p, {[k]: bindActionCreators(actions[k], d)}),
      {}
    )
  })
})

const getStateFunc = funcOrObj(state => {
  // For a given `state` object from `componentState` return a function
  // that will be used as `mapStateToProps` to props in `connect()`
  // The state object can come in two flavors:
  // 1. A function that is traditional style of mapStateToProps
  // 2. An object whos members are string paths or fuctions.
  //   A. String paths will be used to do a simple lookup for the store value
  //   B. Functions will be called with the store as the parameter and the result will be used

  // Pre-build an object with a converstion function for each key
  const stateMap = Object.keys(state).reduce((p, k) => {
    // if the object member is function, treat like a mapStateToProps for that key.
    // Otherwise, if it's a string, use stateFromPath
    if (typeof state[k] === 'function') {
      return Object.assign(p, {[k]: state[k]})
    }

    if (typeof state[k] === 'string') {
      // Allow for simple key base paths
      if (!state[k] || state[k] === '') {
        return Object.assign(p, {[k]: s => stateFromPath(s, `${k}`)})
      }

      return Object.assign(p, {[k]: s => stateFromPath(s, state[k])})
    }

    return p
  }, {})

  return (...args) =>
    Object.keys(stateMap).reduce(
      (p, k) => Object.assign(p, {[k]: stateMap[k](...args)}),
      {}
    )
})

const Connector = (Comp, {getAttr}) => {
  const con = getAttr(Comp, 'componentConnect')

  // // Only deal with the connect property if it's an object/dict.
  if (!con || !isObj(con)) {
    return connect()(Comp)
  }

  const mapStateToProps = getStateFunc(con.state)

  const mapDispatchToProps = getActionFunc(con.actions)

  return connect(mapStateToProps, mapDispatchToProps)(Comp)
}

const mergeCompConnector = (Comp, src) => {
  const dest = getAttr(Comp, 'componentConnect') || {}
  const {state, actions, ...rest} = src

  return {
    state: Object.assign({}, dest.state, state),
    actions: Object.assign({}, dest.actions, actions),
    ...Object.assign({}, rest)
  }
}

export {mergeCompConnector}

export default Connector
