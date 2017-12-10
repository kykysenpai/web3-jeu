import React, {Component} from 'react';
import * as states from './AppState';
const axios = require('axios');

class ButtonEnterAccueil extends Component{

    handleClick = (ev)=>{
        ev.preventDefault();
        console.log("React fait coucou -> on clic accueil");
        axios.get('/verifyLoggedIn', {
            token : localStorage.getItem("token")
        })
          .then(function (response) {
            console.log("Session active "+localStorage.getItem("authName") + "   " + localStorage.getItem("token"));
            this.props.action(states.CONNECTED);
          })
          .catch(function (error) {
            localStorage.removeItem("authName");
            localStorage.removeItem("token");
            console.log("No active session");
            this.props.action(states.NO_CONNECTION);
          });
    }

    render(){
        return(
            <div className='row'>
                <div className="button button-block" id="loading" onClick={this.handleClick}> Enter </div>
            </div>
        );
    }
}

export default ButtonEnterAccueil;