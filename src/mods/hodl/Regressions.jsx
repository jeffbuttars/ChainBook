import React from 'react'
import { List } from 'immutable'
import dl from 'datalib'
import { VictoryLine } from 'victory'

/**
 * Build regression lines for candle stick data.
*/

// For a given set of x and y inputs return the start
// and end points of the input regression line, trimming
// the low point of the regression to start at the low point
// of the input data

// Y = AX + B : A => slope, B => intercept
// For a given linear regression and X find Y
const linRegFunc = (lin, x) => (lin.slope * x) + lin.intercept
// For a given linear regression and Y find X
const linRegFuncForY = (lin, y) => {
  console.log('linRegFuncForY', lin, y, `${y} - ${lin.intercept} / ${lin.slope}`)
  return (y - lin.intercept) / lin.slope
}

const linearRegression = (x, y, min) => {
  console.log('linearRegression', min)
  const result = dl.linearRegression(x, y)

  // Find the matching X for the min Y and truncate the regression line to look
  // a bit cleaner
  const minX = linRegFuncForY(result, min)

  return [
    {'x': minX, 'y': linRegFunc(result, minX)},
    {'x': x[x.length - 1], 'y': linRegFunc(result, x[x.length - 1])}
  ]
}

const calcRegressions = (data) => {
  const dataShape = {
      combined: {x: [], y: []},
      low: {x: [], y: []},
      high: {x: [], y: []},
      open: {x: [], y: []},
      close: {x: [], y: []}
  }

  if (data.size < 1) {
    return dataShape
  }

  const points = data.reduce((p, v, k) => {
    p.combined.x.push(k)
    p.combined.x.push(k)
    p.combined.x.push(k)
    p.combined.x.push(k)
    p.combined.y.push(v.get('high'))
    p.combined.y.push(v.get('low'))
    p.combined.y.push(v.get('open'))
    p.combined.y.push(v.get('close'))

    p.low.x.push(k)
    p.high.x.push(k)
    p.open.x.push(k)
    p.close.x.push(k)

    p.low.y.push(v.get('low'))
    p.high.y.push(v.get('high'))
    p.open.y.push(v.get('open'))
    p.close.y.push(v.get('close'))

    return p
  }, dataShape)

  // Find the min Y value
  const ys = List(points.combined.y)
  const min = ys.min()

  return {
    combined: linearRegression(points.combined.x, points.combined.y, min),
    low: linearRegression(points.low.x, points.low.y, min),
    high: linearRegression(points.high.x, points.high.y, min),
    close: linearRegression(points.close.x, points.close.y, min),
    open: linearRegression(points.open.x, points.open.y, min)
  }
}

export default ({data, combined, close, open, low, high, ...rest}) => {
  console.log('Regressions', data, combined, close, open, low, high)
  if (!(combined || close || open || low || high)) {
    return <div />
  }

  const regPoints = calcRegressions(data)
  console.log('Regressions points', regPoints)

  return (
    <React.Fragment>
      {combined &&
        <VictoryLine
          data={regPoints.combined}
          {...rest}
          style={{ data: { strokeWidth: 0.5, strokeOpacity: 0.6, stroke: '#3333AA'} }}
        />
      }
      {close &&
        <VictoryLine
          data={regPoints.close}
          {...rest}
          style={{ data: { strokeWidth: 0.5, strokeOpacity: 0.6, stroke: '#2222BB'} }}
        />
      }
      {open &&
        <VictoryLine
          data={regPoints.open}
          {...rest}
          style={{ data: { strokeWidth: 0.5, strokeOpacity: 0.6, stroke: '#2222FF'} }}
        />
      }
      {low &&
        <VictoryLine
          data={regPoints.low}
          {...rest}
          style={{ data: { strokeWidth: 0.5, strokeOpacity: 0.6, stroke: '#8822FF'} }}
        />
      }
      {high &&
        <VictoryLine
          data={regPoints.high}
          {...rest}
          style={{ data: { strokeWidth: 0.5, strokeOpacity: 0.6, stroke: '#2288FF'} }}

        />
      }
    </React.Fragment>
  )
}