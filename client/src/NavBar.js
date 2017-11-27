import React, { Component } from 'react';

class ProfilLink extends Component{
    handleClick(){
        console.log("Afficher Profil")
    }
    render(){
        return(
            <li onClick={this.handleClick}><a id="profil"><span className="glyphicon glyphicon-user"></span>Profil</a></li>
        )
    }
}

class Deconnexion extends Component{
    handleClick(){
        console.log("disconnect.js -> on clic deconnexion");
        console.log("Contenu avant effacement : " + localStorage.getItem("authName")
        +"   "+localStorage.getItem("token"));
    }
    render(){
        return(
            <li onClick={this.handleClick}><a id="deconnexion"><span className="glyphicon glyphicon-log-out"></span>Logout</a></li>
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
  
              <ul className="nav navbar-nav navbar-right">
                <ProfilLink />
                <Deconnexion />
              </ul>
            </div>
          </nav>
      </div>
    );
  }
}

export default NavBar;
