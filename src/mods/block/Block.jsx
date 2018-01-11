import React from 'react'
//import { Link } from 'react-router-dom'
import Reduxer from 'comp-builder/reduxer'
import * as web3Actions from 'web3/actions'
import * as blockActions from './actions'

// const blockKeys = [
//   "number",
//   "timestamp",
//   "gasLimit",
//   "gasUsed",
//   "size",
//   "difficulty",
//   "extraData"
//   "hash",
//   "logsBloom",
//   "miner",
//   "mixHash",
//   "nonce",
//   "parentHash",
//   "receiptsRoot",
//   "sha3Uncles",
//   "stateRoot",
//   "totalDifficulty",
//   "transactionsRoot",
//   "transactions",
//   "uncles"
// ]

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
    const { match: { params: { number } } } = this.props
    const { block } = this.props

    // console.log('BLOCK NUMBER', number)
    // console.log('BLOCK', block.toJS())
    const blk = block.getIn(['byNumber', number])
    // console.log('BLOCK', blk)

    if (!blk) {
      return (
        <div>
          <h2>
            Unknown block: {number}
          </h2>
        </div>
      )
    }

    // console.log('BLOCK', blk.toJS())
    const {
      timestamp, gasLimit,
      gasUsed, size, difficulty,
      extraData, hash, logsBloom,
      miner, mixHash, nonce,
      parentHash, receiptsRoot, sha3Uncles,
      stateRoot, totalDifficulty, transactionsRoot,
      transactions, uncles
    } = blk.toJS()

    return (
      <div>
        <h2>
          Block {number}
        </h2>
        <div className='flex'>
          <div className='flex flex-column mr2'>
            <div className='flex'>
              <h4>Time stamp</h4>
            </div>
            <div className='flex'>
              <h4> Gas Limit </h4>
            </div>
            <div className='flex'>
              <h4> Gas Used </h4>
            </div>
            <div className='flex'>
              <h4> Size </h4>
            </div>
            <div className='flex'>
              <h4> Difficulty </h4>
            </div>
            <div className='flex'>
              <h4> Total Difficulty </h4>
            </div>
            <div className='flex'>
              <h4> Extra Data </h4>
            </div>
            <div className='flex'>
              <h4> Hash </h4>
            </div>
            <div className='flex'>
              <h4> Logs Bloom </h4>
            </div>
            <div className='flex'>
              <h4> Miner </h4>
            </div>
            <div className='flex'>
              <h4> Mix Hash </h4>
            </div>
            <div className='flex'>
              <h4> None </h4>
            </div>
            <div className='flex'>
              <h4> Parent Hash </h4>
            </div>
            <div className='flex'>
              <h4> Receipts Root </h4>
            </div>
            <div className='flex'>
              <h4> SHA3 Uncles </h4>
            </div>
            <div className='flex'>
              <h4> State Root </h4>
            </div>
            <div className='flex'>
              <h4> Transactions Root </h4>
            </div>
            <div className='flex'>
              <h4> Transactions </h4>
            </div>

            <div className='flex'>
              <h4> Uncles </h4>
            </div>

          </div>

          <div className='flex flex-column'>
            <div className='flex'> {Date(timestamp)} </div>
            <div className='flex'>{gasLimit}</div>
            <div className='flex'>{gasUsed}</div>
            <div className='flex'>{size}</div>
            <div className='flex'>{difficulty}</div>
            <div className='flex'>{totalDifficulty}</div>
            <div className='flex'>{extraData}</div>
            <div className='flex'>{hash}</div>
            <div className='flex'>{logsBloom}</div>

            <div className='flex'>{miner}</div>
            <div className='flex'>{mixHash}</div>
            <div className='flex'>{nonce}</div>
            <div className='flex'>{parentHash}</div>
            <div className='flex'>{receiptsRoot}</div>
            <div className='flex'>{sha3Uncles}</div>
            <div className='flex'>{stateRoot}</div>
            <div className='flex'>{transactionsRoot}</div>
            <div className='flex'>{transactions.length}</div>
            <div className='flex'>{uncles.length}</div>
          </div>
        </div>
      </div>
      )
  }
}

export default Reduxer(Block)
