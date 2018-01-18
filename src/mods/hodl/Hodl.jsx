import React from 'react'
import dl from 'datalib'
import { List, OrderedMap } from 'immutable'
import { Dropdown } from 'semantic-ui-react'
import Reduxer from 'comp-builder/reduxer'
import moment from 'moment'
import {
  VictoryChart,
  VictoryAxis,
  VictoryCandlestick,
  VictoryLine
} from 'victory'
import * as hodlActions from './actions'

// For a given set of x and y inputs return the start
// and end points of the input regression line
const linearRegression = (x, y) => {
  const result = dl.linearRegression(x, y)

  return [
    {'x': x[0], 'y': (result.slope * x[0]) + result.intercept},
    {'x': x[x.length - 1], 'y': (result.slope * x[x.length - 1]) + result.intercept}
  ]
}

const regressionOptions = [
  {key: 'combined', text: 'Combined', value: 'combined'},
  {key: 'low', text: 'Low', value: 'low'},
  {key: 'high', text: 'High', value: 'high'},
  {key: 'open', text: 'Open', value: 'open'},
  {key: 'close', text: 'Close', value: 'close'}
]

class Hodl extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      regressions: {
        low: false,
        high: false,
        open: false,
        close: false,
        combined: false
      }
    }
  }

  static componentConnect = {
    state: {
      'hodl': ':object'
    },
    actions: {
      'hodl': hodlActions
    }
  }

  onRegressionClicked ({value}) {
    this.setState(() => {
      const regressions = {
        low: false,
        high: false,
        open: false,
        close: false,
        combined: false
      }

      value.map((v) => regressions[v] = true)

      return {regressions}
    })
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


  calcRegressions = (data) => {
    if (data.size < 1) {
      return {}
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
    }, {
      combined: {x: [], y: []},
      low: {x: [], y: []},
      high: {x: [], y: []},
      open: {x: [], y: []},
      close: {x: [], y: []}
      })

    return {
      combinedPoints: linearRegression(points.combined.x, points.combined.y),
      lowPoints: linearRegression(points.low.x, points.low.y),
      highPoints: linearRegression(points.high.x, points.high.y),
      closePoints: linearRegression(points.close.x, points.close.y),
      openPoints: linearRegression(points.open.x, points.open.y)
    }
  }

  render () {
    const {hodl} = this.props
    const data = hodl.getIn(['ETH', 'byDay'], OrderedMap())
    const dataArray = data.reduce((p, v) => p.concat(v.toJS()), [])

    // Should cache in state
    const regPoints = data.size ? this.calcRegressions(data) : {}
    console.log('HODL!!!!', data.toJS())
    console.log('HODL dataArray', dataArray)

    return (
      <div>
        <div className='b f1 mv3'>HODL</div>
        {
          data.size ?
            <div>
              <div>
                <Dropdown
                  onChange={(e, v) => this.onRegressionClicked(v)}
                  placeholder='Regressions'
                  multiple
                  selection
                  options={regressionOptions}
                />
              </div>
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
                {this.state.regressions.combined &&
                  <VictoryLine
                    data={regPoints.combinedPoints}
                    style={{
                      data: { strokeWidth: 0.5, strokeOpacity: 0.6}
                    }}
                  />
                }
                {this.state.regressions.close &&
                  <VictoryLine
                    data={regPoints.closePoints}
                    style={{
                      data: { strokeWidth: 0.5, strokeOpacity: 0.6}
                    }}
                  />
                }
                {this.state.regressions.open &&
                  <VictoryLine
                    data={regPoints.openPoints}
                    style={{
                      data: { strokeWidth: 0.5, strokeOpacity: 0.6}
                    }}
                  />
                }
                {this.state.regressions.low &&
                  <VictoryLine
                    data={regPoints.lowPoints}
                    style={{
                      data: { strokeWidth: 0.5, strokeOpacity: 0.6}
                    }}
                  />
                }
                {this.state.regressions.high &&
                  <VictoryLine
                    data={regPoints.highPoints}
                    style={{
                      data: { strokeWidth: 0.5, strokeOpacity: 0.6}
                    }}
                  />
                }
              </VictoryChart>

            </div>
          : <div></div>
        }
      </div>
      )
  }
}

export default Reduxer(Hodl)
