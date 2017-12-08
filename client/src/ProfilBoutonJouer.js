import React,{Component} from 'react';

import * as states from './AppState';

class ProfilBoutonJouer extends Component{
    constructor(props){
        super(props);
        this.clickPlay = this.clickPlay.bind(this);
    }

    clickPlay = () => {
        this.props.update(
            Object.assign(
                this.props.state,
                {
                    'render': states.GAME
                }
            )
        );
    }

    render(){
        return(
            <div className="row">
            <button type="submit" className="button button-block col-12" id="jouer" onClick={this.clickPlay}>Jouer</button>
            </div>
        );
    };
}

export default ProfilBoutonJouer;