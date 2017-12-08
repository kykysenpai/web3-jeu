import React,{Component} from 'react';
import axios from 'axios';

import * as states from './AppState';

class FormulaireInscription extends Component {
    constructor(props){
        super(props);
        this.state={
            login: "",
            mdp: ""
          };
        this.textInputChanged = this.textInputChanged.bind(this);
        this.register = this.register.bind(this);
    }
    register = (ev) =>{
        ev.preventDefault();
        console.log("je dois encore faire des trucs");
        console.log(this.state.login);
        console.log(this.state.mdp);
        axios.post(
            '/sInscrire',
            {
                login:this.state.login,
                passwd:this.state.mdp
            }
        ).then(
            axios.post('/seConnecter',{
                login:this.state.login,
                passwd:this.state.mdp
              }).then((result) =>{
                console.log(result);
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
              })
        ).catch((err) => {
            console.error(err);
        });
    }
    textInputChanged(ev) {
        this.setState({[ev.target.id]: ev.target.value});
    }
    render(){
        return(
            <div id="signup">
                <h1>Prêt à jouer? Inscis toi!</h1>
                <div id="messageInscription"></div>

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
                    <button type="submit" className="button button-block" id="sInscrire" onClick={this.register}>C'est parti!</button>
                </div>

                </div>
            </div>
        );
    }
}

export default FormulaireInscription;