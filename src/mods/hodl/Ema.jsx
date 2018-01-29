import React from 'react'
import EMA from 'exponential-moving-average'
import { VictoryLine } from 'victory'
import { lineStyle } from './DataLines'

export default ({data, ...rest}) => {
  const ema = EMA(data.map(d => d.close), {range: 5, format: n => parseFloat(n)})
  const emaPoints = data.slice(data.length - ema.length).map((d, idx) => ({x: d.time, y: ema[idx]}))

  return (<VictoryLine name='ema' data={emaPoints} interpolation='monotoneX' {...rest} style={lineStyle('ema')} />)
}
