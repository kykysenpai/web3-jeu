import React, { Component } from 'react';
import './App.css';
import * as states from './AppState';
import NavBar from './NavBar';
import Messages from './Messages';
import BigContainer from './BigContainer';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      "connected": false,
      "render" : states.HOME,
      "player":{}
    };
    
    this.upDateState = this.upDateState.bind(this);
  }

  upDateState = (newState) => {
    console.log(newState);
    this.setState(newState);
  }

  render() {
    return (
      <div>
        <NavBar state={this.state} upDateState={this.upDateState}/>
        <Messages state={this.state} upDateState={this.upDateState}/>
        <BigContainer state={this.state} upDateState={this.upDateState}/>
      </div>
    );
  }
}

export default App;
