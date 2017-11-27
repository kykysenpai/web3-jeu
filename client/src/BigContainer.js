import React, { Component } from 'react';
import Accueil from './Accueil';
import Formulaires from './Formulaires';
import Profil from './Profil';
import Game from './GameComponent';

import * as states from './AppState';

import {connect} from 'react-redux';

class BigContainer extends Component{
    constructor(props){
        super(props);
        this.handler = this.handler.bind(this);
        this.state = {
            current: states.HOME
        }
    }
    handler = (constState) =>{
        this.setState({current: constState});
    }
    render(){
        console.log(this.props.stateApp);
        return(
            <div className="container col-xs-8 col-xs-offset-2">
                {this.props.stateApp === states.HOME ? (
                    <Accueil action={this.handler} />  
                ): this.props.stateApp === states.NO_CONNECTION ? (
                    <Formulaires action={this.handler} />
                ): this.props.stateApp === states.CONNECTED ? (
                    <Game action={this.handler} />
                ): this.props.stateApp === states.PROFILE ? (
                    <Profil action={this.handler} />
                )
                : null}
            </div>
        );
    }
}

function mapStateToProps(state, ownProps){
    return{
        stateApp: state.state
    };
}

export default connect(mapStateToProps)(BigContainer);