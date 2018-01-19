import React from 'react'
import { List, OrderedMap } from 'immutable'
import { Dropdown, Checkbox } from 'semantic-ui-react'
import Reduxer from 'comp-builder/reduxer'
import moment from 'moment'
import {
  VictoryChart,
  VictoryAxis,
  VictoryCandlestick
} from 'victory'
import Regressions from './Regressions'
import DataLines from './DataLines'
import * as hodlActions from './actions'

// XXX Need moving averages and resistance lines


const regressionOptions = [
  {key: 'combined', text: 'Combined', value: 'combined'},
  {key: 'low', text: 'Low', value: 'low'},
  {key: 'high', text: 'High', value: 'high'},
  {key: 'open', text: 'Open', value: 'open'},
  {key: 'close', text: 'Close', value: 'close'}
]
const dataLineOptions = [
  {key: 'low', text: 'Low', value: 'low'},
  {key: 'high', text: 'High', value: 'high'},
  {key: 'open', text: 'Open', value: 'open'},
  {key: 'close', text: 'Close', value: 'close'}
]

class Hodl extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      candlestick: true,
      regressions: {
        low: false,
        high: false,
        open: false,
        close: false,
        combined: false
      },
      dataLines: {
        low: false,
        high: false,
        open: false,
        close: false
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

  onRegressionChanged ({value}) {
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

  onDataLineChanged ({value}) {
    this.setState(() => {
      const dataLines = {
        low: false,
        high: false,
        open: false,
        close: false
      }

      value.map((v) => dataLines[v] = true)

      return {dataLines}
    })
  }

  onCandlestickToggled ({value}) {
    console.log('toggle', value)
    this.setState((prevState) => ({candlestick: !prevState.candlestick}))
  }

  async componentDidMount () {
    const {actions, hodl} = this.props
    const action = await actions.hodl.getDailyHistory('ETH', '90')
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

    const diff = maxVal - minVal
    const step = diff / 5

    const axis = []
    for (let i = minVal; i <= maxVal; i += step) {
      axis.push(i)
    }

    return axis
  }



  render () {
    const {hodl} = this.props
    let data = hodl.getIn(['ETH', 'byDay'], OrderedMap())
    const dataArray = data.reduce((p, v) => p.concat(v.toJS()), [])
    // Should cache in state
    // console.log('HODL!!!!', data.toJS())
    // console.log('HODL dataArray', dataArray)

    return (
      <div>
        <div className='b f1 mv3'>HODL</div>
        {
          data.size ?
            <div>
              <div>
                <div className='mv2'>
                  <Checkbox
                    toggle
                    label='Candlestick'
                    onChange={(e, v) => this.onCandlestickToggled(v)}
                    checked={this.state.candlestick}
                  />
                </div>

                <div className='flex'>
                  <div className='flex flex-column'>
                    <div className='b'>Regression Chart</div>
                    <Dropdown
                      className='mr2'
                      onChange={(e, v) => this.onRegressionChanged(v)}
                      placeholder=''
                      multiple
                      selection
                      options={regressionOptions}
                    />
                  </div>
                  <div className='flex flex-column'>
                    <div className='b'>Price Line Chart</div>
                    <Dropdown
                      onChange={(e, v) => this.onDataLineChanged(v)}
                      placeholder=''
                      multiple
                      selection
                      options={dataLineOptions}
                    />
                  </div>
                </div>
              </div>
              <VictoryChart
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

              {this.state.candlestick &&
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
                }
                <Regressions data={data} {...this.state.regressions} />
                <DataLines data={data} {...this.state.dataLines} />
              </VictoryChart>

            </div>
          : <div></div>
        }
      </div>
      )
  }
}

export default Reduxer(Hodl)
