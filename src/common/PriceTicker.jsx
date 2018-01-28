import React from 'react'
import classNames from 'classnames'
import { Icon } from 'semantic-ui-react'
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
      elems[i].offsetHeight // Trigger a reflow
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
  componentWillReceiveProps(nProps) {
    // Hack to 'restart' the animation when the animation class name isn't changed
    // from one tick to the next.
    const {price, lastPrice} =  this.props

    const nextIndicator = calcIndicator(nProps.price, nProps.lastPrice)
    const indicator = calcIndicator(price, lastPrice)

    if (nextIndicator !== indicator) {
      return
    }

    resetAnimation('tickerTranny')
  }

  render () {
    const {fsym, tsym, price, lastPrice} =  this.props
    const indicator = calcIndicator(price, lastPrice)
    const indicatorCls = indicatorClasses(indicator)
    const delta = lastPrice ? price - lastPrice : 0
    const deltaStr = Math.abs(niceCryptoNum(delta)) + ''
    const iName = delta < 0.0 ? 'minus' : 'plus'
    const flashCls = indicator === 'down' ? 'easeFromRed' : 'easeFromGreen'

    return (
      <div className='flex pr2 pt2'>
        <div className='flex mr2'>
          {deltaStr !== '0' && (
            <React.Fragment>
              <Icon name={iName} size='small' className={`${indicatorCls} pt2 mr2 b`} />
              <div className={`${indicatorCls}`}> {deltaStr} </div>
            </React.Fragment>
          )}
        </div>

        <div className='flex flex-column pt1'>
          <CurrencyIcon sym={fsym} className='f6 white' />
          <CurrencyIcon sym={tsym} className='pt1 f6 white'/>
        </div>

        <div className='flex flex-column f5'>
          <div className={`tickerTranny b white ${flashCls}`} > {fsym} </div>
          <div className={`tickerTranny b white ${flashCls}`} > {price} </div>
        </div>
      </div>
    )
  }
}

export default PriceTicker
