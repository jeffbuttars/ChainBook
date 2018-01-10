import React from 'react'
import Reduxer from 'comp-builder/reduxer'

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
        <div>
          {wei}
        </div>
        <div>
          {eth}
        </div>
      </div>
    )
  }
}

export default Reduxer(SideBar)
