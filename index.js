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
//app.use('/', express.static('app', options));
app.use(express.static(__dirname + '/www'))

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
	if(req.query.token!=undefined){
		res.status(200).send();
	}else{
		res.status(401).send();
	}
});

app.get('/deconnecter', function(req,res){
	if(req.query.token!=null){
		res.status(200).send();
	}else{
		res.status(202).send();
	}
});

app.post('/seConnecter',(req,res) => {
	console.log("Index.js seConnecter-> app.post");
	//promesse
	mongo.connectPlayer(req.body.login,req.body.mdp).then(function(succes){
		console.log("response of connectPlayer in index.js " + succes + " type of : " + typeof(succes));
		//player ready to connect
		const payload = { user:req.body.login };
		var timeout = 1440 // expires in 24 hours
		var token = jwt.sign(payload, "secretpacman", { expiresIn: '24h' });

		console.log("Connexion succeded");
		res.status(200).send({"token": token, "authName" : req.body.login});

	},function(erreur){
		//error occured
		console.log("Connexion failed");
		res.status(400).send({"err" : erreur.message});
		
	}).catch(function(err){
		console.log("Catched : " + err.message);
		res.status(406).send();
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
		console.log("Catched");
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