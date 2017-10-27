var mongodb = require("mongodb");
var uri = "mongodb://heroku_user_test:pacmanweb3@ds127375.mlab.com:27375/heroku_djnrjqpc";
var players;
var skins;
var rooms;
var party_rooms;
var connected = false;

mongodb.MongoClient.connect(uri, function(err, db) {
    if(!err) {
      console.log("We are connected");
      players = db.collection('players');
      skins = db.collection('skins');
      rooms = db.collection('rooms');
      party_rooms = db.collection('party_rooms');
      connected=true;
    } else{
        console.log(err);
    }
});

exports.Mongo = function(){};

exports.Mongo.prototype = {
    insertPlayer: function(login,password){
        if(connected){
            console.log("INSERT PLAYER");
            var p = {'login':login,'password':password, 'currentSkin':1,'skin':{'s1':1,'s2':2}};
            players.insertOne(
                p
            );
        }
    },
    connectPlayer: function(login,password){
        if(connected){
            console.log("CONNECT PLAYER")
            var res = players.group({
                "initial": {
                    "countstar": 0
                },
                "reduce": function(obj, prev) {
                    if (true != null) if (true instanceof Array) prev.countstar += true.length;
                    else prev.countstar++;
                },
                "cond": {
                    "login": login,
                    "mdp": password
                }            
            })
            .catch((error) => {
                assert.isNotOk(error,'Mongo.js -> Promise error');
                done();
            });
              return res;
        }
    },
    checkPlayer: function(login){
        if(connected){            
            console.log("CHECK PLAYER")        
            var res = players.group({
                "initial": {
                    "countstar": 0
                },
                "reduce": function(obj, prev) {
                    if (true != null) if (true instanceof Array) prev.countstar += true.length;
                    else prev.countstar++;
                },
                "cond": {
                    "login": login
                }
            });
        }
    }

};

