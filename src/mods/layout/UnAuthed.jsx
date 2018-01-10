import React from 'react'
import { withRouter } from 'react-router'
import { Route, Switch } from 'react-router-dom'

import { Container, Segment, Sidebar } from 'semantic-ui-react'
import Footer from './Footer'
import TopBar from './TopBar'
import SideBarContent from './SideBar'
import Home from 'home'
import Inspector from 'inspector'


class UnAuthed extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      sideBarOpen: false
    }
  }

  toggleSideBar () {
    // console.log('toggleSideBar', this.state.sideBarOpen)
    this.setState(state => ({sideBarOpen: !state.sideBarOpen}))
  }

  render () {
    const {sideBarOpen} = this.state

    return (
      <div className='bg-white'>
        <TopBar handleSideBarToggle={this.toggleSideBar.bind(this)}/>
        <Sidebar.Pushable >
          <Sidebar
            as={Segment}
            visible={sideBarOpen}
            animation='push'
            direction='left'
            inverted
            vertical
            basic
          >
          <SideBarContent />
          </Sidebar>
          <Sidebar.Pusher as={Container} className='mt5'>

              <div>
                <Switch>
                  <Route exact path='/inspector' component={Inspector} />
                  <Route component={Home} />
                </Switch>
              </div>

              <Footer />
          </Sidebar.Pusher>
        </Sidebar.Pushable>
        </div>
        )
  }
}

export default withRouter(UnAuthed)
