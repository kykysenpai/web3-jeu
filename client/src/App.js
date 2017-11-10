import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="form">
      <img src="images/pacman.png" alt="pacman" id="pacman"/>
      <ul className="tab-group">
        <li className="tab active "><a href="#signup">Inscription</a></li>
        <li className="tab"><a href="#login">Connexion</a></li>
      </ul>
      
      <div className="tab-content">
        <div id="signup">   
          <h1>Prêt à jouer? Inscris toi !</h1>
          
          <form action="/" method="post">
          
          <div className="field-wrap">
              <label>
                  Pseudo<span className="req">*</span>
              </label>
            <input type="text" required autoComplete="off" />
          </div>

          <div className="field-wrap">
            <label>
              Adresse email<span className="req">*</span>
            </label>
            <input type="email"required autoComplete="off"/>
          </div>
          
          <div className="field-wrap">
            <label>
              Mot de passe<span className="req">*</span>
            </label>
            <input type="password"required autoComplete="off"/>
          </div>
          
          <button type="submit" className="button button-block">C'est parti!</button>
          
          </form>

        </div>
        
        <div id="login">   
          <h1>On joue?</h1>
          
          <form action="/" method="post">
          
            <div className="field-wrap">
            <label>
              Pseudo<span className="req">*</span>
            </label>
            <input type="email"required autoComplete="off"/>
          </div>
          
          <div className="field-wrap">
            <label>
              Mot de passe<span className="req">*</span>
            </label>
            <input type="password"required autoComplete="off"/>
          </div>
          
          <p className="forgot"><a href="#">Mot de passe oublié?</a></p>
          
          <button className="button button-block">Se connecter</button>
          
          </form>
        </div>  
      </div>
</div>
    );
  }
}

export default App;
