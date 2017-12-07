import React,{Component} from 'react';
//import Script from 'react-load-script';
import Iframe from 'react-iframe';

//import RS from 'react-phaser';

class GameComponent extends Component{
    render(){
        //<!--<Script url={process.env.PUBLIC_URL + "/js/main.js"} attributes={{id:'gameScript'}}/>-->
        return(
            <div id="jeu">
            <div className="col-xs-0 col-sm-0 col-md-1" id="left_pannel"></div>
            <div className="col-xs-12 col-sm-12 col-md-10">
            <Iframe url={process.env.PUBLIC_URL + "./jeux.html"}
            width="100%"
            height="600px"
            id="myId"
            className="myClassname"
            display="initial"
            position="relative"
            styles={{align:'center'}}/>
            </div>
            <div className="col-xs-0 col-sm-0 col-md-1" id="right_pannel"></div>
            </div>
        );
    }
}

export default GameComponent;