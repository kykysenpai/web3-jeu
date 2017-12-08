var mongo = require("./Mongo.js");
var codesReponse = require("./responseCodes.js");

exports.connexionHandler = function(login, mdp){
    return new Promise(function(resolve,reject){
        mongo.findPlayer(login).then(function(playerFound){
            if(!playerFound){
                console.log("Le login n'existe pas");
                reject(new responseObject(false, "playerNotFound", null));
            }else{
                mongo.connectPlayer(playerFound, mdp).then(function(playerData){
                    console.log("Joueur récupéré : " + playerData);
                    resolve(new responseObject(true, "inscriptionOk", playerData));
                }).catch(function(connexionKo){
                    console.log("Erreur de mdp reject " + connexionKo);
                    reject(new responseObject(false, connexionKo, null));
                });
            }
        }).catch(function(errFind){
            reject(new responseObject(false, errFind));
        });
    });    
};

exports.findPlayer = (playerName) =>{
    return new Promise((resolve,reject) => {
        mongo.findPlayer(playerName).then((playerFound) => {
            resolve(new responseObject(true,"findOk",playerFound));     
        }).catch((error) => {
            reject(new responseObject(false,error));
        })
    });
} 

function responseObject(isSuccess, code, data) {
    this.success = isSuccess;
    this.player = data;

    if(this.success){
        for (var i=0; i<codesReponse.okCodes.length; i++) {
            if(codesReponse.okCodes[i].id== code) {
                this.status = codesReponse.okCodes[i].status;
                this.message = codesReponse.okCodes[i].message;
                break;
            }
        }
    } else {
        for (var i=0; i<codesReponse.errorCodes.length; i++) {
            if(codesReponse.errorCodes[i].id == code) { 
                console.log("Correspondance : " + codesReponse.errorCodes[i].id + " == " + code );
                this.status = codesReponse.errorCodes[i].status;
                this.message = codesReponse.errorCodes[i].message;
                break;
            }
        }
    }
    if(this.status==undefined){
        this.status = 400;
        this.message = "Erreur non répertoriée : " + code.message;
    } 
}