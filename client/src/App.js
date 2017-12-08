import React, { Component } from 'react';
import './App.css';
import * as states from './AppState';
import NavBar from './NavBar';
import Messages from './Messages';
import BigContainer from './BigContainer';


//import G from './GameComponent';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      "connected": false,
      "render" : states.HOME,
      "player":{}
    };
    this.alrdeadyLoaded = false;
    
    this.upDateState = this.upDateState.bind(this);
  }

  upDateState = (newState) => {
    if(this.alrdeadyLoaded){
      this.alrdeadyLoaded=false;
    }
    if(newState.render === states.GAME){
      this.alrdeadyLoaded=true;
    }
    this.setState(newState);
  }

  render() {
    /*
      <NavBar state={this.state} upDateState={this.upDateState}/>
        <Messages state={this.state} upDateState={this.upDateState}/>
        <BigContainer state={this.state} upDateState={this.upDateState} loaded={this.alrdeadyLoaded}/>
    */
    return (
      <div>
        <NavBar state={this.state} upDateState={this.upDateState}/>
        <Messages state={this.state} upDateState={this.upDateState}/>
        <BigContainer state={this.state} upDateState={this.upDateState} loaded={this.alrdeadyLoaded}/>
      </div>
    );
  }
}

export default App;
