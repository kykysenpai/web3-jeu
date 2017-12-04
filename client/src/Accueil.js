import React, { Component } from 'react';

import PacmanImageMenu from './PacmanImageMenu'

import * as states from './AppState';
const axios = require('axios');

class Acceuil extends Component{
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = this.props.state;
    }
    handleClick = (ev) => {
        ev.preventDefault();
        console.log("React fait coucou -> on clic accueil");
        console.log(sessionStorage.getItem("token"));
        axios.get('/verifyLoggedIn', {
            token : sessionStorage.getItem("token")
        })
          .then((response) => {
            console.log("Session active "+sessionStorage.getItem("authName") + "   " + sessionStorage.getItem("token"));
            this.setState(Object.assign(this.state,{'render':states.PROFILE,'connected':true}));
          })
          .catch((error) => {
            sessionStorage.removeItem("authName");
            sessionStorage.removeItem("token");
            console.log("No active session");
            this.setState(Object.assign(this.state,{'render':states.NO_CONNECTION}))
            this.props.update(this.state);
          });
    }

    render(){
        return(
            <div id="acceuil center-block">
                <PacmanImageMenu />
                <div className="row">
                <div>
                    <h2>Pacman Evolution  <small>Multijoueurs</small></h2>
                        <p className="justify">Et si on repensait Pacman à la sauce multi? Un nouveau monde de possibilités où de vrais joueurs peuvent s'affronter dans divers modes de jeu. Par équipe, affrontez l'équipe adverse et exploitez au mieux votre force collective. Plutôt chacun
                        pour soi? Mesurez vous à d'autres joueurs et accumulez le plus de points afin de remporter la partie et qui sait, peut être débloquer quelque chose?</p>
                        <br/>
                        <blockquote className="blockquote-reverse">
                        <p>Ce site est le fruit d'une collaboration de six étudiants de l'Institut Paul Lambin dans le cadre du cours de Web de 3ème année.</p>
                        <footer>
                        <p className="green">Authors :
                            <abbr title="Virginia Dabrowski">fireLegacy</abbr>,
                            <abbr title="Michel de Broux">dieBrouzouf</abbr>,
                            <abbr title="Alex Hardi">tongit</abbr>,
                            <abbr title="Sébastien Place">SebbyBE</abbr>,
                            <abbr title="Kyrill Tircher">kykysenpai</abbr>,
                            <abbr title="Anthony Vancampenhault">antho.vanc</abbr>
                        </p>
                        </footer>
                        </blockquote>
                    </div>
                </div>

                <div className='row'>
                <div className="button button-block" id="loading" onClick={this.handleClick}> Enter </div>
                </div>
            </div>
        );
    }
}

export default Acceuil;