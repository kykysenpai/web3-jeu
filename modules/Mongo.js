//Cryptage
var bcrypt = require('bcrypt');

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
            
            var p = new Player({login:login, password : password});
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
                                resolve("Found");
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
};