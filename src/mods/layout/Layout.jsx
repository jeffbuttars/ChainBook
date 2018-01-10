import React from 'react'
import UnAuthed from './UnAuthed'


// Bring in and process site wide project specific css here.
// require('!!style-loader!css-loader!postcss-loader!style/semantic/dist/semantic.min.css')
// require('!style-loader!css-loader!postcss-loader!style/tachs.css')

class Layout extends React.Component {
  render () {
    // When user accounts are added, this will have the logic to determine which UI to display
    // based on authentication state.
    // For now, we only have un authenticated site so we pass it through
    return <UnAuthed />
  }
}

export default Layout
