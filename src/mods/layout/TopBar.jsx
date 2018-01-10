import React from 'react'
import { Container, Dropdown, Menu } from 'semantic-ui-react'

export default () => (
    <Menu fixed='top' inverted>
      <Container>
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
