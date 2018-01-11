import React from 'react'
//import { Link } from 'react-router-dom'
import Reduxer from 'comp-builder/reduxer'
import * as web3Actions from 'web3/actions'
import * as blockActions from './actions'


class Block extends React.Component {

  componentDidMount () {
    const { match: { params: { number } }, web3 } = this.props
    this.props.actions.block.get(web3.get('web3'), number)
  }

  static componentConnect = {
    state: {
      'web3': ':object',
      'block': ':object'
    },
    actions: {
      'web3': web3Actions,
      'block': blockActions
    }
  }

  render () {
    const { match: { params: { number } }, block } = this.props

    console.log('BLOCK')

    return (
      <div>
        <h2>
          Block {number}
        </h2>
      </div>
      )
  }
}

export default Reduxer(Block)
