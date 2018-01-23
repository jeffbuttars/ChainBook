import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
// import logo from './logo.svg';
import 'semantic-ui-css/semantic.min.css'
import 'cryptofont/css/cryptofont.min.css'
import './css/semantic.flatly.min.css'
// import './css/semantic.journal.min.css'
import Layout from 'layout'
import './App.css';

// class App extends Component {
//   render() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <h1 className="App-title">Welcome to React</h1>
//         </header>
//         <p className="App-intro">
//           To get started, edit <code>src/App.js</code> and save to reload.
//         </p>
//       </div>
//     );
//   }
// }

export default ({ store }) => (
  <Provider store={store}>
    <Router>
      <Route component={Layout} />
    </Router>
  </Provider>
)

// :vim set ft=jsx.javascript :
