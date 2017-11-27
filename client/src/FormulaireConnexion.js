import React,{Component} from 'react';

class FormulaireConnexion extends Component {
    render(){
        return(
        <div id="login">
            <h1>On joue?</h1>
            <div id="form">
            <div className="row">
              <label>Pseudo<span className="req">*</span></label>
              <input type="text" required autocomplete="off" id="pseudoConnexion" />
            </div>
            <div className="row">
              <label>Mot de passe<span className="req">*</span></label>
              <input type="password" required autocomplete="off" id="mdpConnexion" />
            </div>
            <div className="row no-padding">
              <div className="col-xs-6 col-sm-8 col-lg-9"></div>
              <div className="col-xs-6 col-sm-4 col-lg-3">
                <input className="col-xs-1" type="checkbox" value="remember"/>
                <label className="col-xs-11 greenLabel" for="remember">
                        Se souvenir de moi
                      </label>
              </div>
            </div>
            <div className="row">
              <button className="button button-block" id="seConnecter">Se connecter</button>
            </div>
            <div className="row">
              <button className="button button-block" id="facebookConnect">Se connecter avec Facebook</button>
            </div>
          </div>
          </div>
        );
    }
}

export default FormulaireConnexion;