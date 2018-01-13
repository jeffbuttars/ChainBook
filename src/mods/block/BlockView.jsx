import React from 'react'
import { Grid } from 'semantic-ui-react'

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

export default ({
  number, timestamp, gasLimit,
    gasUsed, size, difficulty,
    extraData, hash, logsBloom,
    miner, mixHash, nonce,
    parentHash, receiptsRoot, sha3Uncles,
    stateRoot, totalDifficulty, transactionsRoot,
    transactions, uncles
}) => (
<div>
  <Grid columns={12} stackable verticalAlign='bottom' divided='vertically'>
    <Row name='Timestamp' value={Date(timestamp)} />
    <Row name='Gas Limit' value={gasLimit} />
    <Row name='Gas Used' value={gasUsed} />
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
    <Row name='Transactions Root' value={transactionsRoot} />
    <Row name='Transactions' value={transactions ? transactions.length : 0} />
    <Row name='SHA3 Uncles' value={sha3Uncles} />
    <Row name='Uncles' value={uncles ? uncles.length : 0} />
  </Grid>
</div>
)
