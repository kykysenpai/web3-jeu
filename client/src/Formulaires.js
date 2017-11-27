import React,{Component} from 'react';

import PacmanImageMenu from './PacmanImageMenu';
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
                    <li className="tab active"><a id="inscription" onClick={this.handleTabChange}>Inscription</a></li>
                    <li className="tab"><a id="connexion" onClick={this.handleTabChange}>Connexion</a></li>
                </ul>
                <div className="tab-content">
                    {this.state.isInscriptionOpen ? <FormulaireInscription /> : <FormulaireConnexion /> }
                </div>
            </div>
        );
    }
}

export default Formulaires;