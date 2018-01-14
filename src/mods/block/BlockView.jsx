import React from 'react'
import { Grid } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const Row = ({name, value}) => (
  <Grid.Row  className='f5 b--light-silver' verticalAlign='bottom'>
    <Grid.Column width={2} className='b' verticalAlign='bottom'>
      {name}
    </Grid.Column>
    <Grid.Column width={10} verticalAlign='bottom' >
      {value}
    </Grid.Column>
  </Grid.Row>
)

const Gas = ({limit, used}) => {
  const gasPercentage = ((used / limit) * 100).toPrecision(3);

  return (
    <div className='flex flex-column'>
      <div className='flex'>
        <div className='b pr2'>Limit</div> <div> {limit} </div>
      </div>
      <div className='flex'>
        <div className='b mr2'>Used</div>
        <div className='mr2'>{used}</div>
        <div className='b mr1'>(%</div><div>{gasPercentage})</div>
      </div>
    </div>
  )
}

export default ({
  number, gasLimit,
    gasUsed, size, difficulty,
    extraData, hash, logsBloom,
    miner, mixHash, nonce,
    parentHash, receiptsRoot, sha3Uncles,
    stateRoot, totalDifficulty, transactionsRoot,
    transactions, uncles, url
}) => {
  const transLink = (<Link to={`${url}/transactions`}>{transactions ? transactions.length : 0}</Link>)

  return (
    <div>
      <Grid columns={12} stackable verticalAlign='bottom' divided='vertically'>
        <Row name='Gas' value={<Gas limit={gasLimit} used={gasUsed} />} />
        <Row name='Transactions' value={transLink} />
        <Row name='Transactions Root' value={transactionsRoot} />
        <Row name='Size' value={size} />
        <Row name='Difficulty' value={difficulty} />
        <Row name='Total Difficulty' value={totalDifficulty} />
        <Row name='Extra Data' value={extraData} />
        <Row name='Hash' value={hash} />
        <Row name='Logs Bloom' value={logsBloom} />
        <Row name='Miner' value={miner} />
        <Row name='Mix Hash' value={mixHash} />
        <Row name='Receipts Root' value={receiptsRoot} />
        <Row name='State Root' value={stateRoot} />
        <Row name='SHA3 Uncles' value={sha3Uncles} />
        <Row name='Uncles' value={uncles ? uncles.length : 0} />
      </Grid>
    </div>
    )}
