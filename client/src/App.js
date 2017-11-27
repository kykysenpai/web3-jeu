import React, { Component } from 'react';
import './App.css';
import NavBar from './NavBar';
import Messages from './Messages';
import BigContainer from './BigContainer';

class App extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <Messages />
        <BigContainer />
      </div>
    );
  }
}

export default App;
