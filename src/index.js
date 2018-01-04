import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Store from './store'

// Add reducers before creating the store
const store = Store()

ReactDOM.render(<App store={store}/>, document.getElementById('root'));
registerServiceWorker();

