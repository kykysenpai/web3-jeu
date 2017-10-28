//Cryptage
var bcrypt = require('bcrypt');

//db
var mongoose = require('mongoose');
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
            console.log("Mongo.js / mongo proto / login et pass : " + login + "  " + password);
            //crypting before insert
            password = bcrypt.hashSync(password, 10);
            console.log("Mongo.js / mongo proto / hashed password : " + password);   
            
            var p = new Player({login:login, password : psw});
            console.log("Mongo.js / mongo proto / Object player login et pass : " + p.login + "  " + p.password);

            //Check si le login name est deja utilise
            var found = false;
            Player.findOne({ "login" : login},function (err, player) {
                   if (err) return handleError(err);
                   if(player==null) {
                       found = false;
                       return false;
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
                        return next(err)
                    } else {
                        return true;
                    }
                });
            }
        }
    },
    connectPlayer: function(login,password){
        console.log("Mongo.js / mongo proto / IN FUNCTION CONNECT");
        if(connectedDB){
            console.log("Mongo.js / mongo proto / connect login et pass : " + login + "  " + password);
            var p = new Player({login:login, password : password});
            console.log("Mongo.js / mongo proto / connect Object player login et pass : " + p.login + "  " + p.password);
         
            //Check si le login name est present et si oui recupere le player correspondant
            var gotPlayer = false;
            
            Player.findOne({"login" : login}).exec(function (err,player) {
                if (err) {
                    return true;
                } else if (!player) {
                    var err = new Error("Player not found.");
                    gotPlayer = false;
                    err.status = 400;
                    return false;
                }
                console.log('Got the player with this login -> ', player.login);
                gotPlayer = true;
                console.log("Mongo.js / mongo proto / after get player -> comparison of mdp : " + p.password + " " + player.password);
                //compare
                bcrypt.compare(p.password, player.password, function(err, res) {
                    if (res) {
                        console.log("Mongo.js / mongo proto / bon mdp");
                        return true;
                    } else {
                        console.log("Mongo.js / mongo proto / pas bon mdp");
                        return false;
                    }
                });  
            });
        }
    },
};