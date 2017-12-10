import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import * as states from './AppState';
import NavBar from './NavBar';
import BigContainer from './BigContainer';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      "connected": false,
      "render" : states.HOME,
      "player":{}
    };
    this.message = "";

    this.alrdeadyLoaded = false;
    
    this.upDateState = this.upDateState.bind(this);

    this.notifyError = this.notifyError.bind(this);
    this.notifyInfo = this.notifyInfo.bind(this);
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

  notifyError = (msg) => {
    toast.error(msg, {
      position: toast.POSITION.TOP_CENTER
    });
  };

  notifyInfo = (msg) => {
    toast.info(msg, {
      position: toast.POSITION.TOP_CENTER
    });
  }

  render() {
    return (
      <div>
        <ToastContainer />
        <NavBar state={this.state} upDateState={this.upDateState}/>
        <BigContainer state={this.state} upDateState={this.upDateState} loaded={this.alrdeadyLoaded} notifyError={this.notifyError} notifyInfo={this.notifyInfo}/>
      </div>
    );
  }
}

export default App;
