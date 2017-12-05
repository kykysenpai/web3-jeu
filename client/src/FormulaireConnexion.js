import React,{Component} from 'react';
import axios from 'axios';

import * as states from './AppState';

class FormulaireConnexion extends Component {
  constructor(props){
    super(props);
    this.state={
      login: "",
      mdp: ""
    };
    this.login = this.login.bind(this);
    this.textInputChanged = this.textInputChanged.bind(this);
  }

  login = (ev) =>{
    ev.preventDefault();
    axios.post('/seConnecter',{
      login:this.state.login,
      passwd:this.state.mdp
    }).then((result) =>{
      console.log(result);
      window.sessionStorage.setItem("authName",result.data.authName);
      window.sessionStorage.setItem("token",result.data.token);
      this.props.update(
        Object.assign(
          this.props.state,
          {'connected':true,
          'render':states.PROFILE,
          'player':{
              'login':result.data.authName,
              "currentGhost": result.data.currentGhost,
              "currentPacman": result.data.currentPacman,
              "bestScoreGhost": result.data.bestScoreGhost,
              "bestScorePacman": result.data.bestScorePacman,
              "nbPlayedGames": result.data.nbPlayedGames,
              "nbVictory": result.data.nbVictory,
              "nbDefeat": result.data.nbDefeat,
              "ghostSkins": result.data.ghostSkins,
              "pacmanSkins": result.data.pacmanSkins
          }
        })
      );
    }).catch((err) => {
      console.log(err);
    }
    );
    
  }
  loginFacebook = (ev) =>{
    ev.preventDefault();
    console.log("Je dois encore faire des trucs FB")
  }

  textInputChanged(ev) {
    this.setState({[ev.target.id]: ev.target.value});
  }

    render(){
        return(
        <div id="login">
            <h1>On joue?</h1>
            <div id="form">
            <div className="row">
              <label>Pseudo<span className="req">*</span></label>
              <input type="text" required autoComplete="off" id="login" value={this.state.id} onChange={this.textInputChanged}/>
            </div>
            <div className="row">
              <label>Mot de passe<span className="req">*</span></label>
              <input type="password" required autoComplete="off" id="mdp" value={this.state.mdp} onChange={this.textInputChanged}/>
            </div>
            <div className="row no-padding">
              <div className="col-xs-6 col-sm-8 col-lg-9"></div>
              <div className="col-xs-6 col-sm-4 col-lg-3">
                <input className="col-xs-1" type="checkbox" value="remember"/>
                <label className="col-xs-11 greenLabel" htmlFor="remember">
                        Se souvenir de moi
                      </label>
              </div>
            </div>
            <div className="row">
              <button className="button button-block" id="seConnecter" onClick={this.login}>Se connecter</button>
            </div>
            <div className="row">
              <button className="button button-block" id="facebookConnect" onClick={this.loginFacebook}>Se connecter avec Facebook</button>
            </div>
          </div>
          </div>
        );
    }
}

export default FormulaireConnexion;