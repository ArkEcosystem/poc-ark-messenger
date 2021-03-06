import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';

import './assets/scss/index.scss';
import './icons';
import 'bootstrap';
import 'popper.js';
import 'animate.css';

import { configManager } from '@arkecosystem/crypto/dist/managers';

configManager.setConfig({
  network: require('./network/network.json'),
  genesisBlock: require('./network/genesisBlock.json'),
  exceptions: require('./network/exceptions.json'),
  milestones: require('./network/milestones.json')
});
configManager.setHeight(2);

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
