//Cryptage
var bcrypt = require('bcryptjs');

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

exports.Mongo = function(){};

exports.Mongo.prototype = {
    insertPlayer: function(login,password){
        console.log("Mongo.js / mongo proto / IN FUNCTION INSERT");
        if(connectedDB){
            //crypting before insert
            password = bcrypt.hashSync(password, 10);   
            
            var p = new Player({login:login, password : password, pacmanSkins : ["pacman.png"], ghostSkins : ["pacman.png"]});
            //promise answer
            return new Promise(function(resolve, reject) {                
                //Check si le login name est deja utilise
                var found = false;
                Player.findOne({ "login" : login},function (err, player) {
                    if (err) return reject(err);
                    if(player==null) {
                        found = false;
                    }
                    else{
                        console.log('%s exists already.', player.login);
                        found = true;
                    }
                });
                if(!found){
                    console.log("Mongo.js / mongo proto / after find -> ready to insert in db");
                    //INSERT IN DB
                    Player.create(p, function(err,player){
                        if (err) {
                            return reject(err);
                        } else {
                            return resolve(true);
                        }
                    });
                }
            })
        }
    },
    connectPlayer: function(login,password){
        if(connectedDB){
            return new Promise(function(resolve, reject) {  
                //Check si le login name est present et si oui recupere le player correspondant
                Player.findOne({"login" : login},function (err,player) {
                    if (err) {
                        reject(new Error("Erreur findOne"));
                    } else if (player==null) {
                        reject(new Error("Not found"));
                    }else{
                        //compare
                        console.log("player password findOne : " + player.password);
                        bcrypt.compare(password, player.password, function(err, res) {
                            if (res) {
                                console.log("Mongo.js / bon mdp");
                                resolve(player);
                            } else {
                                console.log("Mongo.js / pas bon mdp");
                                reject(new Error("MDP"));
                            }
                        }); 
                    } 
                });
            })
        }else{
            return new Promise(function(resolve,reject){
                reject(new Error("Database is not accessible."));
            }
            );
        }
    },
    updateStat: function(login,resultat,equipe,score){
        if(connectedDB){
            var p = Player.findOne({"login" : login},function (err,player) {
                if (err) {
                    reject(new Error("Erreur findOne"));
                } else if (player==null) {
                    reject(new Error("Not found"));
                }
            });
            if(resultat=="win"){
                if(equipe=="pacman"){
                    if(p.bestScorePacman){ 
                        Player.findOneAndUpdate(
                            { "login" : login },
                            { 
                                $inc: { "nbVictory" : 1, "nbPlayedGames" : 1 },
                                "bestScorePacman" : score
                            }
                        )
                    }
                    else{
                        Player.findOneAndUpdate(
                            { "login" : login },
                            { 
                                $inc: { "nbVictory" : 1, "nbPlayedGames" : 1 }
                            }
                        )
                    }
                }
                else{
                    if(p.bestScoreGhost){ 
                        Player.findOneAndUpdate(
                            { "login" : login },
                            { 
                                $inc: { "nbVictory" : 1, "nbPlayedGames" : 1 },
                                "bestScoreGhost" : score
                            }
                        )
                    }
                    else{
                        Player.findOneAndUpdate(
                            { "login" : login },
                            { 
                                $inc: { "nbVictory" : 1, "nbPlayedGames" : 1 }
                            }
                        )
                    }
                }
            }
            else{
                if(equipe=="pacman"){
                    if(p.bestScorePacman){ 
                        Player.findOneAndUpdate(
                            { "login" : login },
                            { 
                                $inc: { "nbDefeat" : 1, "nbPlayedGames" : 1 },
                                "bestScorePacman" : score
                            }
                        )
                    }
                    else{
                        Player.findOneAndUpdate(
                            { "login" : login },
                            { 
                                $inc: { "nbDefeat" : 1, "nbPlayedGames" : 1 }
                            }
                        )
                    }
                }
                else{
                    if(p.bestScoreGhost){ 
                        Player.findOneAndUpdate(
                            { "login" : login },
                            { 
                                $inc: { "nbDefeat" : 1, "nbPlayedGames" : 1 },
                                "bestScoreGhost" : score
                            }
                        )
                    }
                    else{
                        Player.findOneAndUpdate(
                            { "login" : login },
                            { 
                                $inc: { "nbDefeat" : 1, "nbPlayedGames" : 1 }
                            }
                        )
                    }
                }
            }
        }
        else{
            return new Promise(function(resolve,reject){
                reject(new Error("Database is not accessible."));
            });
        }
    },
    checkSkin: function(login,nbVictory,nbDefeat,nbPlayedGames,bestScoreGhost,bestScorePacman){
        if(connectedDB){
            return new Promise(function(resolve, reject) {  
                //Check si le login name est present et si oui recupere le player correspondant
                Skin.find({}).toArray(function(err, result) {
                    result.array.forEach(function(element){
                        console.log("CONDITION : "+ element.condition);
                        if(element.condition){
                            findOneAndUpdate(
                                { "login" : login },
                                { $push : { pacmanSkins : "pacman.png" } }
                             )
                        }
                    });
                  });;
            })
        }else{
            return new Promise(function(resolve,reject){
                reject(new Error("Database is not accessible."));
            }
            );
        }
    }
};