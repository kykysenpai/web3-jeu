import React, { Component } from 'react';
import MeilleurScorePacman from './ProfilMeilleurScorePacman';
import MeilleurScoreGhost from './ProfilMeilleurScoreGhost';
import NombrePartieJouees from './ProfilNombrePartiesJouees';
import NombrePartiesGagnees from './ProfilNombrePartiesGagnee';
import NombrePartiesPerdues from './ProfilNombrePartiesPerdues';
import BoutonJouer from './ProfilBoutonJouer';
import BoutonShare from './ProfilButtonShareFb';

class Profile extends Component{
    render(){
        return(
            <div id="profil">
            <div className="row">
              <div className="col-xs-12 col-sm-10 col-sm-offset-1">
                <img src="images/nes.png" alt="nes" className="nes" />
              </div>
            </div>

            <MeilleurScorePacman score={this.props.state.player.bestScorePacman}/>
            
            <MeilleurScoreGhost score={this.props.state.player.bestScoreGhost}/>
            
            <NombrePartieJouees score={this.props.state.player.nbPlayedGames}/>
            
            <NombrePartiesGagnees score={this.props.state.player.nbVictory}/>

            <NombrePartiesPerdues score={this.props.state.player.nbPlayedGames - this.props.state.player.nbVictory}/>
      
            <BoutonJouer state={this.props.state} update={this.props.update}/>

            <BoutonShare state={this.props.state} update={this.props.update}/>
          </div>
        );
    };
}

export default Profile;