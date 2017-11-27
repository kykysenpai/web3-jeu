import React,{Component} from 'react';

class ProfilSkinGhostCourant extends Component{
    render(){
        return(
            <div className="row no-padding no-padding-bottom">
            <div className="col-xs-7 col-sm-6 col-md-4 col-lg-3">
              <p className="label label-default">Skin Ghost courant : </p>
            </div>
            <div className="col-xs-12 col-sm-12">
              <p className="skinCurrentGhost"></p>
            </div>
          </div>
          <div className="row no-padding">
            <div className="col-12">
              <p>Sélectionnez un skin disponible pour changer l'actuel</p>
            </div>
            <div className="col-xs-5 col-sm-7 col-md-8 col-lg-9">
              <p className="skinsGhost"></p>
            </div>
          </div>
        );
    };
}

export default ProfilSkinGhostCourant;