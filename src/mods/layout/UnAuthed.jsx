import React from 'react'
import { withRouter } from 'react-router'
import { Route, Switch } from 'react-router-dom'

import { Container } from 'semantic-ui-react'
import Footer from './Footer'
import TopBar from './TopBar'
import Home from 'home'
import Inspector from 'inspector'

const UnAuthed = () => (
  <div className='bg-white'>
    <TopBar />
      <Container className='mt5'>

        <div>
          <Switch>
            <Route exact path='/inspector' component={Inspector} />
            <Route component={Home} />
          </Switch>
        </div>

        <Footer />
      </Container>
  </div>
)

export default withRouter(UnAuthed)
