import React from 'react'
import { Map } from 'immutable'
import { Link } from 'react-router-dom'
import { Dropdown, Menu, Icon } from 'semantic-ui-react'
import classNames from 'classnames'
import Reduxer from 'comp-builder/reduxer'
import { niceCryptoNum } from 'lib/numberFormat'
import * as web3Actions from 'web3/actions'
import * as hodlActions from 'hodl/actions'
import Logo from './Logo'

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

class CurTickerPrice extends React.Component {
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

class TopBar extends React.Component {
  componentDidMount() {
    // Kick off the gas price retreiver
    try {
      this.props.actions.web3.getGlobalInfo()
    } catch(e) {
      console.error('Unable to fetch global chain info\n')
      console.error(e)
    }

    try {
      this.props.actions.hodl.startPricePairTicker([['ETH', 'USD']])
    } catch(e) {
      console.error('Unable to start ticker\n')
      console.error(e)
    }
  }

  static componentConnect = {
    state: {
      'hodl': ':object'
    },
    actions: {
      'web3': web3Actions,
      'hodl': hodlActions
    }
  }

  render () {
    const {hodl} = this.props

    // This is crap, but grab the first value for now
    const fsym = 'ETH'
    const tick = hodl.getIn(['tickers', 'cur', fsym])
    const prevTick = hodl.getIn(['tickers', 'prev', fsym], Map())
    const [tsym, price] = tick ? tick.entrySeq().get(0, ['', '']) : ['', '']
    const lastPrice = prevTick.get(tsym, 0.0)

    return (
      <Menu fixed='top' inverted compact >
          <Menu.Item as={Link} to='/' header>
            <Logo color="#FFFFFF" className='w2 h2 mr3 red' />
            ChainBook
          </Menu.Item>

          <Dropdown item text='Tools'>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to='/inspector'>Inspector</Dropdown.Item>
              <Dropdown.Item as={Link} to='/chainhead'>Chain Head</Dropdown.Item>
              <Dropdown.Item as={Link} to='/block/latest'>Block</Dropdown.Item>
              <Dropdown.Item as={Link} to='/hodl'><span className='b'>HODL</span></Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Header>Header Item</Dropdown.Header>
              <Dropdown.Item>
                <i className='dropdown icon' />
                <span className='text'>Submenu</span>
                <Dropdown.Menu>
                  <Dropdown.Item>List Item</Dropdown.Item>
                  <Dropdown.Item>List Item</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Item>
              <Dropdown.Item>List Item</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Menu.Menu position='right'>
            <CurTickerPrice tsym={tsym} fsym={fsym} price={price} lastPrice={lastPrice}/>
          </Menu.Menu>
      </Menu>
      )
  }
}

export default Reduxer(TopBar)
