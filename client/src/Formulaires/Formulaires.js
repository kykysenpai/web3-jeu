import React,{Component} from 'react';

import PacmanImageMenu from '../PacmanImageMenu';
import FormulaireInscription from './FormulaireInscription';
import FormulaireConnexion from './FormulaireConnexion';

class Formulaires extends Component {
    constructor(props){
        super(props);
        this.state = {
            isInscriptionOpen: true
        }
    }

    handleTabChange = (ev) => {
        ev.preventDefault();
        ev.target.id === "inscription" ? this.setState({isInscriptionOpen: true}) : this.setState({isInscriptionOpen: false});
    }

    render(){
        return(
            <div id="formulaires">
                <PacmanImageMenu />
                <ul className="tab-group">
                    <li className={this.state.isInscriptionOpen ? "tab active" : "tab"}><a id="inscription" onClick={this.handleTabChange}>Inscription</a></li>
                    <li className={this.state.isInscriptionOpen ? "tab" : "tab active"}><a id="connexion" onClick={this.handleTabChange}>Connexion</a></li>
                </ul>
                <div className="tab-content">
                    {this.state.isInscriptionOpen ? <FormulaireInscription state={this.props.state} update={this.props.update} notifyError={this.props.notifyError} info={this.props.info}/>
                        : <FormulaireConnexion state={this.props.state} update={this.props.update} notifyError={this.props.notifyError}/> }
                </div>
            </div>
        );
    }
}

export default Formulaires;