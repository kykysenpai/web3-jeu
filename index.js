require('newrelic');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var uuid = require('uuid/v1');

require('./modules/MapGenerator.js');


//imports pac man game modes
var DefaultPacman = require('./modules/gameModes/DefaultPacman.js').DefaultPacman;
var RandomMapPacman = require('./modules/gameModes/RandomMapPacman.js').RandomMapPacman;

var Player = require('./modules/Player.js').Player;
//var Mongo = require('./modules/Mongo.js').Mongo;

//interval in milliseconds between information sending to clients
var millisecondsBtwUpdates = 25;

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

app.get('/lobby', function(req, res) {
	res.send("Lobby goes here");
});

app.get('/game', function(req, res) {
	res.send("Game hoes here");
});

app.post('/login', function(req, res) {
	res.send("Login logic goes here");
});

//var mongo = new Mongo();

//instanciate all game modes rooms
var defaultPacman = new DefaultPacman(updateLobby);
var randomMapPacman = new RandomMapPacman(updateLobby);

//intialisation of the sockets of all rooms
defaultPacman.initSocket(io.of('/defaultPacman'), uuid, millisecondsBtwUpdates, Player);
randomMapPacman.initSocket(io.of('/randomMapPacman'), uuid, millisecondsBtwUpdates, Player);
/*
//force secure connection with the client
app.use(function(req, res, next) {
	if(!req.secure) {
	  return res.redirect(['https://', req.get('Host'), req.url].join(''));
	}
	next();
});
*/

function updateLobby(data) {
	console.log(data);
	io.of('lobbySocket').to(data.room).emit(data.event, data.data);
}

io.of('/lobbySocket').on('connection', function(socket) {
	socket.on('joinLobby', function(chosenGameMode) {
		console.log('A socket joined the gamemode ' + chosenGameMode + ' lobby room');
		switch (chosenGameMode) {
			case 1:
				socket.join('defaultPacmanRoom');
				break;
			case 2:
				socket.join('randomMapPacmanRoom');
				break;
			case 3:
				console.log('pas encore de jeu ici');
				break;
			default:
				console.log('erreur n* level');
		}
	});
});

server.listen(app.get('port'), function() {
	console.log("Pacman is listening on port " + app.get('port'));
});
