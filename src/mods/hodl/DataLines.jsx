import React from 'react'
import { VictoryLine } from 'victory'


const calcLines = (data) => {
  const dataShape = {
      low: [],
      high: [],
      open: [],
      close: []
  }

  if (data.size < 1) {
    return dataShape
  }

  return data.reduce((p, v, k) => {
    p.high.push({x: k, y: v.get('high')})
    p.low.push({x: k, y: v.get('low')})
    p.open.push({x: k, y: v.get('open')})
    p.close.push({x: k, y: v.get('close')})

    return p
  }, dataShape)
}

export default ({data, close, open, low, high, ...rest}) => {
  if (!(close || open || low || high)) {
    return <div />
  }

  const points = calcLines(data)
  console.log('DataLines points', points)

  return (
    <React.Fragment>
      {close &&
        <VictoryLine
          data={points.close}
          interpolation='natural'
          {...rest}
          style={{ data: { strokeWidth: 0.5, strokeOpacity: 0.6, stroke: '#222222'} }}
        />
      }
      {open &&
        <VictoryLine
          data={points.open}
          interpolation='natural'
          {...rest}
          style={{ data: { strokeWidth: 0.5, strokeOpacity: 0.6, stroke: '#FFA500'} }}
        />
      }
      {low &&
        <VictoryLine
          data={points.low}
          interpolation='natural'
          {...rest}
          style={{ data: { strokeWidth: 0.5, strokeOpacity: 0.6, stroke: '#FF3333'} }}
        />
      }
      {high &&
        <VictoryLine
          data={points.high}
          interpolation='natural'
          {...rest}
          style={{ data: { strokeWidth: 0.5, strokeOpacity: 0.6, stroke: '#33CC33'} }}
        />
      }
    </React.Fragment>
  )
}
