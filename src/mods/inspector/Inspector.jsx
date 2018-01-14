import React from 'react'
import { Header, Input } from 'semantic-ui-react'

class Inspector extends React.Component {
  render () {
    return (
      <div>
        <Header size='large'> Inspector </Header>
        <div className='flex'>
          <Input
            action={{ color: 'green', labelPosition: 'left', icon: 'search', content: 'inspect'}}
            actionPosition='left'
            defaultValue='0x'
            className='w-100 mw7'
          />
        </div>
      </div>
      )
  }
}

export default Inspector
