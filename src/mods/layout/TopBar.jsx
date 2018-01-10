import React from 'react'
import { Container, Dropdown, Menu, Icon } from 'semantic-ui-react'

const TopBar = ({handleSideBarToggle}) => (
  <Menu fixed='top' inverted>
    <Container>
      <Menu.Item icon onClick={handleSideBarToggle} >
        <Icon name='line chart' />
      </Menu.Item>
      <Menu.Item as='a' href='/' header>
        ChainBook
      </Menu.Item>

      <Dropdown item simple text='Tools'>
        <Dropdown.Menu>
          <Dropdown.Item as='a' href='/inspector'>Inspector</Dropdown.Item>
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

export default TopBar
