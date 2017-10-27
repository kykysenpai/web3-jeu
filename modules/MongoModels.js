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
    id_player: Schema.Types.ObjectId,
    login: { type:String, unique : true, trim:true},
    password : String,
    currentGhost : {type : Schema.Types.ObjectId, ref : 'Skin'},
    currentPacman : {type : Schema.Types.ObjectId, ref : 'Skin'},
    stats : {
        bestScorePacman : Number,
        bestScoreGhost : Number,
        nbPlayedGames : Number,
        nbVictory : Number,
        nbDefeat : Number
    },
    ghostSkins : [{
        type : Schema.Types.ObjectId, ref : 'Skin'}],
    pacmanSkins : [{
        type : Schema.Types.ObjectId, ref : 'Skin'}]
});
//schema skins
skinSchema = mongoose.Schema({
    id_skin : Schema.Types.ObjectId,
    type : Boolean, //pacman = 0 && ghost = 1
    image : String
});
//schema rooms
roomSchema = mongoose.Schema({
    id_room : Schema.Types.ObjectId,
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

module.exports.players = Players;
module.exports.skins = Skins;
module.exports.user = User;