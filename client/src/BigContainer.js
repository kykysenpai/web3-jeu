import React, { Component } from 'react';
import Accueil from './Accueil';
import Formulaires from './Formulaires';
import Profil from './Profil';
import Game from './GameComponent';

class BigContainer extends Component{
    render(){
        return(
            <div className="container col-xs-8 col-xs-offset-2">
                <Accueil />
                <Formulaires />
                <Profil />
                <Game />
            </div>
        );
    }
}

export default BigContainer;