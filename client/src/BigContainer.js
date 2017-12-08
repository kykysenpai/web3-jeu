import React, { Component } from 'react';
import Accueil from './Accueil';
import Formulaires from './Formulaires';
import Profil from './Profil';
import Game from './GameComponent';

import * as states from './AppState';

import {connect} from 'react-redux';

class BigContainer extends Component{
    render(){
        console.log(this.props.stateApp);
        return(
            <div className="container col-xs-8 col-xs-offset-2">
                {this.props.stateApp.afficher === states.HOME ? (
                    <Accueil />  
                ): this.props.stateApp.afficher === states.NO_CONNECTION ? (
                    <Formulaires />
                ): this.props.stateApp.afficher === states.GAME ? (
                    <Game />
                ): this.props.stateApp === states.PROFILE ? (
                    <Profil />
                )
                :(
                    <div><p>J'ai pas compris</p></div>
                )}
            </div>
        );
    }
}

function mapStateToProps(state, ownProps){
    return{
        stateApp: state
    };
}

export default connect(mapStateToProps)(BigContainer);