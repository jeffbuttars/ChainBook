import React from 'react'
import { Header, Input } from 'semantic-ui-react'
import * as web3Actions from 'web3/actions'

class Inspector extends React.Component {

  // onComponentDidMount() {
    // Ask for the current gas price
  // }

  static componentConnect = {
    state: {
      'web3': 'web3.web3:object',
      'gasPrice': 'web3.gasPrice'
    },

    actions: {
      'web3': web3Actions
    }
  }

  render () {
    return (
      <div>
        <Header >
          Inspector
        </Header>
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
