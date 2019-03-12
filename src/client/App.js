import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Routes from './config/routes';
import './app.scss';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    );
  }
}

export default App;
