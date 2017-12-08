import React,{Component} from 'react';

class FormulaireConnexion extends Component {
  constructor(props){
    super(props);
    this.state={id:"",mdp:""};
    this.handleClick = this.handleClick.bind(this);
    this.handleChangeId = this.handleChangeId.bind(this);
    this.handleChangeMdp = this.handleChangeMdp.bind(this);
  }

  handleClick = (ev) =>{
    ev.preventDefault();
    console.log("je dois encore faire des trucs");
    console.log(this.state.id);
    console.log(this.state.mdp);
  }
  handleClickFacebook = (ev) =>{
    ev.preventDefault();
    console.log("Je dois encore faire des trucs FB")
  }
  handleChangeId(ev){
    this.setState({id:ev.target.value});
  }
  handleChangeMdp(ev){
    this.setState({mdp:ev.target.value});
  }
    render(){
        return(
        <div id="login">
            <h1>On joue?</h1>
            <div id="form">
            <div className="row">
              <label>Pseudo<span className="req">*</span></label>
              <input type="text" required autoComplete="off" id="pseudoConnexion" value={this.state.id} onChange={this.handleChangeId}/>
            </div>
            <div className="row">
              <label>Mot de passe<span className="req">*</span></label>
              <input type="password" required autoComplete="off" id="mdpConnexion" value={this.state.mdp} onChange={this.handleChangeMdp}/>
            </div>
            <div className="row no-padding">
              <div className="col-xs-6 col-sm-8 col-lg-9"></div>
              <div className="col-xs-6 col-sm-4 col-lg-3">
                <input className="col-xs-1" type="checkbox" value="remember"/>
                <label className="col-xs-11 greenLabel" htmlFor="remember">
                        Se souvenir de moi
                      </label>
              </div>
            </div>
            <div className="row">
              <button className="button button-block" id="seConnecter" onClick={this.handleClick}>Se connecter</button>
            </div>
            <div className="row">
              <button className="button button-block" id="facebookConnect" onClick={this.handleClickFacebook}>Se connecter avec Facebook</button>
            </div>
          </div>
          </div>
        );
    }
}

export default FormulaireConnexion;