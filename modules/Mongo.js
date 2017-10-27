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
            var p = new Player({login:login, password : password});
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
            //Connect TODO
        }
    },
};