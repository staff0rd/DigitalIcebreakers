import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import history from './history';
import ReactAI from 'react-appinsights';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

ReactAI.init({ instrumentationKey: '96f93683-084f-441d-ac17-e848ff8cb6ac' }, history);

ReactDOM.render(
  <Router basename={baseUrl} history={history}>
    <App />
  </Router>,
  rootElement);

registerServiceWorker();
