var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var uuid = require('uuid/v1');

//imports pac man game related
var Game = require('./modules/Game.js').Game;
var Player = require('./modules/Player.js').Player;
//var Mongo = require('./modules/Mongo.js').Mongo;


app.set('port', (process.env.PORT || 5000));
//www is the public directory served to clients
app.use(express.static(__dirname + '/www'));

//get at root
app.get('/', function(req, res) {
	res.sendFile('www/index.html');
});

//var mongo = new Mongo();
var game = new Game();

//socket managing
io.on('connection', function(socket) {

	//generate a new uniquer playerId for the connecting socket
	var playerId = uuid();

	//link the socket with the generating id to identify it
	socket.player = {
		playerId: playerId
	}

	//a client notifies server that he dies
	socket.on('playerIsDead', function() {
		socket.broadcast.emit('playerIsDead', socket.player.playerId);
	});

	//a socket is initialising and asks for current connected players
	//and is sending his personal informations
	socket.on('firstInit', function(data) {
		data.playerId = socket.player.playerId;
		var player = new Player(data);
		socket.emit('users', game.players);
		game.addPlayer(player);
		socket.broadcast.emit('user', game.players[socket.player.playerId]);
	});

	//on disconnection from websocket the player is removed from the game
	socket.on('disconnect', function() {
		game.removePlayer(socket.player.playerId);
		io.emit('disconnectedUser', {
			playerId: socket.player.playerId
		});
	});

	//got position update from a socket
	socket.on('positionUpdate', function(data) {
		if (!game.players[socket.player.playerId]) {
			//received position from a player that didn't make his first init yet
			return; //return to avoid sending useless informations to clients
		}
		game.setPosition(socket.player.playerId, data);
		//broadcasts information to everyone except itself
		data.playerId = socket.player.playerId;
		socket.broadcast.emit('positionUpdate', data);
	});
});

server.listen(app.get('port'), function() {
	console.log("Pacman is listening on port " + app.get('port'));
});
