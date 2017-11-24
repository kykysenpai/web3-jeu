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
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./modules/oAuth.js');

var enforce = require('express-sslify');

if(process.env.NODE_ENV === 'production'){
	app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use(favicon(path.join(__dirname, '', './www/images/icone_pacman.ico')));
var options = {index: "./index.js"};
//app.use('/', express.static('app', options));
app.use(express.static(__dirname + '/www'))

require('./modules/MapGenerator.js');

app.set('port', process.env.PORT || 5000);
server.listen(app.get('port'), function() {
	console.log("Pacman is listening on port " + app.get('port'));
});

//imports pac man game modes
var DefaultPacman = require('./modules/gameModes/DefaultPacman.js').DefaultPacman;
var RandomMapPacman = require('./modules/gameModes/RandomMapPacman.js').RandomMapPacman;

var Player = require('./modules/Player.js').Player;
var Mongo = require('./modules/Mongo.js').Mongo;

//interval in milliseconds between information sending to clients
var millisecondsBtwUpdates = 25;

var mongo = new Mongo();
//var game = new Game();

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

app.get('/closePage', function(req, res) {
	res.type('.html');
	res.send('<script> window.opener.location.reload(); window.close(); </script>');
});

//get facebook path
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { 
      successRedirect : '/', 
      failureRedirect: '/' 
}));

//facebookManaging
passport.use(new FacebookStrategy({
	clientID        : config.facebook.clientID,
	clientSecret    : config.facebook.clientSecret,
	callbackURL     : config.facebook.callbackURL,
	profileFields: ['id', 'emails', 'name','link']
},
function(token, refreshToken, profile, done) {
	process.nextTick(function() {
		console.log(profile);
		var login = profile.id+"-"+profile.name.givenName;
		var mdp = profile.id;
		console.log("NEXTTICK");
		console.log("login fcbk : " + login);
		console.log("mdp fcbk : " + mdp);

		if(mongo.findPlayer(login)== null){
			mongo.insertPlayer(login,mdp).then(function(resp){
				console.log(resp);
				if(resp){
					console.log("Inscription succeded");
					return done(null, login);
				}
			}).catch(function(err){
				console.log("Catched");
				res.status(400);
				res.send("KO");
			});
		}
		else{
			mongo.connectPlayer(login,mdp).then(function(response){
					console.log("CONNECT PLAYER IN INDEX.JS =>" + response);
					if(response){
						//METTRE COoKIE;
						console.log("CONNEXION SUCCEEDED");
						return done(null, profile.id);
					}
					else{
						console.log("CONNEXION FAILED");
						return done(err);
					}
				}).catch(function(err){
					console.log("Catched");
					res.status(400);
					res.send("KO");
				});
		}

	})
}
));

passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(user, done) {
	done(null, user);
});

//-------------------------Routes specifiques au Jeu---------------------------------//

//socket managing
io.on('connection', function(socket) {
	//adding a new Player on connection to a websocket
	var playerId = uuid();
	var player = new Player(playerId);
	//game.addPlayer(player);
	socket.player = {
		playerId: playerId
	}
	socket.broadcast.emit('user', {
		playerId: playerId
	});
});


app.get('/lobby', function(req, res) {
	res.send("Lobby goes here");
});

app.get('/game', function(req, res) {
	res.send("Game hoes here");
});

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
		};
	});
});
