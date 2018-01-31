import React from 'react'
import { List, Map } from 'immutable'
import classNames from 'classnames'
import { Icon, Popup } from 'semantic-ui-react'
import Reduxer from 'comp-builder/reduxer'
import { niceCryptoNum } from 'numberFormat'
import './css/priceTicker.css'

const suiCurrencyMap = {
  EUR: 'euro',
  USD: 'dollar',
  BTC: 'bitcoin',
  GBP: 'pound',
  INR: 'rupee',
  JPY: 'yen',
  RUB: 'ruble',
  KRW: 'won',
  TRY: 'lira',
  ILS: 'shekel'
}

const calcIndicator = (price, lastPrice) =>
  parseFloat(price, 10) >= parseFloat(lastPrice, 10) ? 'up' : 'down'

const indicatorClasses = indicator => {
  return indicator === 'up' ? 'dark-green' : 'dark-red'
}

const resetAnimation = (cls) => {
    const elems = document.getElementsByClassName(cls)
    for (let i=0; i < elems.length; i++) {
      elems[i].style.animation = 'none'
      elems[i].style.animation = elems[i].offsetHeight // Trigger a reflow
      elems[i].style.animation = null
    }
}

const CurrencyIcon = ({sym, ...rest}) => {
  if (suiCurrencyMap[sym.toUpperCase()]) {
    return (<Icon name={suiCurrencyMap[sym.toUpperCase()]} {...rest} />)
  }

  return (
    <i
      aria-hidden='true' className={classNames(rest.className, `cf cf-${sym.toLowerCase()}`
      )}
    />
  )
}

class PriceTicker extends React.Component {
  constructor (props) {
    super(props)
    //
    // This is hardcoded config crap for now
    this.state = {
      exchange: 'coinbase',
      pair: 'ETH:USD'
    }
  }

  componentWillReceiveProps(nProps) {
    // Hack to 'restart' the animation when the animation class name isn't changed
    // from one tick to the next.
    const { stream } = this.props
    const { exchange, pair } = this.state

    const data = stream.getIn([exchange, pair, 'data'], Map())
    const nextData = nProps.stream.getIn([exchange, pair, 'data'], Map())

    const cur = data.get(0)
    const prev = data.get(1, cur)

    const nextCur = nextData.get(0)
    const nextPrev = nextData.get(1, nextCur)

    if (!(cur && nextCur)) {
      return
    }

    const nextIndicator = calcIndicator(nextCur.get('price'), nextPrev.get('price'))
    const indicator = calcIndicator(cur.get('price'), prev.get('price'))

    if (nextIndicator !== indicator) {
      return
    }

    resetAnimation('tickerTranny')
  }

  static componentConnect = {
    state: {
      'stream': 'hodl.stream:object'
    }
  }

  renderTicker (history) {
    const data = history.get('data', List())
    const cur = data.get(0)
    const prev = data.get(1, cur)

    const {fsym, tsym, price} =  cur.toJS()
    const lastPrice = prev ? prev.get('price') : price

    const changePct = niceCryptoNum(history.get('change24HourPct'))
    const change = niceCryptoNum(history.get('change24Hour'))

    const indicator = calcIndicator(price, lastPrice)
    const indicatorCls = indicatorClasses(change < 0 ? 'down' : 'up')
    const flashCls = indicator === 'down' ? 'easeFromRed' : 'easeFromGreen'

    return (
      <div className='flex pr2 pt2'>
        <div className='flex flex-column pt1'>
          <CurrencyIcon sym={fsym} className='f6 white' />
          <CurrencyIcon sym={tsym} className='pt1 f6 white'/>
        </div>

        <div className='flex flex-column f5 mr3'>
          <div className={`tickerTranny b white ${flashCls}`} > {fsym} </div>
          <div className={`tickerTranny b white ${flashCls}`} > {price} </div>
        </div>

        <Popup
          header='24 Hour Change'
          trigger={
            <div className='flex flex-column mr2'>
              <div className={`${indicatorCls}`}> {change} </div>
              <div className={`${indicatorCls}`}> {changePct} % </div>
            </div>
          }
        />
      </div>
    )
  }

  render () {
    const { stream } = this.props
    const { exchange, pair } = this.state
    const history = stream.getIn([exchange, pair], Map())

    return history.get('data', List()).has(0) ? this.renderTicker(history) :
      (
        <div className='flex items-center pr4'>
          <Popup
            content='Loading Price Data'
            trigger={<Icon name='spinner' loading />}
          />
      </div>
  )
  }
}

export default Reduxer(PriceTicker)
