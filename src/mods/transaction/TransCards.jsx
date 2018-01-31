import React from 'react'
import { Link } from 'react-router-dom'
// import { Card } from 'semantic-ui-react'

// blockHash : "0x9735172ad89583c22b170d53c84e348f3ee10142e1ed52215d92eced838b6780"
// blockNumber : 5006741
// from : "0x078A20761c4c5ac6eE20530682bD83025652D30f"
// gas : 90000
// gasPrice : "20000000000"
// hash : "0x0c0de78399a0ba8ddb099e4ad6d0572553080393fcf29386c189bbb8e5dbe241"
// input : "0x"
// nonce : 0
// r : "0x453b9b1b8b5ce0a9d1152402fca7eeaadfcfe5064cb5392ce2ce28d244a0c852"
// s : "0x70c287dc3765feeeca47605403e887d2a8eaea84c6d2569285215f7f6c4edaf6"
// to : "0xeAe7C366179556F360051cdA26A7860c43d7B848"
// transactionIndex : 66
// v : "0x25"
// value : "73493540000000000"

export default ({transaction, web3}) => {
  const {hash, blockNumber, value, from, to} = transaction.toJS()

  return (
    <div className='flex flex-column bb b--near-white mv2'>
      <Link to={`/transaction/${transaction}`}>{hash}</Link>
      <div className='flex ml2'>
        <div className='w3'>From</div>
        <div>{from}</div>
      </div>
      <div className='flex ml2'>
        <div className='w3'>To</div>
        <div>{to}</div>
      </div>
      <div className='flex ml2'>
        <div className='w3'>Value</div>
        <div>{web3.utils.fromWei(value)}</div>
      </div>
    </div>
    )
  // return (
  //   <Card fluid >
  //     <Card.Header content={hash} />
  //     <Card.Meta content={blockNumber} />
  //   </Card>
  // )

}
