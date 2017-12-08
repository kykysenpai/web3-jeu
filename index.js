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
var secretJWT = "secretpacman";
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./modules/oAuth.js');


var properties = require('properties-reader')(__dirname + '/config.properties');

var enforce = require('express-sslify');

if (process.env.NODE_ENV === 'production') {
	app.use(enforce.HTTPS({
		trustProtoHeader: true
	}));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(passport.initialize());

app.use(favicon(path.join(__dirname, '', './www/images/icone_pacman.ico')));
var options = {
	index: "./index.js"
};
//app.use('/', express.static('app', options));
//app.use(express.static(__dirname + '/www'))
app.use(express.static(__dirname + '/client/build'));

require('./modules/MapGenerator.js');

app.set('port', process.env.PORT || 5000);

var Player = require('./modules/Player.js').Player;

//imports pac man game modes
var PacmanGame = require(__dirname + '/modules/gameModes/PacmanGame.js').PacmanGame;
/*
var DefaultPacman = require('./modules/gameModes/DefaultPacman.js').DefaultPacman;
var RandomMapPacman = require('./modules/gameModes/RandomMapPacman.js').RandomMapPacman;
var RandomMapPacmanS = require('./modules/gameModes/RandomMapPacmanS.js').RandomMapPacmanS;
var RandomMapPacmanL = require('./modules/gameModes/RandomMapPacmanL.js').RandomMapPacmanL;
*/
/* Import les modules nécessaires a la connexion et inscription */
var connexion = require("./modules/Connexion.js")
var inscription = require("./modules/Inscription.js");

//--------------------------- Gestion des routes ------------------------------//

app.get('/', function(req, res) {
	//res.sendFile('www/index.html');
	res.sendFile(__dirname + 'build' + 'index.html');
});

app.get('/jeux.html', () => {
	res.sendFile('www/jeux.html');
	//res.sendFile(__dirname + 'build' + 'jeux.html');
});


app.get('/verifyLoggedIn', function(req, res) {
	if (!req.query.tokenLocal && !req.query.tokenSession) {
		console.log("Les deux tokens sont vides...");
		res.status(401).send();
	} else {
		var token = null;
		if(req.query.tokenLocal){
			token = req.query.tokenLocal;
		}else{
			token = req.query.tokenSession;
		}
		var decoded = jwt.verify(token, secretJWT, function(err, playload) {
			if (err) {
				console.log("Erreur token verification " + err.message)
				res.status(401).send();
			} else {
				console.log(JSON.stringify(playload));
				res.status(200).send();
			}
		});
	}
});

app.post('/getPLayerInfo', (req,res) =>{
	//db.getInfo req.data.authName
	//playerInfor
});

app.get('/deconnecter', function(req, res) {
	if (req.query.token != null) {
		console.log(req.query.token);
		res.status(200).send();
	} else {
		res.status(202).send();
	}
});

app.post('/seConnecter', (req, res) => {
	console.log("Index.js seConnecter-> app.post");
	var responsse = connexion.connexionHandler(req.body.login, req.body.passwd).then(function(connexion) {
		console.log("Recupéré : " + JSON.stringify(connexion));
		const payload = {
			"login": connexion.player.login,
			"currentGhost": connexion.player.currentGhost,
			"currentPacman": connexion.player.currentPacman,
			"bestScoreGhost": connexion.player.stats.bestScoreGhost,
			"bestScorePacman": connexion.player.stats.bestScorePacman,
			"nbPlayedGames": connexion.player.stats.nbPlayedGames,
			"nbVictory": connexion.player.stats.nbVictory,
			"nbDefeat": connexion.player.stats.nbDefeat,
			"ghostSkins": connexion.player.ghostSkins,
			"pacmanSkins": connexion.player.pacmanSkins
		};
		var timeout = 1440 // expires in 24 hours
		var tokenJWT = jwt.sign(payload, secretJWT, {
			expiresIn: '24h'
		});

		console.log("La connexion a réussi");
		res.status(connexion.status).json({
			store: req.body.keep,
			message: connexion.message,
			authName: connexion.player.login,
			token: tokenJWT,
			"currentGhost": connexion.player.currentGhost,
			"currentPacman": connexion.player.currentPacman,
			"bestScoreGhost": connexion.player.stats.bestScoreGhost,
			"bestScorePacman": connexion.player.stats.bestScorePacman,
			"nbPlayedGames": connexion.player.stats.nbPlayedGames,
			"nbVictory": connexion.player.stats.nbVictory,
			"nbDefeat": connexion.player.stats.nbDefeat,
			"ghostSkins": connexion.player.ghostSkins,
			"pacmanSkins": connexion.player.pacmanSkins
		});
	}).catch(function(erreur) {
		console.log("Recupéré : " + JSON.stringify(erreur));
		console.log("La connexion a échoué");
		res.status(erreur.status).json({
			err: erreur.message
		});
	});
});

app.post('/sInscrire', (req, res) => {
	console.log("Index.js sInscrire-> app.post");
	/*Verification si mot de passe correspond a la regex */
	var mdpValide = inscription.validerMdp(req.body.passwd).then(function(valide) {
		inscription.inscriptionHandler(req.body.login, req.body.passwd).then(function(inscriptionOK) {
			console.log("Recupéré : " + JSON.stringify(inscriptionOK));
			console.log("L'inscription a réussi.");
			res.status(inscriptionOK.status).json({
				message: inscriptionOK.message
			});
		}).catch(function(pasInscrit) {
			console.log("Recupéré fail : " + JSON.stringify(pasInscrit));
			console.log("L'inscription a échoué : " + pasInscrit.message);
			res.status(pasInscrit.status).json({
				err: pasInscrit.message
			});
		});
	}).catch(function(invalide) {
		console.log("Catch invalide password : Recupéré : " + JSON.stringify(invalide));
		res.status(invalide.status).json({
			err: invalide.message
		});
	});
});

/*
app.get('/closePage', function(req, res) {
	res.type('.html');
	res.send('<script> window.close(); </script>');
});
*/

//get facebook path
app.get('/auth/facebookConnect', passport.authenticate('facebook'));

app.get('/auth/facebookConnect/callback',
	passport.authenticate('facebook', {
		successRedirect: '/closePage',
		failureRedirect: '/closePage'
	}));

//facebookManaging
passport.use(new FacebookStrategy({
		clientID: config.facebook.clientID,
		clientSecret: config.facebook.clientSecret,
		callbackURL: config.facebook.callbackURL,
		profileFields: ['id', 'emails', 'name', 'link']
	},
	function(token, refreshToken, profile, done) {
		process.nextTick(function() {
			console.log(profile);
			var login = profile.id + "-" + profile.name.givenName;
			var mdp = profile.id;
			console.log("NEXTTICK");
			console.log("login fcbk : " + login);
			console.log("mdp fcbk : " + mdp);

			inscription.inscriptionHandler(login, mdp).then(function(inscriptionOK) {
				console.log("Recupéré INSCRIPTIONOK : " + inscriptionOK);
				console.log("L'inscription a réussi.");

				 done(null, login);
			}).catch(function(pasInscrit) {
				console.log("Déja Inscrit.");	
				var response = connexion.connexionHandler(login, mdp).then(function(connexion) {
				console.log("Recupéré PASINSCRIT: " + JSON.stringify(connexion));
				const payload = {
					"login": connexion.player.login,
					"currentGhost": connexion.player.currentGhost,
					"currentPacman": connexion.player.currentPacman,
					"bestScoreGhost": connexion.player.stats.bestScoreGhost,
					"bestScorePacman": connexion.player.stats.bestScorePacman,
					"nbPlayedGames": connexion.player.stats.nbPlayedGames,
					"nbVictory": connexion.player.stats.nbVictory,
					"nbDefeat": connexion.player.stats.nbDefeat,
					"ghostSkins": connexion.player.ghostSkins,
					"pacmanSkins": connexion.player.pacmanSkins
				};
				var timeout = 1440 // expires in 24 hours
				var tokenJWT = jwt.sign(payload, secretJWT, {
					expiresIn: '24h'
				});
				
				console.log("La connexion a réussi");
				
				 done(null, connexion);
				}).catch(function(erreur) {
					console.log("Recupéré : " + JSON.stringify(erreur));
					console.log("La connexion a échoué");

					done(erreur);
				});

			});
		});
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

//instanciate all game modes rooms
var defaultPacman = new PacmanGame(properties, updateLobby, 'Default');
var randomMapPacman = new PacmanGame(properties, updateLobby, 'Medium');
var randomMapPacmanS = new PacmanGame(properties, updateLobby, 'Small');
var randomMapPacmanL = new PacmanGame(properties, updateLobby, 'Large');

//intialisation of the sockets of all rooms
defaultPacman.initSocket(io.of('/defaultPacman'), properties);
randomMapPacman.initSocket(io.of('/randomMapPacman'), properties);
randomMapPacmanS.initSocket(io.of('/randomMapPacmanS'), properties);
randomMapPacmanL.initSocket(io.of('/randomMapPacmanL'), properties);

function updateLobby(data) {
	io.of('lobbySocket').to(data.room).emit(data.event, data.data);
}

io.of('/lobbySocket').on('connection', function(socket) {
	socket.on('joinLobby', function(chosenGameMode) {
		switch (chosenGameMode) {
			case 1:
				socket.join('defaultPacmanRoom');
				break;
			case 2:
				socket.join('randomMapPacmanRoomS');
				break;
			case 3:
				socket.join('randomMapPacmanRoom');
				break;
			case 4:
				socket.join('randomMapPacmanRoomL');
				break;
			default:
				console.log('erreur n* level');
		};
	});
});


server.listen(app.get('port'), function() {
	console.log("Pacman is listening on port " + app.get('port'));
});
