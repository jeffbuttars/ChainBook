import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { withRouter } from 'react-router'
import Block from './Block'
import Transactions from './Transactions'

const BlockRouter = ({match}) => {
  return (
    <Switch>
      <Route path={`${match.url}/:number/transactions`} component={Transactions}/>
      <Route path={`${match.url}/:number`} component={Block}/>
    </Switch>
  )
}

export default withRouter(BlockRouter)
