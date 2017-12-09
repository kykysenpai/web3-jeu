var TEAM_PACMAN = 0;
var TEAM_GHOST = 1;

exports.PacmanGame = function(properties, updateLobby, size) {

	//players waiting
	this.waitingRoom = {};
	this.nPlayerWaitingRoom = 0;

	var SpawnPositions = require(__dirname + '/SpawnPositions.js');

	this.respawnTime = properties.get('respawnTime');
	this.superBuffDuration = properties.get('superBuffDuration');
	this.startOfTheGameTimeoutDuration = properties.get('startOfTheGameTimeoutDuration');

	this.size = size;

	var map;
	switch (size) {
		case 'Default':
			this.reqPlayer = properties.get('reqPlayerDefault');
			map = require(__dirname + '/../../client/public/assets/pacman-map.json');
			this.room = 'defaultPacmanRoom';
			break;
		case 'Small':
			this.reqPlayer = properties.get('reqPlayerSmall');
			map = require(__dirname + '/../../client/public/assets/random-map-small.json');
			this.room = 'randomMapPacmanRoomS';
			break;
		case 'Medium':
			this.reqPlayer = properties.get('reqPlayerMedium');
			map = require(__dirname + '/../../client/public/assets/random-map-medium.json');
			this.room = 'randomMapPacmanRoom';
			break;
		case 'Large':
			this.reqPlayer = properties.get('reqPlayerLarge');
			map = require(__dirname + '/../../client/public/assets/random-map-large.json');
			this.room = 'randomMapPacmanRoomL';
			break;
	}

	this.height = map.height;
	this.width = map.width

	switch (size) {
		case 'Default':
			this.spawnPos = SpawnPositions.default(this.width, this.height);
			break;
		case 'Small':
			this.spawnPos = SpawnPositions.small(this.width, this.height);
			break;
		case 'Medium':
			this.spawnPos = SpawnPositions.medium(this.width, this.height);
			break;
		case 'Large':
			this.spawnPos = SpawnPositions.large(this.width, this.height);
			break;
	}


	//players in game or ready for next game
	this.players = {};
	this.nPlayer = 0;
	this.nPlayerTeam = [0, 0];

	this.scores = [0, 0];
	this.isSuperState = [false, false];
	this.state = 'Waiting for players';

	this.updateLobby = updateLobby;

	//the timeout IDs which need to be checked or stopped
	this.startGameId = null;
	this.timeOutSuperID = null;
	this.startOfTheGameTimeout = null;

	//is the game running or waiting for players
	this.isRunning = false;

	var Dot = require(__dirname + '/../Dot.js').Dot;

	this.mapDots = {};
	//fetch dots
	var height = map.height;
	var width = map.width;
	for (var i = 1; i < height - 1; i++) {
		for (var j = 1; j < width - 1; j++) {
			tile = map.layers[0].data[i * width + j];
			if ((this.size == 'Default' && tile === 7) ||
				(this.size != 'Default' && (tile === 25 || tile === 30 || tile === 35 || tile === 40))) {
				this.mapDots[[j * 16, i * 16]] = new Dot(j * 16, i * 16);
			}
		}
	}
};

