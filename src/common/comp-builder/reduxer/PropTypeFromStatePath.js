import PropTypes from 'prop-types'

/*
 * Derive propTypes from the componentConnect state paths
 * and add the propTypes object.
*/
const PropTypeFromStatePath = (Comp, {getAttr, applyAttr, getSpec}) => {
  const con = getAttr(Comp, 'componentConnect')
  if (!con || !con.state || typeof con === 'function') {
    return Comp
  }

  const state = con.state
  const localSpec = {
    propTypes: {...(getAttr(Comp, 'propTypes') || {})},
    connect: {...(con || {})}
  }

  // Process state paths that have a propType key on the end of them
  const stProps = Object.keys(state).reduce(
    (p, k) => {
      if (typeof state[k] !== 'string') {
        p.state = Object.assign(p.state, {[k]: state[k]})
        return p
      }

      const statePath = state[k]
      const parts = statePath.split(':', -1)

      p.state = Object.assign(p.state, {[k]: parts[0]})
      if (parts.length === 1) {
        // no proptype given
        return p
      }

      if (PropTypes[parts[1]]) {
        p.propTypes = Object.assign(p.propTypes, {[k]: PropTypes[parts[1]]})
        return p
      }

      throw Error(`Invalid PropType given in state path string: ${parts[1]}`)
    },
    {state: {}, propTypes: {}}
  )

  if (localSpec.connect.actions) {
    stProps.propTypes.actions = PropTypes.object
  }

  localSpec.connect.state = stProps.state
  localSpec.propTypes = Object.assign(localSpec.propTypes, stProps.propTypes)

  // The class name shows up in the console/debugger, so make it descriptive
  applyAttr(Comp, {
    propTypes: localSpec.propTypes,
    componentConnect: localSpec.connect
  })

  return Comp
}

export default PropTypeFromStatePath
