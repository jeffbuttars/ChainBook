import React from 'react'
import classNames from 'classnames'
import { Icon } from 'semantic-ui-react'
import { niceCryptoNum } from 'numberFormat'

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
    this._timer = null
    this.state = {
      timer: null
    }
  }

  flashIndicator (indicator) {
    const elems = document.getElementsByClassName('ticker-tranny')
    for (let i=0; i < elems.length; i++) {
      elems[i].style.transition = 'color 0.2s ease'
      elems[i].style.color = indicator
    }

    if (this._timer) {
      return
    }

    this._timer = setTimeout(() => {
      for (let i=0; i < elems.length; i++) {
        elems[i].style.transition = 'color 0.5s ease'
        elems[i].style.color = 'white'
      }
      this._timer = null
    }, 1000)
  }

  render () {
    const {fsym, tsym, price, lastPrice} =  this.props
    const indicator = parseFloat(price, 10) >= parseFloat(lastPrice, 10) ? 'green' : 'red'
    const delta = lastPrice ? price - lastPrice : 0
    const deltaStr = Math.abs(niceCryptoNum(delta)) + ''
    const iName = delta < 0.0 ? 'minus' : 'plus'

    // console.log('INIDICATOR', indicator, lastPrice, price, delta, deltaStr)
    this.flashIndicator(indicator)

    return (
      <div className='flex pr2 pt2'>
        <div className='flex mr2'>
          {deltaStr !== '0' && (
            <React.Fragment>
              <Icon name={iName} size='small' style={{color: indicator}} className='pt2 mr2' />
              <div style={{color: indicator}}> {deltaStr} </div>
            </React.Fragment>
          )}
        </div>

        <div className='flex flex-column pt1'>
          <CurrencyIcon sym={fsym} className='f6 near-white' />
          <CurrencyIcon sym={tsym} className='pt1 f6 near-white'/>
        </div>

        <div className='flex flex-column f5'>
          <div className='ticker-tranny b' style={{color: indicator}}> {fsym} </div>
          <div className='ticker-tranny b' style={{color: indicator}}> {price} </div>
        </div>
      </div>
    )
  }
}

export default PriceTicker
