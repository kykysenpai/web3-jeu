var mongoose = require('mongoose');

//schemas
var playerSchema;
var skinSchema;
var roomSchema;
var party_roomSchema;
//objects ready to use
var Player;
var Skin;
var Room;

//schemas player
playerSchema = mongoose.Schema({
    _id_player: { type : mongoose.Schema.Types.ObjectId, default : new mongoose.Types.ObjectId},
    login: { type:String, unique : true, trim:true},
    password : String,
    currentGhost : {type : Number, ref : 'Skin'},
    currentPacman : {type : Number, ref : 'Skin'},
    stats : {
        bestScorePacman : { type : Number, default : 0},
        bestScoreGhost :  { type : Number, default : 0},
        nbPlayedGames :  { type : Number, default : 0},
        nbVictory :  { type : Number, default : 0},
        nbDefeat :  { type : Number, default : 0}
    },
    ghostSkins : [{
        type : Number, ref : 'Skin'}],
    pacmanSkins : [{
        type : Number, ref : 'Skin'}]
});
//schema skins
skinSchema = mongoose.Schema({
    id_skin : { type : mongoose.Schema.Types.ObjectId, default : new mongoose.Types.ObjectId},
    type : Boolean, //pacman = 0 && ghost = 1
    image : String
});
//schema rooms
roomSchema = mongoose.Schema({
    id_room : { type : mongoose.Schema.Types.ObjectId, default : new mongoose.Types.ObjectId},
    name : String,
    type : {
        name : String, 
        enum : ["S", "M", "L", "XL"]
    }
});

//models
Players = mongoose.model('Players', playerSchema);
Skins = mongoose.model('Skins', skinSchema);
Rooms = mongoose.model('Rooms', roomSchema);

exports.players = Players;
exports.skins = Skins;
exports.rooms = Rooms;

//const {players, rooms} = require("../../MongoModels"); 