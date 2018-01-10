import React from 'react'
import { List, Divider } from 'semantic-ui-react'

export default () => (
  <React.Fragment>
    <Divider  />
      <List horizontal divided link >
        <List.Item as='a' href='#'>Terms and Conditions</List.Item>
        <List.Item as='a' href='#'>Privacy Policy</List.Item>
      </List>
  </React.Fragment>
  )
