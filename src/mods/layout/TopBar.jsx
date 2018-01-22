import React from 'react'
import { Link } from 'react-router-dom'
import { Dropdown, Menu } from 'semantic-ui-react'
import Reduxer from 'comp-builder/reduxer'
import * as web3Actions from 'web3/actions'

class TopBar extends React.Component {
  componentDidMount() {
    // Kick off the gas price retreiver
    try {
      this.props.actions.web3.getGlobalInfo()
    } catch(e) {
      console.error('Unable to fetch global chain info\n')
      console.error(e)
    }
  }

  static componentConnect = {
    // state: {
    //   'web3': ':object'
    // },
    actions: {
      'web3': web3Actions
    }
  }

  render () {
    // const {handleSideBarToggle} = this.props
    // <Menu.Item icon onClick={handleSideBarToggle} >
    //   <Icon name='line chart' />
    // </Menu.Item>

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
      </Menu>
      )
  }
}

export default Reduxer(TopBar)
