import React from 'react'
import Reduxer from 'comp-builder/reduxer'
import { List, Map } from 'immutable'
import TransCard from 'transaction/TransCards'
import * as web3Actions from 'web3/actions'
import * as blockActions from './actions'

class Transactions extends React.Component {
  componentDidMount () {
    const { match: { params: { number } }, web3, actions } = this.props
    console.log('Transactions mounted for block', number)

    const blockNumber = parseInt(number, 10)
    actions.block.get(web3, blockNumber, true)
  }

  static componentConnect = {
    state: {
      'web3': 'web3.web3:object',
      'blocks': 'block.byNumber:object',
      'transaction': ':object'
    },
    actions: {
      'web3': web3Actions,
      'block': blockActions
    }
  }

  render () {
    const { match: { params: { number } }, blocks, transaction, web3 } = this.props
    const blk = blocks.get(number)

    console.log('BLK', blk)
    console.log('WEB3', web3)

    if (!blk) {
      return (
        <div>
          No block for {number} yet
        </div>
      )
    }

    console.log('BLK', blk.toJS())
    console.log('TRANS', transaction.toJS())


    return (
      <div>
        {blk.get('transactions', List).map(
            (tran, idx) => <TransCard key={idx} transaction={transaction.get(tran, Map())} web3={web3}/>
          )}
      </div>
      )
  }
}

export default Reduxer(Transactions)
