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
    id_player: Number,
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
    id_skin : Number,
    type : Boolean, //pacman = 0 && ghost = 1
    image : String
});
//schema rooms
roomSchema = mongoose.Schema({
    id_room : Number,
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
exports.user = Rooms;