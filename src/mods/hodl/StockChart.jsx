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
import Ema from './Ema'

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

const oneDay = 86400000
const dayLabel = t => `${moment(t).format('MMM')}\n${moment(t).format('Do')}`
const hourLabel = t => `${moment(t).format('ddd')}\n${moment(t).format('k:mm')}`
const minLabel = t => moment(t).format('k:mm')

// Add a SVG filter to blur the hover info label
//
// The filter will receive all the normal Victory component props, which it doesn't
// care about, so wrap it, Victory can pass it's props without error and the filter
// can ignore them.
const FilterWrapper = (props) => (
    <filter id="blurMe">
      <feGaussianBlur in='StrokePaint' stdDeviation="1" />
    </filter>
)

export default class extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      chartWidth: 300,
      chartHeight:  200
    }
  }

  componentDidMount () {
    this.updateDimensions()
    window.addEventListener('resize', this.updateDimensions.bind(this))
  }

  componentWillUnmount () {
    window.removeEventListener('resize')
  }

  updateDimensions () {
    this.setState({
      chartWidth: window.innerWidth,
      chartHeight: window.innerHeight - 200
    })
  }

  xDataLabels (dataArray) {
    const delta = dataArray[dataArray.length - 1].time - dataArray[0].time
    const res = {
      tickValues: dataArray.map(t => t.time),
      tickFormat: hourLabel
    }

    if (delta < oneDay) {
      res.tickFormat = minLabel
    }

    if (delta > (oneDay * 2)) {
      res.tickFormat = dayLabel
    }

    return res
  }

  xData (dataArray) {
    // don't show more than 4 data points per 100 px
    const {chartWidth} = this.state
    const max = (chartWidth / 100) * 4

    if (dataArray.size <= max) {
      return dataArray.map(t => t.time)
    }

    return dataArray.map(t => t.time)
  }

  render () {
    const {data, candlestick, regressions, dataLines} = this.props
    const dataArray = data.reduce((p, v) => p.concat(v.toJS()), [])
    const {chartWidth, chartHeight} = this.state

    return (
      <VictoryChart
        responsive
        scale="time"
        animate={{duration: 500}}
        padding={{left: 50, top: 10, right: 50, bottom: 50}}
        height={chartHeight}
        width={chartWidth}
        containerComponent={
          <VictoryVoronoiContainer
            textAnchor='left'
            labelComponent={
              <VictoryTooltip
                style={{fontSize: 12, strokeWidth: 0.5, strokeOpacity: 0.5}}
                flyoutStyle={{strokeWidth: 0, fill: '#FFF', fillOpacity: 0.8, filter: 'url(#blurMe)'}}

              />
              }
              voronoiDimension="x"
              labels={chartDataLabel}
            />
        }
      >
        <FilterWrapper />
        <VictoryAxis
          {...this.xDataLabels(dataArray)}
          fixLabelOverlap={true}
          style={{
            axis: {
              stroke: '#ddd'
            },
            tickLabels: {
              fontSize: 12
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
            fontSize: 12
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
      <Ema name='ema' data={dataArray} />

    </VictoryChart>
    )
  }
}
