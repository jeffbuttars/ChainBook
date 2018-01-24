import React from 'react'
import { OrderedMap } from 'immutable'
import { Dropdown, Checkbox } from 'semantic-ui-react'
import Reduxer from 'comp-builder/reduxer'
import {regressionColors} from './Regressions'
import {dataLineColors} from './DataLines'
import * as hodlActions from './actions'
import StockChart from './StockChart'

// XXX Need moving averages and resistance lines

const regressionOptions = [
  {key: 'combined', text: 'Combined', value: 'combined'},
  {key: 'low', text: 'Low', value: 'low'},
  {key: 'high', text: 'High', value: 'high'},
  {key: 'open', text: 'Open', value: 'open'},
  {key: 'close', text: 'Close', value: 'close'}
]
const dataLineOptions = [
  {key: 'low', text: 'Low', value: 'low', className: 'red'},
  {key: 'high', text: 'High', value: 'high'},
  {key: 'open', text: 'Open', value: 'open'},
  {key: 'close', text: 'Close', value: 'close'}
]
const intervalOptions = [
  {key:'15m', value:'15m', text:'15 Min.'},
  {key:'1h', value:'1h', text:'1 Hour'},
  {key:'6h', value:'6h', text:'6 Hours'},
  {key:'12h', value:'12h', text:'12 Hours'},
  {key:'1d', value:'1d', text:'1 Day'},
  {key:'1w', value:'1w', text:'1 Week'},
  {key:'1M', value:'1M', text:'1 Month'},
  {key:'3M', value:'3M', text:'3 Months'},
  {key:'6M', value:'6M', text:'6 Months'},
  {key:'1Y', value:'1Y', text:'1 Year'}
]

const dataLineLabel = (label) => {
  return {
    style: {
      ...dataLineColors[label.value]
    },
    content: label.text
  }
}

const regressionsLabel = (label) => {
  return {
    style: {
      ...regressionColors[label.value]
    },
    content: label.text
  }
}

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
      },
      cursorData: {},
      interval: {
        value: '1d',
        loading: false
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

  onIntervalChanged ({value}) {
    this.fetchHistory(value)
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
    this.setState((prevState) => ({candlestick: !prevState.candlestick}))
  }

  async fetchHistory (interval) {
    const {actions} = this.props
    this.setState({'interval': {value: interval, loading: true}})
    await actions.hodl.getDailyHistory('ETH', interval)
    this.setState({'interval': {value: interval, loading: false}})
  }

  async componentDidMount () {
    this.fetchHistory(this.state.interval.value)
  }

  render () {
    const {hodl} = this.props
    let data = hodl.getIn(['ETH', 'byDay'], OrderedMap())

    return (
      <div>
        <div className='b f1 mv3 ml3'>HODL</div>
        {
          data.size ?
            <div>
              <div className='ml3'>
                <div className='mv2'>
                  <Checkbox
                    toggle
                    label='Candlestick'
                    onChange={(e, v) => this.onCandlestickToggled(v)}
                    checked={this.state.candlestick}
                  />
                </div>

                <div className='flex flex-wrap'>
                  <div className='flex flex-column mr2'>
                    <div className='b'>Interval</div>
                    <Dropdown
                      onChange={(e, v) => this.onIntervalChanged(v)}
                      selection
                      options={intervalOptions}
                      defaultValue='1d'
                    />
                  </div>

                  <div className='flex flex-column mr2'>
                    <div className='b'>Regression Chart</div>
                    <Dropdown
                      onChange={(e, v) => this.onRegressionChanged(v)}
                      placeholder=''
                      multiple
                      selection
                      options={regressionOptions}
                      renderLabel={regressionsLabel}
                    />
                  </div>
                  <div className='flex flex-column mr2'>
                    <div className='b'>Price Line Chart</div>
                    <Dropdown
                      onChange={(e, v) => this.onDataLineChanged(v)}
                      placeholder=''
                      multiple
                      selection
                      options={dataLineOptions}
                      renderLabel={dataLineLabel}
                    />
                  </div>
                </div>

              </div>
              <StockChart data={data} {...this.state} />
            </div>
          : <div></div>
        }
      </div>
      )
  }
}

export default Reduxer(Hodl)
