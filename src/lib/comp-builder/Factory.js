const compSpecKey = '__CompBuilderSpecAttributes__'
const compChainKey = '__CompBuilderComposerChain__'

/*
 * The `getSpec`, `getAttr` and `applyAttr` functions are used to get and manipulate
 * the spec mutations across the component builder chain without mutating the components in
 * a negative way.
 * Any changes to a components attributes that should persist across calls to builders and
 * be mutable by later calls _must_ use these 3 functions.
*/
/*
 * retreive a Components full spec
 */
export const getSpec = Comp => Comp[compSpecKey] || {}

/*
 * Get a spec value and/or component attribute by key name from a Component
 */
export const getAttr = (Comp, key) => {
  const spec = getSpec(Comp)
  const res = spec[key] || Comp[key]
  return res
}

/*
 * Apply an attribute object to a Component. This will _only_ mutate the spec
 * used by the build chain
 */
export const applyAttr = (Comp, attr) => {
  const nextAttrs = Object.assign({}, getSpec(Comp), attr)
  Comp[compSpecKey] = nextAttrs

  return Comp
}

/* Overlay the spec of one component onto another. Use this when
 * wrapping a component and applying the wrapped spec to the other.
 */
export const overlay = (Dest, Src) => applyAttr(Dest, getSpec(Src))

/*
 * Create a high order Component from a list of builders.
 * The builders will be called in reverse order of the argument
 * order. So the last builder will be called first and the first argument
 * will be called last. `Factory(3, 2, 1)`.
 *
 * The first builder will be called with component to be wrapped and each
 * subsequent builder will be called with the previous builders result.
 */
export default (...builders) => {
  // Look for builders that are already composed, if we find
  // them, use their component chain in their place. This allows for
  // easy composition with already composed high order components
  builders = builders.reduce((p, b) => {
    if (!b) {
      throw Error(
        'Invalid builder used in component composer. ' +
          'You probably used an undefined builder. ' +
          'Any builder that has a falsey value will cause this exception.'
      )
    }

    return Array.isArray(b[compChainKey])
      ? p.concat(b[compChainKey])
      : p.concat(b)
  }, [])

  // Create the builder composer function. Each builder will be passed an object
  // containing helper functions.
  const BComp = Comp => {
    // The originally wrapped components attributes can become inaccessible after being
    // wrapped by a HOC, so we wrap getAttr with the original component
    // and defer to it if an attribute is not found by getAttr on the called component or
    // in the component spec
    const deepGetAttr = (c, k) => {
      const res = getAttr(c, k)
      return res === undefined ? getAttr(Comp, k) : res
    }

    return builders.reduce(
      (prev, builder) =>
        builder(prev, {getAttr: deepGetAttr, applyAttr, getSpec, overlay}),
      Comp
    )
  }

  // Record the builder chain used to build this function. We use this
  // to make this function composable with other builders in an expected
  // way.
  BComp[compChainKey] = builders

  return BComp
}
