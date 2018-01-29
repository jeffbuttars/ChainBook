import React from 'react'
import { Map } from 'immutable'
import { Link } from 'react-router-dom'
import { Dropdown, Menu } from 'semantic-ui-react'
import Reduxer from 'comp-builder/reduxer'
import * as web3Actions from 'web3/actions'
import * as hodlActions from 'hodl/actions'
import Logo from './Logo'
import PriceTicker from 'PriceTicker'

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

    this.props.actions.hodl.startDataSubscription()
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
            <PriceTicker tsym={tsym} fsym={fsym} price={price} lastPrice={lastPrice}/>
          </Menu.Menu>
      </Menu>
      )
  }
}

export default Reduxer(TopBar)
