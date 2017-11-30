import React,{Component} from 'react';

//import {connect} from 'react-redux';

class FormulaireInscription extends Component {
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
    handleChangeId(ev){
        this.setState({id:ev.target.value});
    }
    handleChangeMdp(ev){
        this.setState({mdp:ev.target.value});
    }
    render(){
        return(
            <div id="signup">
                <h1>Prêt à jouer? Inscis toi!</h1>
                <div id="messageInscription"></div>

                <div id="form">

                <div className="row">
                    <label>Pseudo<span className="req">*</span></label>
                    <input type="text" required autoComplete="off" id="pseudoInscription" value={this.state.id} onChange={this.handleChangeId}/>
                </div>

                <div className="row">
                    <label>Mot de passe<span className="req">*</span></label>
                    <input type="password" required autoComplete="off" id="mdpInscription" value={this.state.mdp} onChange={this.handleChangeMdp}/>
                </div>

                <div className="row">
                    <button type="submit" className="button button-block" id="sInscrire" onClick={this.handleClick}>C'est parti!</button>
                </div>

                </div>
            </div>
        );
    }
}

export default FormulaireInscription;