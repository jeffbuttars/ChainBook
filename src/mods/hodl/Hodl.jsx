import React from 'react'
import dl from 'datalib'
import { List, OrderedMap } from 'immutable'
import Reduxer from 'comp-builder/reduxer'
import regression from 'regression'
import moment from 'moment'
import {
  VictoryChart,
  VictoryAxis,
  VictoryCandlestick,
  VictoryLine
} from 'victory'
import * as hodlActions from './actions'

class Hodl extends React.Component {
  static componentConnect = {
    state: {
      'hodl': ':object'
    },
    actions: {
      'hodl': hodlActions
    }
  }

  async componentDidMount () {
    const {actions, hodl} = this.props
    console.log('componentDidMount HODL!!!!', hodl.toJS())

    const action = await actions.hodl.getDailyHistory('ETH', '90')
    console.log('componentDidMount HODL result', action)
  }

  getYAxis = (data) => {
    console.log('getYAxis data', data)

    const allValues = data.reduce((p, v) => {
      return p.concat(v.get('close'), v.get('open'), v.get('low'), v.get('high'))
    }, List())

    // allValues.push(Math.floor(allValues.get(0) / 100) * 100)
    // console.log('getYAxis allValues', allValues.toJS())
    const minVal = Math.floor(allValues.min() / 100) * 100
    const maxVal = Math.ceil(allValues.max() / 100) * 100
    console.log('MIN MSX', minVal, maxVal)

    const diff = maxVal - minVal
    const step = diff / 5

    const axis = []
    for (let i = minVal; i <= maxVal; i += step) {
      axis.push(i)
    }

    console.log('getYAxis axis', axis)
    return axis
  }

  calcRegression = (data) => {
    if (data.size < 1) {
      return {}
    }

    // const input = data.reduce((p, v, k) => {
    //   p.push([k, v.get('high')])
    //   p.push([k, v.get('low')])
    //   p.push([k, v.get('open')])
    //   p.push([k, v.get('close')])
    //   return p
    // }, [])
    const input = data.reduce((p, v, k) => {
      p.x.push(k)
      p.x.push(k)
      p.x.push(k)
      p.x.push(k)
      p.y.push(v.get('high'))
      p.y.push(v.get('low'))
      p.y.push(v.get('open'))
      p.y.push(v.get('close'))

      return p
    }, {x: [], y: []})

    console.log('REGRESSION INPUT', input)

    console.log('DL', dl)
    const dlResult = dl.linearRegression(input.x, input.y)
    console.log('REGRESSION  DL RESULT', dlResult)

    const points = [
      {x: input.x[0], y: (dlResult.slope * input.x[0]) + dlResult.intercept},
      {x: input.x[input.x.length - 1], y: (dlResult.slope * input.x[input.x.length - 1]) + dlResult.intercept}
    ]

    console.log('REGRESSION  DL points', points)
    return points

    // return dlResult

    // const result = regression.linear(input)
    // const result = regression.power(input)
    // const result = regression.exponential(input)
    // const result = regression.logarithmic(input)
    // const result = regression.polynomial(input)

    // console.log('REGRESSION  RESULT', result)
    // return result
  }

  render () {
    const {hodl} = this.props
    const data = hodl.getIn(['ETH', 'byDay'], OrderedMap())
    const dataArray = data.reduce((p, v) => p.concat(v.toJS()), [])
    const regPoints = data.size ? this.calcRegression(data) : {}
    console.log('HODL!!!!', data.toJS())
    console.log('HODL dataArray', dataArray)
    // {dataArray.map(v => (<div key={v.time} className='pv1'>{v.close}</div>))}

    return (
      <div>
        <div className='b f1 mv3'>HODL</div>
        {
          data.size ?
            <div>
              <VictoryChart
                height={300}
                scale="time"
                domainPadding={{x: 15}}
              >
                <VictoryAxis
                  tickValues={dataArray.map(t => t.time)}
                  tickFormat={t => moment(t).format('M/D')}
                  tickCount={data.size}
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
                  tickValues={this.getYAxis(data)}
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

                <VictoryCandlestick
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
                <VictoryLine
                  data={regPoints}
                  style={{
                    data: { strokeWidth: 0.5, strokeOpacity: 0.6}
                  }}
                />
              </VictoryChart>

            </div>
          : <div></div>
        }
      </div>
      )
  }
}

export default Reduxer(Hodl)
