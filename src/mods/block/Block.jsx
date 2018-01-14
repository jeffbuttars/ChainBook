import React from 'react'
import { Header, Button, Icon, Input, Divider } from 'semantic-ui-react'
import Reduxer from 'comp-builder/reduxer'
import * as web3Actions from 'web3/actions'
import * as blockActions from './actions'
import BlockView from './BlockView'

class Block extends React.Component {

  componentDidMount () {
    const { match: { params: { number = 'latest' } }} = this.props
    this.goToBlock(number, false)
  }

  static componentConnect = {
    state: {
      'web3': 'web3.web3:object',
      'block': ':object'
    },
    actions: {
      'web3': web3Actions,
      'block': blockActions
    }
  }

  async goToBlock (number, push = true) {
    const { web3, block, history, actions } = this.props
    let blockNumber = parseInt(number, 10)
    console.log('goToBlock', blockNumber)

    if (isNaN(blockNumber)) {
      const latestBlock = await actions.web3.getBlockNumber(web3)
      if (latestBlock.error) {
        console.error('Invalid block number and unable to get the latest block, going back to chain head.')
        history.push('/chainhead')
        return
      }

      blockNumber = latestBlock.payload
      console.warn('Invalid block number, using latest block:', blockNumber)
    }

    if (!block.has(blockNumber)) {
      actions.block.get(web3, blockNumber)
    }

    history.push(`/block/${blockNumber}`)
  }

  render () {
    const { match: { params: { number }, url } } = this.props
    const { block } = this.props
    const blk = block.getIn(['byNumber', number])

    if (blk) {
      console.log('BLOCK', blk.toJS())
    }

      return (
        <div>
          <Header size='large'>Block</Header>
          <div className='flex mv3'>
              <Button
                icon
                labelPosition='left'
                basic
                className='mr1'
                onClick={() => this.goToBlock(parseInt(number, 10) - 1)}
              >
                <Icon name='chevron left' />
                Prev
              </Button>

              <Input
                transparent
                icon='chain'
                iconPosition='left'
                loading={!blk}
                className='w4 mr1 ml2'
                value={number}
                onChange={(ev, {value}) => this.goToBlock(parseInt(value, 10))}
              />

              <Button
                icon
                labelPosition='right'
                basic
                onClick={() => this.goToBlock(parseInt(number, 10) + 1)}
              >
                <Icon name='chevron right' />
                Next
              </Button>
          </div>

          <Divider />

          {!!blk && (<BlockView {...(blk.toJS())} url={url} />)}

        </div>
        )
  }
}


export default Reduxer(Block)
