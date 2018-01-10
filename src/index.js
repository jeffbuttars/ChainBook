import React from 'react';
import ReactDOM from 'react-dom';
import { Map } from 'immutable'
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { reducers as modReducers } from 'mods'
import Store from './store'
import { addReducer } from './store/reducer'

// Add reducers before creating the store
addReducer(Map(modReducers))
const store = Store()

ReactDOM.render(<App store={store}/>, document.getElementById('root'));
registerServiceWorker();
