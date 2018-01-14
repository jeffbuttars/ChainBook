import React from 'react'
import { withRouter } from 'react-router'
import { Route, Switch } from 'react-router-dom'
import TopBar from './TopBar'
import Home from 'home'
import Inspector from 'inspector'
import ChainHead from 'chainHead'
import Block from 'block'
// import Footer from './Footer'
// import SideBarContent from './SideBar'


// class UnAuthed extends React.Component {
//   constructor (props) {
//     super(props)

//     this.state = {
//       sideBarOpen: true
//     }
//   }

//   toggleSideBar () {
//     // console.log('toggleSideBar', this.state.sideBarOpen)
//     this.setState(state => ({sideBarOpen: !state.sideBarOpen}))
//   }

//   render () {
//     const {sideBarOpen} = this.state

//     return (
//       <div className='bg-white'>
//         <TopBar handleSideBarToggle={this.toggleSideBar.bind(this)}/>
//         <Sidebar.Pushable >
//           <Sidebar
//             as={Segment}
//             visible={sideBarOpen}
//             animation='push'
//             direction='left'
//             inverted
//             vertical
//             basic
//           >
//           <SideBarContent />
//           </Sidebar>
//           <Sidebar.Pusher as={Container} className='mt5'>

//               <div>
//                 <Switch>
//                   <Route exact path='/inspector' component={Inspector} />
//                   <Route component={Home} />
//                 </Switch>
//               </div>

//               <Footer />
//           </Sidebar.Pusher>
//         </Sidebar.Pushable>
//         </div>
//         )
//   }
// }

class UnAuthed extends React.Component {
  render () {
    return (
      <div className='bg-white pa0 ma0'>
        <TopBar />

        <div className='mt5 pl3 pt2'>
          <Switch>
            <Route exact path='/inspector' component={Inspector} />
            <Route exact path='/chainhead' component={ChainHead} />
            <Route
              path='/block'
              render={props => <Block {...props} />}
            />
            <Route component={Home} />
          </Switch>

          {/* <Footer /> */}
        </div>
      </div>
      )
      }
    }

export default withRouter(UnAuthed)
