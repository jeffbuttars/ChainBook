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
      cursorData: {}
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
    this.setState((prevState) => ({candlestick: !prevState.candlestick}))
  }

  async componentDidMount () {
    const {actions} = this.props
    actions.hodl.getDailyHistory('ETH', '90')
  }

  render () {
    const {hodl} = this.props
    let data = hodl.getIn(['ETH', 'byDay'], OrderedMap())

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
                      renderLabel={regressionsLabel}
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
