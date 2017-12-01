//Cryptage
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
//db
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://heroku_user_test:pacmanweb3@ds127375.mlab.com:27375/heroku_djnrjqpc");
var db = mongoose.connection;

//import models
var models = require('./MongoModels.js');
//objects ready to use
var Player = models.players;
var Skin = models.skins;
var Room = models.rooms;

//db connexion OK?
var connectedDB = false;

//verification connection db
db.on('error', console.error.bind(console, 'connection to db error:'));
db.once('open', function() {
    console.log("We are connected");
    //DB usable
    connectedDB = true;
});

exports.findPlayer = function(login){
    return new Promise(function(resolve, reject){
        if(connectedDB){
            /*  If an error occurs executing the query, 
            *   error will contain an error and player will be null. 
            *   If the query is successful, 
            *   error will be null and player will be populated with the query result.*/
            Player.findOne({"login" : login}, function (error,player){
                /*If error is not null reject with error*/
                    if (error){
                        reject("ErrFind");
                    } else if (!player){
                        resolve(null);
                    } else{
                        resolve(player);
                    }
                });
            }else{
                reject("DbKO");
            }
    });
};

exports.insertPlayer = function(login,password){
    console.log("Mongo.js / function insertPlayer");
    return new Promise(function(resolve, reject) { 
        if(connectedDB){
            var hash = bcrypt.hashSync(password, salt);
            var p = new Player({login:login, password : hash, pacmanSkins : ["pacman.png"], ghostSkins : ["ghost.png"]});
            console.log("Mongo.js / function insertPlayer / p created : \nLogin :" + p.login 
                + "\nCrypted pass : " + p.password + "\n-> ready to insert in db");
                Player.create(p, function(error,player){
                if (error) {
                    reject("ErrCreate");
                } else {
                    return resolve(player);
                }
            });
        }else{
                reject("DbKO");
            }
    });
};

exports.connectPlayer = function(joueur,passwordClair){
    return new Promise(function(resolve, reject) {  
        if(connectedDB){
            console.log("Mongo.js / function connectPlayer / Le joueur avec le login est trouvé, vérification du password");
                /* Compare le mot de passe en clair passé en argument et celui du joueur en db. */
                console.log("Mongo.js / function connectPlayer /\nPass clair : " 
                + passwordClair + "\nPass crypté du joueur trouvé dans le findPLayer : " + joueur.password);
                bcrypt.compare(passwordClair, joueur.password, function(err, res) {
                    if (res) {
                        console.log("Mongo.js / function connectPlayer / bon mdp / renvoie le joueur");
                        resolve(joueur);
                    } else {
                        console.log("Mongo.js / function connectPlayer / pas bon mdp / renvoie une erreur");
                        reject("mdpKo");
                    }
                }); 
        }else{
            reject("DbKO");
        }
    }); 
};