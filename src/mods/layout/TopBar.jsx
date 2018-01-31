import React from 'react'
import { Link } from 'react-router-dom'
import { Dropdown, Menu } from 'semantic-ui-react'
import Reduxer from 'comp-builder/reduxer'
import * as hodlActions from 'hodl/actions'
import Logo from './Logo'
import PriceTicker from 'PriceTicker'

class TopBar extends React.Component {
  componentWillMount() {
    this.props.actions.hodl.startDataSubscription()
  }

  static componentConnect = {
    actions: {
      'hodl': hodlActions
    }
  }

  render () {
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
            <PriceTicker />
          </Menu.Menu>
      </Menu>
      )
  }
}

export default Reduxer(TopBar)
