import React,{Component} from 'react';

class ProfilSkinPacmanCourant extends Component{
    render(){
        return(
            <div className="row no-padding no-padding-bottom">
            <div className="col-xs-7 col-sm-6 col-md-4 col-lg-3">
              <p className="label label-default">Skin Pacman courant : </p>
            </div>
            <div className="col-xs-5 col-sm-7 col-md-8 col-lg-9">
              <p className="skinCurrentPacman col-1">
                <img alt="default" src="images/icone_pacman.ico" className="img-rounded img-responsive skin-defaut" />
              </p>
            </div>
          </div>
          <div className="row no-padding no-padding-bottom">
            <div className="col-12">
              <p>Sélectionnez un skin disponible pour changer l'actuel</p>
            </div>
            <div className="col-xs-12 col-sm-12">
              <p className="skinsPacman">
                <img alt="default" src="images/icone_pacman.ico" className="col-1 img-rounded img-responsive skins-gallery" />
              </p>
            </div>
          </div>
        );
    };
}

export default ProfilSkinPacmanCourant;