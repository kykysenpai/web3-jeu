import React, { Component } from 'react';

import PacmanImageMenu from './PacmanImageMenu'

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as stateModifiers from './actions/stateActions';

import * as states from './AppState';
const axios = require('axios');

class Acceuil extends Component{
    handleClick = (ev)=>{
        var that = this;
        ev.preventDefault();
        console.log("React fait coucou -> on clic accueil");
        axios.get('/verifyLoggedIn', {
            token : localStorage.getItem("token")
        })
          .then(function (response) {
            console.log("Session active "+localStorage.getItem("authName") + "   " + localStorage.getItem("token"));
            that.props.actions.modifyRenderNC(that.props.stateApp, states.CONNECTED);
          })
          .catch(function (error) {
            localStorage.removeItem("authName");
            localStorage.removeItem("token");
            console.log("No active session");
            that.props.actions.modifyRenderNC(that.props.stateApp, states.NO_CONNECTION);
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

function mapStateToProps(state, ownProps){
    return{
        stateApp: state
    };
}

function mapDispatchToProps(dispatch){
    return{
        actions: bindActionCreators(stateModifiers, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(Acceuil);