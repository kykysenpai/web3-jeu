var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer'); 
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var uuid = require('uuid/v1');
var session = require('express-session');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

//imports pac man game related
var Game = require('./modules/Game.js');
var Player = require('./modules/Player.js');
var Mongo = require('./modules/Mongo.js');

//class aliases
var Game = Game.Game;
var Player = Player.Player;
var Mongo = Mongo.Mongo;

app.set('port', (process.env.PORT || 5000));
//www is the public directory served to clients
app.use(express.static(__dirname + '/www'));

//use sessions for tracking logins
app.use(session({
	secret: 'work hard',
	resave: true,
	saveUninitialized: false,
	cookie: { name : null, maxAge: 0 }
  }));

//get at root
app.get('/', function(req, res) {
	res.sendFile('www/index.html');
});

var mongo = new Mongo();

var game = new Game();

app.post('/seConnecter',(req,res) => {
	console.log("Index.js seConnecter-> app.post");
	console.log("req:" + req.body.login);
	//promesse
	mongo.connectPlayer(req.body.login,req.body.mdp).then(function(resp){
		console.log("resp of function connect : " + resp);
		if(resp){
			req.session.cookie.name = req.body.login;
			req.session.cookie.maxAge = 10 * 60 * 1000; //10min
			console.log("Connexion succeded : name -> " + req.session.cookie.name + " & maxAge -> " + req.session.cookie.maxAge);
			res.status(200);
			res.send("OK");
		}else{
			console.log("Connexion failed");
			res.status(400);
			res.send("KO");
		}
	});
});

app.post('/sInscrire',(req,res) => {
	console.log("Index.js sInscrire-> app.post");
	console.log("Login :" + req.body.login + "\t Mdp : " + req.body.mdp);
	mongo.insertPlayer(req.body.login,req.body.mdp).then(function(resp){
		console.log("resp of function connect : " + resp);
		if(resp){
			console.log("Inscription succeded");
			res.status(201);
			res.send("OK");
		}else{
			console.log("Inscription failed");
			res.status(400);
			res.send("KO");
		}
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


server.listen(app.get('port'), function() {
	console.log("Pacman is listening on port " + app.get('port'));
});