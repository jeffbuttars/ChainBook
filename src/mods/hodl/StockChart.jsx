import React from 'react'
import { List } from 'immutable'
import moment from 'moment'
import {
  VictoryChart,
  VictoryAxis,
  VictoryVoronoiContainer,
  VictoryTooltip,
  VictoryCandlestick
} from 'victory'
import Regressions from './Regressions'
import DataLines from './DataLines'

const getYAxis = (data) => {
  const allValues = data.reduce((p, v) => {
    return p.concat(v.get('close'), v.get('open'), v.get('low'), v.get('high'))
  }, List())

  // allValues.push(Math.floor(allValues.get(0) / 100) * 100)
  const minVal = Math.floor(allValues.min() / 10) * 10
  const maxVal = Math.ceil(allValues.max() / 10) * 10

  const diff = maxVal - minVal
  const step = diff / 5

  const axis = []
  for (let i = minVal; i <= maxVal; i += step) {
    axis.push(i)
  }

  return axis
}

const chartDataLabel = (data) => {
  if (data.childName !== 'candlestick') {
    return
  }

  const lines = [
    moment(data.time).format('M/D'),
    `O ${data.open}`,
    `C ${data.close}`,
    `L ${data.low}`,
    `H ${data.high}`
  ]

  return lines.join('\n')
}

export default ({data, candlestick, regressions, dataLines}) => {
  const dataArray = data.reduce((p, v) => p.concat(v.toJS()), [])

  return (
    <VictoryChart
      scale="time"
      animate={{duration: 500}}
      padding={{left: 25, top: 10, right: 50, bottom: 50}}
      containerComponent={
        <VictoryVoronoiContainer
          textAnchor='left'
          labelComponent={
            <VictoryTooltip
              style={{fontSize: 5, strokeWidth: 0.5, strokeOpacity: 0.5}}
              flyoutStyle={{strokeWidth: 0, fill: '#FFF', fillOpacity: 0.8, filter: 'url(#blurMe)'}}

            />
            }
            voronoiDimension="x"
            labels={chartDataLabel}
          />
      }
    >
      <VictoryAxis
        tickValues={dataArray.map(t => t.time)}
        tickFormat={t => moment(t).format('M/D')}
        fixLabelOverlap={true}
        style={{
          axis: {
            stroke: '#ddd'
          },
          tickLabels: {
            fontSize: 4
          }
        }}
      />

    <VictoryAxis
      dependentAxis
      scale="linear"
      tickValues={getYAxis(data)}
      tickFormat={t => `${Math.round(t)}`}
      fixLabelOverlap={true}
      style={{
        grid: {
          strokeWidth: 1,
          stroke: '#EEE'
        },
        axis: {
          stroke: '#ddd'
        },
        tickLabels: {
          fontSize: 4
        }
      }}
    />

    {candlestick &&
    <VictoryCandlestick
      name='candlestick'
      candleColors={{positive: '#3A3', negative: '#c43a31'}}
      data={dataArray}
      x='time'
      style={{
        data: {
          strokeWidth: 0.75,
          strokeOpacity: 0.5,
          fillOpacity: 0.8
        }
      }}
    />
    }

    <Regressions name='regressionLines' data={data} {...regressions} />
    <DataLines name='dataLines' data={data} {...dataLines} />

    <filter id="blurMe">
      <feGaussianBlur in='StrokePaint' stdDeviation="1" />
    </filter>
  </VictoryChart>
)
}
