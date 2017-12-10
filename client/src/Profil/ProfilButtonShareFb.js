import React, { Component } from 'react';
import {ShareButtons,generateShareIcon} from 'react-share';

const {
    FacebookShareButton,
    GooglePlusShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    RedditShareButton,
    EmailShareButton,
  } = ShareButtons;
  
  const FacebookIcon = generateShareIcon('facebook');
  const TwitterIcon = generateShareIcon('twitter');
  const GooglePlusIcon = generateShareIcon('google');
  const WhatsappIcon = generateShareIcon('whatsapp');
  const RedditIcon = generateShareIcon('reddit');
  const EmailIcon = generateShareIcon('email');

class ProfilButtonShareFb extends Component{
    render(){
        var shareUrl = "" + window.location;
        return(
            <div className="row">

            <div className="someNetwork">
             <FacebookShareButton
            url={shareUrl}
            quote={"Viens jouez!!!"}
            className="share-button col-xs-1 col-sm-1 col-md-2 col-lg-2"
            hashtag="Pacman Evolution"
            tabIndex="0">
            <FacebookIcon
              size={64}
              round />
            </FacebookShareButton>
            </div>

            <div className="someNetwork">
            <TwitterShareButton
            url={shareUrl}
            quote={"Viens jouez!!!"}
            className="share-button col-xs-1 col-sm-1 col-md-2 col-lg-2"
            tabIndex="1"
            title="Pacman Evolution"
            via="PasEncoreDeCompteTwitter">
            <TwitterIcon
              size={64}
              round />
            </TwitterShareButton>
            </div>

            <div className="someNetwork">
            <GooglePlusShareButton
            url={shareUrl}
            quote={"Viens jouez!!!"}
            className="share-button col-xs-1 col-sm-1 col-md-2 col-lg-2"
            tabIndex="2">
            <GooglePlusIcon
              size={64}
              round />
            </GooglePlusShareButton>
            </div>

            <div className="someNetwork">
            <WhatsappShareButton
            url={shareUrl}
            quote={"Viens jouez!!!"}
            className="share-button col-xs-1 col-sm-1 col-md-2 col-lg-2"
            tabIndex="4"
            title="Pacman Evolution"
            separation=" ">
            <WhatsappIcon
              size={64}
              round />
            </WhatsappShareButton>
            </div>

            <div className="someNetwork">
            <RedditShareButton
            url={shareUrl}
            quote={"Viens jouez!!!"}
            className="share-button col-xs-1 col-sm-1 col-md-2 col-lg-2"
            tabIndex="5"
            title="Pacman Evolution">
            <RedditIcon
              size={64}
              round />
            </RedditShareButton>
            </div>

            <div className="someNetwork">
            <EmailShareButton
            url={shareUrl}
            quote={"Viens jouez!!!"}
            className="share-button col-xs-1 col-sm-1 col-md-2 col-lg-2"
            tabIndex="6"
            subject="Pacman Evolution"
            body={"Viens jouer sur: "+window.location}>
            <EmailIcon
              size={64}
              round />
            </EmailShareButton>
            </div>
            </div>
        );
    }
}

export default ProfilButtonShareFb;