exports.PacmanGame.prototype = {
	//add a player to the active game
	addPlayer: function(player) {
		this.players[player.playerId] = player;
		console.log("a new player connected to the " + this.size + " Pacman game");
		this.nPlayer++;
		this.nPlayerTeam[player.team]++;
		if (this.nPlayerTeam[TEAM_GHOST] >= this.reqPlayer && this.nPlayerTeam[TEAM_PACMAN] >= this.reqPlayer) {
			this.state = 'Starting the game ...';
			var thisContext = this;
			clearTimeout(this.startGameId);
			this.startGameId = setTimeout(function() {
				thisContext.emitLobby('startGame', null);
				thisContext.state = 'Game in progress';
				thisContext.isRunning = true;
				thisContext.startOfTheGameTimeout = setTimeout(function() {
					clearTimeout(thisContext.startOfTheGameTimeout);
					thisContext.startOfTheGameTimeout = null;
				}, thisContext.startOfTheGameTimeoutDuration);
			}, 10000);
		}
		this.emitUpdateLobby();
	},
	//add a player to the waiting room for the next game
	addToWaitingRoom: function(player) {
		this.waitingRoom[player.playerId] = player;
		console.log("a new player was added to the " + this.size + " Pacman game's waiting room");
		this.nPlayerWaitingRoom++;
		this.emitUpdateLobby();
	},
	//send custom infos to the lobby websocket
	emitLobby: function(event, data) {
		this.updateLobby({
			room: this.room,
			event: event,
			data: data
		});
	},
	//send current lobby infos to the lobby websocket
	emitUpdateLobby: function() {
		this.updateLobby({
			room: this.room,
			event: 'updateWaiting',
			data: {
				nPlayerTeam: this.nPlayerTeam,
				reqPlayer: this.reqPlayer,
				state: this.state
			}
		});
	},
	//check if a team lost
	checkTeams: function(io) {
		if (!this.isRunning || this.startOfTheGameTimeout != null)
			return;
		if (this.nPlayerTeam[TEAM_GHOST] == 0) {
			console.log(this.size + ' Pacman game : Victoire team pacman');
			this.endGame(TEAM_PACMAN, io);
		} else if (this.nPlayerTeam[TEAM_PACMAN] == 0) {
			console.log(this.size + ' Pacman game : Victoire team ghost');
			this.endGame(TEAM_GHOST, io);
		}
	},
	//hard remove a player from current game
	removePlayer: function(playerId) {
		if (this.players[playerId]) {
			console.log('a player was removed' +
				' from the game ' + this.size + ' Pacman game with id : ' + this.players[playerId].playerId);
			if (this.nPlayer > 0) {
				this.nPlayer--;
			}
			if (this.nPlayerTeam[this.players[playerId].team] > 0) {
				this.nPlayerTeam[this.players[playerId].team]--;
			}
			delete this.players[playerId];
		} else if (this.waitingRoom[playerId]) {
			console.log('a player was removed' +
				' from the game ' + this.size + ' Pacman game waiting Room with id : ' + this.waitingRoom[playerId].playerId);
			this.nPlayerWaitingRoom--;
			delete this.waitingRoom[playerId];
		} else {
			console.log("removed a player from " + this.size + " Pacman game that was nor in the active players nor in the waiting room");
		}
		if (!this.isRunning && (this.nPlayerTeam[TEAM_GHOST] < this.reqPlayer || this.nPlayerTeam[TEAM_PACMAN] < this.reqPlayer)) {
			this.state = 'Waiting for players';
			clearTimeout(this.startGameId);
		}
		this.emitUpdateLobby();
	},
	incScore: function(playerId) {
		if (!this.players[playerId])
			return;
		this.scores[this.players[playerId].team]++;
	},
	endGame: function(winner, io) {
		//TODO add close replay
		this.state = 'Waiting for players';
		this.isRunning = false;
		io.emit('endGame', winner);

		for (var player in this.players) {
			this.removePlayer(this.players[player].playerId);
		}
		this.nPlayer = 0;
		this.scores = [0, 0];

		for (var dot in this.mapDots) {
			this.mapDots[dot].isSuper = false;
		}

		for (var player in this.waitingRoom) {
			this.addPlayer(this.waitingRoom[player]);
			delete this.waitingRoom[player];
		}
		this.emitUpdateLobby();
	},
	initSocket: function(io, properties) {
		//game instance is saved because 'this''s value is replaced by 'io'
		//in the on connection function
		var millisecondsBtwUpdates = properties.get('millisecondsBtwUpdates');
		var millisecondsBtwUpdatesDots = properties.get('millisecondsBtwUpdatesDots');
		var millisecondsBtwNewSuperDot = properties.get('millisecondsBtwNewSuperDot');
		var superDotDuration = properties.get('superDotDuration');
		var game = this;
		var Player = require(__dirname + '/../Player.js').Player;
		var uuid = require('uuid/v1');
		//socket managing
		io.on('connection', function(socket) {
			//generate a new uniquer playerId for the connecting socket
			var playerId = uuid();
			//link the socket with the generating id to identify it
			socket.player = {
				playerId: playerId
			}

			//a socket is initialising and asks for current connected players
			//and is sending his personal informations
			socket.on('firstInit', function(data) {
				data.playerId = socket.player.playerId;
				var player = new Player(data);
				if (!game.isRunning) {
					game.addPlayer(player);
					console.log('added a new player to the ' + game.size + ' Pacman game');
				} else {
					game.addToWaitingRoom(player);
					console.log('added a new player to the ' + game.size + ' Pacman game waitingRoom');
				}
				socket.emit('initSpawn', game.spawnPos[data.team][game.nPlayerTeam[data.team] - 1]);
				game.emitUpdateLobby();
			});

			//envoie des joueurs déja présent au socket demandant
			socket.on('gameStarted', function() {
				socket.emit('users', {
					playerId: socket.player.playerId,
					players: game.players,
					mapDots: game.mapDots
				});
			});

			//on disconnection from websocket the player is removed from the game
			socket.on('disconnect', function() {
				game.removePlayer(socket.player.playerId);
				game.checkTeams(io);
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
				game.setPosition(socket.player.playerId, data, io);

				//broadcasts information to everyone except itself
				data.playerId = socket.player.playerId;

			});
		});

		//set super dot randomly
		setInterval(function() {
			var keys = Object.keys(game.mapDots)
			var dot = game.mapDots[keys[keys.length * Math.random() << 0]];
			dot.isSuper = true;
			dot.superTimeout = superDotDuration;
		}, millisecondsBtwNewSuperDot);

		//send dot map
		setInterval(function() {
			io.emit('gameUpdate', {
				players: game.players,
				scores: game.scores,
				dots: game.mapDots
			});
		}, millisecondsBtwUpdatesDots);

		//send player movement infos every millisecondsBtwUpdates milliseconds
		setInterval(function() {
			io.emit('gameUpdate', {
				players: game.players,
				scores: game.scores,
				superState: game.isSuperState,
				dots: {} //game.mapDots
			});
			game.dotsLifeSpan();
		}, millisecondsBtwUpdates);
	},
	dotsLifeSpan: function() {
		for (var dotsIter in this.mapDots) {
			if (!this.mapDots[dotsIter].isAlive) {
				//check if dot should respawn
				if (this.mapDots[dotsIter].timeUntilAlive === 0) {
					this.mapDots[dotsIter].isAlive = true;
				} else {
					this.mapDots[dotsIter].timeUntilAlive--;
				}
			}
			if (this.mapDots[dotsIter].isSuper) {
				if (this.mapDots[dotsIter].superTimeout === 0) {
					this.mapDots[dotsIter].isSuper = false;
				} else {
					this.mapDots[dotsIter].superTimeout--;
				}
			}
		}
	},
	timeOutSuper(playerTeam) {
		var game = this;
		clearTimeout(game.timeOutSuperID);
		game.timeOutSuperID = setTimeout(function() {
			game.isSuperState[playerTeam] = false;
		}, game.superBuffDuration);
	},
	setPosition: function(playerId, player, io) {

		//round down the pacman position so it's on a precise tile
		player.x = (Math.floor(player.x / 16)) * 16;
		player.y = (Math.floor(player.y / 16)) * 16;

		this.players[playerId].x = player.x;
		this.players[playerId].y = player.y;
		this.players[playerId].dir = player.dir;

		var playerTeam = this.players[playerId].team;

		var currentDot;
		//collision without iteration
		if (this.mapDots[[player.x, player.y]]) {
			if (this.mapDots[[player.x, player.y]].isAlive) {
				if (this.mapDots[[player.x, player.y]].isSuper) {
					if (playerTeam == TEAM_GHOST) {
						this.isSuperState[TEAM_PACMAN] = false;
					} else {
						this.isSuperState[TEAM_GHOST] = false;
					}
					this.isSuperState[playerTeam] = true;
					this.timeOutSuper(playerTeam);
				}
				this.incScore(playerId);
				this.mapDots[[player.x, player.y]].isAlive = false;
				this.mapDots[[player.x, player.y]].timeUntilAlive = this.respawnTime;
			}
		}

		//collision between players
		for (var playerIter in this.players) {
			if (!this.players[playerIter].isAlive || playerIter === playerId) {
				continue;
			}
			if ((xDif = this.players[playerIter].x - player.x) > -16 &&
				xDif < 16) {
				if ((yDif = this.players[playerIter].y - player.y) > -16 &&
					yDif < 16) {
					if (this.players[playerIter].team === this.players[playerId].team) {
						//collision between two players of the same team
					} else {
						//collision between two players of different teams
						//if one team is in super state, the other is killed
						if (this.isSuperState[this.players[playerId].team]) {
							this.players[playerIter].isAlive = false;
							if (this.nPlayerTeam[this.players[playerIter].team] > 0) {
								this.nPlayerTeam[this.players[playerIter].team]--;
							}
						} else if (this.isSuperState[this.players[playerIter].team]) {
							this.players[playerId].isAlive = false;
							if (this.nPlayerTeam[this.players[playerId].team] > 0) {
								this.nPlayerTeam[this.players[playerId].team]--;
							}
						}
						//Player with lowest team score is killed
						else if (this.scores[this.players[playerIter].team] > this.scores[this.players[playerId].team]) {
							this.players[playerId].isAlive = false;
							if (this.nPlayerTeam[this.players[playerId].team] > 0) {
								this.nPlayerTeam[this.players[playerId].team]--;
							}
						} else if (this.scores[this.players[playerIter].team] < this.scores[this.players[playerId].team]) {
							this.players[playerIter].isAlive = false;
							if (this.nPlayerTeam[this.players[playerIter].team] > 0) {
								this.nPlayerTeam[this.players[playerIter].team]--;
							}
						}
						this.checkTeams(io);
					}
				}
			}
		} // fin for
	}
};