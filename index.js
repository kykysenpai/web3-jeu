var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var uuid = require('uuid/v1');

//imports pac man game related
var Game = require('./modules/Game.js');
var Player = require('./modules/Player.js');

//class aliases
var Game = Game.Game;
var Player = Player.Player;

app.set('port', (process.env.PORT || 5000));
//www is the public directory served to clients
app.use(express.static(__dirname + '/www'));

//get at root
app.get('/', function(req, res) {
	res.sendFile('www/index.html');
});

var game = new Game();

//socket managing
io.on('connection', function(socket) {
	//adding a new Player on connection to a websocket
	console.log("A websocket connected");
	var id = uuid();
	var player = new Player(id);
	game.addPlayer(player);
	socket.id = id;

	//on disconnection from websocket the player is removed from the game
	socket.on('disconnect', function() {
		game.removePlayer(socket.id);
	});

	//Websocket sends player informations
	socket.on('user', function(data) {
		data.id = socket.id;
		game.setInfos(data);
	});
});

server.listen(app.get('port'), function() {
	console.log("Pacman is listening on port " + app.get('port'));
});
