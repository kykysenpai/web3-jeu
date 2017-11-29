import React,{Component} from 'react';

class ProfilNombrePartieJouees extends Component{
    constructor(props){
        super(props);
        this.state = {
            nombrePartieJouees: 0
        }
    }
    
    render(){
        return(
            <div className="row no-padding">
            <div className="col-xs-7 col-sm-6 col-md-4 col-lg-3">
              <p className="label label-default"><span className="glyphicon glyphicon-expand"></span> Nombre de parties jouées : {this.state.nombrePartieJouees}</p>
            </div>
            <div className="col-xs-5 col-sm-7 col-md-8 col-lg-9">
              <p className="statsvalues"></p>
            </div>
          </div>
        );
    }
}

export default ProfilNombrePartieJouees;