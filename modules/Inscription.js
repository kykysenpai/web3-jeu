var mongo = require("./Mongo.js");
var codesReponse = require("./responseCodes.js");

exports.inscriptionHandler = function(login, mdp){
    return new Promise(function(resolve,reject){
        mongo.findPlayer(login).then(function(playerFound){
            if(playerFound){
                reject(new responseObject(false, "loginExists", null));
            }else{
                mongo.insertPlayer(login, mdp).then(function(playerData){
                    resolve(new responseObject(true, "inscriptionOk", playerData));
                }).catch(function(inscriptionKO){
                    reject(new responseObject(false, inscriptionKO, null));
                });
            }
        }).catch(function(errFind){
            reject(new responseObject(false, errFind, null));
        });
    });
};

exports.validerMdp = function(mdp){
    return new Promise(function(resolve, reject) { 
    /* Mdp entre 4 et 8 charactères */
        if(mdp.match("^.{4,}$")){
            resolve(new responseObject(true, "mdpOk", null));
        }else{
            reject(new responseObject(false, "mdpRegexKo", null));
        }
    });
};

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