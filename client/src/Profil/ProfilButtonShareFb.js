import React, { Component } from 'react';

class ProfilButtonShareFb extends Component{
    constructor(props){
        super(props);
        

        this.partager = this.partager.bind(this);
    }

    partager = () =>{
        var shareUrl = "https://facebook.com/sharer/sharer.php?u=" + window.location;
        window.open(shareUrl,"Share dat shit motherfucker","height=200,width=150");
    }

    render(){
        return(
            <div className="row">
                <button className="button button-block" onClick={this.partager}>Partager</button>
            </div>
        );
    }
}

export default ProfilButtonShareFb;