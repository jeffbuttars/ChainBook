import React from 'react'
import { Link } from 'react-router-dom'
import { Dropdown, Menu, Icon } from 'semantic-ui-react'
import classNames from 'classnames'
import Reduxer from 'comp-builder/reduxer'
import * as web3Actions from 'web3/actions'
import * as hodlActions from 'hodl/actions'

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

const CurTickerPrice = ({fsym, tsym, price}) => {
  return (
    <div className='flex pr2 pt2'>
      <div className='flex flex-column pt1'>
        <CurrencyIcon sym={fsym} className='f6 near-white' />
        <CurrencyIcon sym={tsym} className='pt1 f6 near-white'/>
      </div>
      <div className='flex flex-column'>
        <div className='f5 b white'> {fsym} </div>
        <div className='f5 b white'> {price} </div>
      </div>
    </div>
  )
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
    const tick = hodl.getIn(['tickers', fsym])
    const [tsym, price] = tick ? tick.entrySeq().get(0, ['', '']) : ['', '']

    return (
      <Menu fixed='top' inverted compact >
          <Menu.Item as={Link} to='/' header>
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
            <CurTickerPrice tsym={tsym} fsym={fsym} price={price} />
          </Menu.Menu>
      </Menu>
      )
  }
}

export default Reduxer(TopBar)
