import React,{Component} from 'react';
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';

import * as states from '../AppState';

import { ToastContainer} from 'react-toastify';

class FormulaireConnexion extends Component {
  constructor(props){
    super(props);
    this.state={
      login: "",
      mdp: "",
      fbLogin:"",
      fbmdp:""
    };
    this.login = this.login.bind(this);
    this.textInputChanged = this.textInputChanged.bind(this);
    this.responseFacebook = this.responseFacebook.bind(this);
  }

  login = (ev) =>{
    ev.preventDefault();
    axios.post('/seConnecter',{
      login:this.state.login,
      passwd:this.state.mdp
    }).then((result) =>{
      window.sessionStorage.setItem("authName",result.data.authName);
      window.sessionStorage.setItem("token",result.data.token);
      window.localStorage.setItem("authName",result.data.authName);
      window.localStorage.setItem("token",result.data.token);
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
      this.props.notifyError("Le nom d'utilisateur ou le mot de passe ne sont pas valide");
    }
    );
  }

  responseFacebook = (data) =>{
    this.setState({fbLogin:data.id+'-'+data.name,fbmdp:data.id});
    axios.post('/sInscrire',{
      login:this.state.fbLogin,
      passwd:this.state.fbmdp
    });
    axios.post('/seConnecter',{
      login:this.state.fbLogin,
      passwd:this.state.fbmdp
    }).then((result) =>{
      sessionStorage.setItem("authName",result.data.authName);
      sessionStorage.setItem("token",result.data.toker);
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
      this.props.notifyError("Un problème est survenu avec la connection Facebook");
    });
  }

  textInputChanged(ev) {
    this.setState({[ev.target.id]: ev.target.value});
  }

    render(){
        return(
        <div id="login">
            <ToastContainer />
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
                <div className="row">
                  <button className="button button-block" id="seConnecter" onClick={this.login}>Se connecter</button>
                </div>
                <div className="row">
                  <FacebookLogin
                  appId="264160964107154"
                  autoLoad={false}
                  fields="name,email,picture"
                  callback={this.responseFacebook}
                  icon="fa-facebook"
                  />
                </div>
            </div>
        </div>
        );
    }
}

export default FormulaireConnexion;