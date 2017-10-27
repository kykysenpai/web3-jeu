var mongoose = require('mongoose');
mongoose.connect("mongodb://heroku_user_test:pacmanweb3@ds127375.mlab.com:27375/heroku_djnrjqpc");
var db = mongoose.connection;

//import models
var models = require('./modules/MongoModels.js');
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
        if(connectedDB){
            console.log("INSERT PLAYER");
            var p = new Player({login:login, password : password});
            //Check si le login name est deja utilise
            Player.findOne({ "login" : login},
            function (err, player) {
                    //ce login n'existe pas
                   if (err) return handleError(err);
                   console.log('%s exists already.', player.login);
     });
            //insert TODO
        }
    },
    connectPlayer: function(login,password){
        if(connectedDB){
            console.log("CONNECT PLAYER");
            //Connect TODO
        }
    },
};