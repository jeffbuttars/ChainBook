import React from 'react'
import { VictoryLine } from 'victory'

export const dataLineColors = {
  close: {color: '#222222', backgroundColor: '#EEE'},
  open: {color: '#FFA500', backgroundColor: '#EEE'},
  low: {color: '#FF3333', backgroundColor: '#EEE'},
  high: {color: '#33CC33', backgroundColor: '#EEE'}
}

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

const lineStyle = (line) => ({
  data: {
    strokeWidth: 0.5, strokeOpacity: 0.6, stroke: dataLineColors[line].color
  }
})

export default ({data, close, open, low, high, ...rest}) => {
  if (!(close || open || low || high)) {
    return <div />
  }

  const points = calcLines(data)

  return (
    <React.Fragment>
      {close &&
        <VictoryLine
          data={points.close}
          interpolation='monotoneX'
          {...rest}
          style={lineStyle('close')}
        />
      }
      {open &&
        <VictoryLine
          data={points.open}
          interpolation='monotoneX'
          {...rest}
          style={lineStyle('open')}
        />
      }
      {low &&
        <VictoryLine
          data={points.low}
          interpolation='monotoneX'
          {...rest}
          style={lineStyle('low')}
        />
      }
      {high &&
        <VictoryLine
          data={points.high}
          interpolation='monotoneX'
          {...rest}
          style={lineStyle('high')}
        />
      }
    </React.Fragment>
  )
}
