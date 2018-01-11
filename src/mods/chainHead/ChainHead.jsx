import React from 'react'
import { Link } from 'react-router-dom'
import Reduxer from 'comp-builder/reduxer'
import * as web3Actions from 'web3/actions'

class ChainHead extends React.Component {
  static componentConnect = {
    state: {
      'web3': ':object'
    },
    actions: {
      'web3': web3Actions
    }
  }

  render () {
    const {gasPrice, blockNumber, hashRate} = this.props.web3.toJS()

    return (
      <div>
        <h3> Chain Head </h3>
        <div className='flex'>
          <div className='flex flex-column mr2'>
            <div className='flex'>
              <h4>Last Gas Price</h4>
            </div>
            <div className='flex'>
              <h4> Last Block </h4>
            </div>
            <div className='flex'>
              <h4> Hash Rate </h4>
            </div>
          </div>

          <div className='flex flex-column'>
            <div className='flex'>
              {gasPrice.wei} / {gasPrice.eth}
            </div>
            <div className='flex'>
              <Link to={`/block/${blockNumber}`}>{blockNumber}</Link>
            </div>
            <div className='flex'>
              {hashRate}
            </div>
          </div>
        </div>
      </div>
      )
  }
}

export default Reduxer(ChainHead)
