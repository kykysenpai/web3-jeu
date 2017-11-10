//---------- Variables declarations ----------------//
var express = require('express');
var app = express();
//parser pour requetes ajax
var bodyParser = require('body-parser');
//favicon
var favicon = require('serve-favicon');
var path = require('path');

var $ = require("jquery");
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var uuid = require('uuid/v1');
//gestion des sessions
var jwt = require('jsonwebtoken');

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use(favicon(path.join(__dirname, '', './www/images/icone_pacman.ico')));
var options = {index: "./index.js"};
app.use('/', express.static('app', options));

//imports pac man game related
var Game = require('./modules/Game.js');
var Player = require('./modules/Player.js');
var Mongo = require('./modules/Mongo.js');

//class aliases
var Game = Game.Game;
var Player = Player.Player;
var Mongo = Mongo.Mongo;

var mongo = new Mongo();
var game = new Game();

//--------------------------- Gestion des routes ------------------------------//

app.get('/', function(req, res) {
	res.sendFile('www/index.html');
});

app.get('/verifyLoggedIn', function(req,res){
	if(localStorage.getItem("name")!==null && localStorage.getItem("token")!==null){
		res.status(200);
		req.send("CONNECTED");
	}else{
		res.status(401);
		req.send("NEW");
	}
});

app.post('/seConnecter',(req,res) => {
	console.log("Index.js seConnecter-> app.post");
	console.log("req:" + req.body.login);
	//promesse
	mongo.connectPlayer(req.body.login,req.body.mdp).then(function(resp){
		if(resp){
			const payload = { user:req.body.login };
			var timeout = 1440 // expires in 24 hours
			var token = jwt.sign(payload, app.get('superSecret'), { expiresInMinutes: timeout });
			localStorage.setItem("name", req.body.login);
			localStorage.setItem("token", token);
			console.log("Connexion succeded : name -> " + localStorage.getItem("name") + " & token -> " + localStorage.getItem("token"));
			res.status(200);
			res.send("OK");
		}else{
		
			console.log("Connexion failed");
			res.status(400);
			res.send("KO");
		}
	}).catch(function(err){
		res.status(400);
		res.send("KO");
	});
});

app.post('/sInscrire',(req,res) => {
	console.log("Index.js sInscrire-> app.post");
	console.log("Login :" + req.body.login + "\t Mdp : " + req.body.mdp);
	mongo.insertPlayer(req.body.login,req.body.mdp).then(function(resp){
		if(resp){
			console.log("Inscription succeded");
			res.status(201);
			res.send("OK");
		}else{
			console.log("Inscription failed");
			res.status(400);
			res.send("KO");
		}
	}).catch(function(err){
		res.status(400);
		res.send("KO");
	});
});

//socket managing
io.on('connection', function(socket) {
	//adding a new Player on connection to a websocket
	var playerId = uuid();
	var player = new Player(playerId);
	game.addPlayer(player);
	socket.player = {
		playerId: playerId
	}
	socket.broadcast.emit('user', {
		playerId: playerId
	});

	socket.on('users', function() {
		socket.emit('users', {
			//Sending playerId so he doesn't add himself to the game
			playerId: socket.player.playerId,
			players: game.players
		});
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

app.set('port', process.env.PORT || 5000);
server.listen(app.get('port'), function() {
	console.log("Pacman is listening on port " + app.get('port'));
});