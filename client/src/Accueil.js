import React, { Component } from 'react';

import PacmanImageMenu from './PacmanImageMenu'
import ButtonEnterAccueil from './ButtonEnterAccueil'

class Acceuil extends Component{
    render(){
        return(
            <div id="acceuil center-block">
                <PacmanImageMenu />
                <div className="row">
                <div>
                    <h2>Pacman Evolution  <small>Multijoueurs</small></h2>
                        <p className="justify">Et si on repensait Pacman à la sauce multi? Un nouveau monde de possibilités où de vrais joueurs peuvent s'affronter dans divers modes de jeu. Par équipe, affrontez l'équipe adverse et exploitez au mieux votre force collective. Plutôt chacun
                        pour soi? Mesurez vous à d'autres joueurs et accumulez le plus de points afin de remporter la partie et qui sait, peut être débloquer quelque chose?</p>
                        <br/>
                        <blockquote className="blockquote-reverse">
                        <p>Ce site est le fruit d'une collaboration de six étudiants de l'Institut Paul Lambin dans le cadre du cours de Web de 3ème année.</p>
                        <footer>
                        <p className="green">Authors :
                            <abbr title="Virginia Dabrowski">fireLegacy</abbr>,
                            <abbr title="Michel de Broux">dieBrouzouf</abbr>,
                            <abbr title="Alex Hardi">tongit</abbr>,
                            <abbr title="Sébastien Place">SebbyBE</abbr>,
                            <abbr title="Kyrill Tircher">kykysenpai</abbr>,
                            <abbr title="Anthony Vancampenhault">antho.vanc</abbr>
                        </p>
                        </footer>
                        </blockquote>
                    </div>
                </div>
                <ButtonEnterAccueil />
            </div>
        );
    }
}

export default Acceuil;