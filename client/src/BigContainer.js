import React, { Component } from 'react';
import Accueil from './BigContainer/Accueil';
import Formulaires from './Formulaires/Formulaires';
import Profil from './Profil/Profil';
import Game from './BigContainer/GameComponent';

import * as states from './AppState';

class BigContainer extends Component{
    constructor(props){
        super(props);
        this.update = this.props.upDateState.bind(this);
    }

    render(){
        return(
            <div className="container col-xs-8 col-xs-offset-2">
                {this.props.state.render === states.HOME ? (
                    <Accueil state={this.props.state} update={this.update}/>  
                ): this.props.state.render === states.NO_CONNECTION ? (
                    <Formulaires state={this.props.state} update={this.update} notifyError={this.props.notifyError} info={this.props.notifyInfo}/>
                ): this.props.state.render === states.GAME ? (
                    <Game />
                ): this.props.state.render === states.PROFILE ? (
                    <Profil state={this.props.state} update={this.update}/>
                )
                :(
                    <div><p>J'ai pas compris</p></div>
                )}
            </div>
        );
    }
}

export default BigContainer;