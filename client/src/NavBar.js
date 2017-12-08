import React, { Component } from 'react';
import axios from 'axios';
import * as states from './AppState';

class ProfilLink extends Component{
    handleClick = (ev) => {
        ev.preventDefault();
        var newState = this.props.state;
        axios.post('infoPlayer',{
            authName:localStorage.getItem("authName")
          }).then((response) =>{
            newState = Object.assign(newState,{'render':states.PROFILE,
              'player':{
                'login':response.data.login,
                "currentGhost": response.data.currentGhost,
                "currentPacman": response.data.currentPacman,
                "bestScoreGhost": response.data.bestScoreGhost,
                "bestScorePacman": response.data.bestScorePacman,
                "nbPlayedGames": response.data.nbPlayedGames,
                "nbVictory": response.data.nbVictory,
                "nbDefeat": response.data.nbDefeat,
                "ghostSkins": response.data.ghostSkins,
                "pacmanSkins": response.data.pacmanSkins
              }
            })
            this.props.update(newState);
          }).catch((err)=>{
            console.error(err);
          });
        this.props.update(
            Object.assign(
                this.props.state,
                {'render':states.PROFILE}
            )
        );
    }
    render(){
        return(
            <li onClick={this.handleClick}><a href="" id="profil"><span className="glyphicon glyphicon-user"></span>Profil</a></li>
        )
    }
}

class Deconnexion extends Component{
    handleClick = (ev) => {
        ev.preventDefault();
        axios.get('/deconnecter',{
            token:sessionStorage.getItem('token')
            }
        ).then(() => {
            sessionStorage.removeItem('authName');
            sessionStorage.removeItem('token');
            localStorage.removeItem('authName');
            localStorage.removeItem('token');
            this.props.update(
                Object.assign(
                    this.props.state,
                    {
                        connected: false,
                        render:states.HOME,
                        player:{}
                    }
                )
            )
            window.location.reload();
        }).catch((err) => {
            console.error(err);
        });
    }
    render(){
        return(
            <li onClick={this.handleClick}><a href="" id="deconnexion"><span className="glyphicon glyphicon-log-out"></span>Logout</a></li>
        )
    }
}


class NavBar extends Component {
  render() {
    return (
        <div id="menubar">
        <nav className="navbar navbar-inverse colorbar">
            <div className="container-fluid">
              <div className="navbar-header">
                <a className="navbar-brand" href="/">Pacman Evolution</a>
              </div>
  
                {this.props.state.connected === true ? (
                    <ul className="nav navbar-nav navbar-right">
                        <ProfilLink state={this.props.state} update={this.props.upDateState}/>
                        <Deconnexion state={this.props.state} update={this.props.upDateState}/>
                    </ul>
                ):null}
            </div>
          </nav>
      </div>
    );
  }
}

export default NavBar;
