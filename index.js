var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var uuid = require('uuid/v1');

//imports pac man game related
var Game = require('./modules/Game.js').Game;
var Player = require('./modules/Player.js').Player;
//var Mongo = require('./modules/Mongo.js').Mongo;

var https_redirect = function(req, res, next) {
    if (process.env.NODE_ENV === 'production') {
        if (req.headers['x-forwarded-proto'] != 'https') {
            return res.redirect('https://' + req.headers.host + req.url);
        } else {
            return next();
        }
    } else {
        return next();
    }
};

app.use(https_redirect);

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
	//adding a new Player on connection to a websocket
	var playerId = uuid();
	socket.player = {
		playerId: playerId
	}

	//a client notifies server that he dies
	socket.on('playerIsDead', function() {
		socket.broadcast.emit('playerIsDead', socket.player.playerId);
	});

	//a socket is initialising and asks for current connected players
	//and is sending is personal informations
	socket.on('firstInit', function(data) {
		data.playerId = socket.player.playerId;
		var player = new Player(data);
		socket.emit('users', {
			//Sending playerId so he doesn't add himself to the game
			playerId: socket.player.playerId,
			players: game.players
		});
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
		game.setPosition(socket.player.playerId, data);
		//broadcasts information to everyone except itself
		data.playerId = socket.player.playerId;
		socket.broadcast.emit('positionUpdate', data);
	});
});

/*
//force secure connection with the client
app.use(function(req, res, next) {
	if(!req.secure) {
	  return res.redirect(['https://', req.get('Host'), req.url].join(''));
	}
	next();
});
*/

server.listen(app.get('port'), function() {
	console.log("Pacman is listening on port " + app.get('port'));
});
