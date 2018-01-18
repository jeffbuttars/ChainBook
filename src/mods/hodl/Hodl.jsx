import React from 'react'
import Reduxer from 'comp-builder/reduxer'
import * as hodlActions from './actions'

class Hodl extends React.Component {
  static componentConnect = {
    state: {
      'hodl': ':object'
    },
    actions: {
      'hodl': hodlActions
    }
  }

  async componentDidMount () {
    const {actions, hodl} = this.props
    // console.log('HODL!!!!', hodl.toJS())

    const action = await actions.hodl.getDailyHistory('ETH')
    // console.log('HODL result', action)
  }

  render () {
    const {hodl} = this.props
    const data = hodl.getIn(['ETH', 'byDay'], [])
    console.log('HODL!!!!', hodl.toJS())

    return (
      <div>
        <div className='b f1 mv3'>HODL</div>
        {data.reduce((p, v) => p.concat(<div key={v.time} className='pv1'>{v.close}</div>), [])}
      </div>
      )
  }
}

export default Reduxer(Hodl)
