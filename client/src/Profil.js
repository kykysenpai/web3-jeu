import React, { Component } from 'react';
import MeilleurScorePacman from './ProfilMeilleurScorePacman';
import MeilleurScoreGhost from './ProfilMeilleurScoreGhost';
import NombrePartieJouees from './ProfilNombrePartiesJouees';
import NombrePartiesGagnees from './ProfilNombrePartiesGagnee';
import NombrePartiesPerdues from './ProfilNombrePartiesPerdues';

import BoutonJouer from './ProfilBoutonJouer';

class Profile extends Component{
    render(){
        return(
            <div id="profil">
            <div className="row">
              <div className="col-xs-12 col-sm-10 col-sm-offset-1">
                <img src="images/nes.png" alt="nes" className="nes" />
              </div>
            </div>

            <MeilleurScorePacman />
            
            <MeilleurScoreGhost />
            
            <NombrePartieJouees />
            
            <NombrePartiesGagnees />

            <NombrePartiesPerdues />
      
            <BoutonJouer />
          </div>
        );
    };
}

export default Profile;