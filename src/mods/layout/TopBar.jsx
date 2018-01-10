import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Dropdown, Menu, Icon } from 'semantic-ui-react'
import Reduxer from 'comp-builder/reduxer'
import * as web3Actions from 'web3/actions'

class TopBar extends React.Component {
  componentDidMount() {
    // Kick off the gas price retreiver
    this.props.actions.web3.getGasPrice()
  }

  static componentConnect = {
    state: {
      'web3': ':object'
    },

    actions: {
      'web3': web3Actions
    }
  }

  render () {
    const {handleSideBarToggle} = this.props

    return (
      <Menu fixed='top' inverted>
        <Container>
          <Menu.Item icon onClick={handleSideBarToggle} >
            <Icon name='line chart' />
          </Menu.Item>
          <Menu.Item as={Link} to='/' header>
            ChainBook
          </Menu.Item>

          <Dropdown item simple text='Tools'>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to='/inspector'>Inspector</Dropdown.Item>
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
        </Container>
      </Menu>
      )
  }
}

export default Reduxer(TopBar)
