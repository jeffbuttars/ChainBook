import React from 'react'
import Reduxer from 'comp-builder/reduxer'
import { Statistic, Header } from 'semantic-ui-react'

class SideBar extends React.Component {
  static componentConnect = {
    state: {
      'gasPrice': 'web3.gasPrice:object'
    }
  }

  render () {
    const {gasPrice} = this.props
    const {wei, eth} = gasPrice.toJS()

    return (
      <div className='mt4 pa1'>
        <Header inverted >Last Gas</Header>
        <Statistic.Group size='mini' className='w-90'>
          <Statistic inverted >
            <Statistic.Label> Wei </Statistic.Label>
            <Statistic.Value>{wei}</Statistic.Value>
          </Statistic>
          <Statistic inverted >
            <Statistic.Label>ETH</Statistic.Label>
            <Statistic.Value>{eth}</Statistic.Value>
          </Statistic>
        </Statistic.Group>
      </div>
    )
  }
}

export default Reduxer(SideBar)
