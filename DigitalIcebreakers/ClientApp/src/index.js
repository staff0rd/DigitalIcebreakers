import "./layout/assets/css/material-dashboard-react.css?v=1.8.0";
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import App from './App';
import history from './history';
import ReactAI from './app-insights-deprecated';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

ReactAI.init({ instrumentationKey: 'appInsightsKey' }, history);

ReactDOM.render(
  <Router basename={baseUrl} history={history}>
    <App />
  </Router>,
  rootElement);

//registerServiceWorker();
