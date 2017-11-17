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
    findPlayer: function(login, ret){
        if(connectedDB){
           Player.findOne({"login" : login},function (err,player){
                if (err || !player) {
                    return null;
                }else{
                    ret(player);
                }
            });
        }else{
            return new Error("Database is not accessible.");
        }
    },
    insertPlayer: function(login,password, ret){
        console.log("Mongo.js / mongo proto / IN FUNCTION INSERT");
        if(connectedDB){
            var p = new Player({login:login, password : password});               
            Player.create(p, function(err,player){
                if (err) {
                    ret(err);
                } else {
                    ret(player);
                }
            });
        };
    },
    connectPlayer: function(player, password, ret){
        if(connectedDB){
            //Check si le login name est present et si oui recupere le player correspondant
            console.log("player password findOne : " + player.login + " passwd : " 
                + player.password + " en clair "+ password);
            bcrypt.compare(password, player.password, function(err, res) {
                if (res) {
                    console.log("Mongo.js / bon mdp");
                    ret(res);
                } else {
                    console.log("Mongo.js / pas bon mdp");
                    ret(null);
                }
            }); 
        }else{
            res(new Error("Database is not accessible."));
        }
    },
};