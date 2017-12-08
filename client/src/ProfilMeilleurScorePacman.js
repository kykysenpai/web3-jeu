import React,{Component} from 'react';

class ProfilMeilleurScorePacman extends Component{
    constructor(props){
        super(props);
        this.state = {
            meilleurScorePacman : 0
        }
    }
    render(){
        return(
            <div className="row no-padding">
            <div className="col-xs-7 col-sm-6 col-md-4 col-lg-3">
              <p className="label label-default"><span className="glyphicon glyphicon-star"></span> Meilleur score Pacman : {this.state.meilleurScorePacman}</p>
            </div>
            <div className="col-xs-5 col-sm-7 col-md-8 col-lg-9">
              <p className="statsvalues"></p>
            </div>
          </div>
        );
    };
}

export default ProfilMeilleurScorePacman;