var TEAM_PACMAN = 0;
var TEAM_GHOST = 1;

exports.DefaultPacman = function(properties, updateLobby) {
	this.respawnTime = properties.get('respawnTime');
	//nbPlayer in each team required
	this.reqPlayer = properties.get('reqPlayerDefault');

	//players waiting
	this.waitingRoom = {};
	this.nPlayerWaitingRoom = 0;

	//spawn postitions of team pacman and ghost on default map
	this.spawnPos = [{
		x: 24,
		y: 232
	}, {
		x: 424,
		y: 232
	}];

	//players in game or ready for next game
	this.players = {};
	this.nPlayer = 0;
	this.nPlayerTeam = [0, 0];

	this.scores = [0, 0];
	this.isSuperState = [false, false];
	this.state = 'Waiting for players';
	this.timeOutSuperID = null;

	this.updateLobby = updateLobby;
	this.startGameId;

	//is the game running or waiting for players
	this.isRunning = false;

	var Dot = require(__dirname + '/../Dot.js').Dot;
	var map = require(__dirname + '/../../www/assets/pacman-map.json');

	this.mapDots = {};

	//fetch dots
	var height = map.height;
	var width = map.width;
	for (var i = 1; i < height - 1; i++) {
		for (var j = 1; j < width - 1; j++) {
			tile = map.layers[0].data[i * width + j];
			if (tile === 7) {
				this.mapDots[[j * 16, i * 16]] = new Dot(j * 16, i * 16);
			}
		}
	}
};

exports.DefaultPacman.prototype = {
	//add a player to the active game
	addPlayer: function(player) {
		this.players[player.playerId] = player;
		console.log("a new player connected to the game DefaultPacman");
		this.nPlayer++;
		this.nPlayerTeam[player.team]++;
		if (this.nPlayerTeam[TEAM_GHOST] >= this.reqPlayer && this.nPlayerTeam[TEAM_PACMAN] >= this.reqPlayer) {
			this.state = 'Starting the game ...';
			var thisContext = this;
			clearTimeout(this.startGameId);
			this.startGameId = setTimeout(function() {
				thisContext.emitLobby('startGame', null);
				console.log("start game");
				thisContext.state = 'Game in progress';
				thisContext.isRunning = true;
			}, 10000);
		}
		this.emitUpdateLobby();
	},
	//add a player to the waiting room for the next game
	addToWaitingRoom: function(player) {
		this.waitingRoom[player.playerId] = player;
		console.log("a new player was added to the game DefaultPacman\'s waiting room");
		this.nPlayerWaitingRoom++;
		this.emitUpdateLobby();
	},
	//send custom infos to the lobby websocket
	emitLobby: function(event, data) {
		this.updateLobby({
			room: 'defaultPacmanRoom',
			event: event,
			data: data
		});
	},
	//send current lobby infos to the lobby websocket
	emitUpdateLobby: function() {
		this.updateLobby({
			room: 'defaultPacmanRoom',
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
		if (!this.isRunning)
			return;
		if (this.nPlayerTeam[TEAM_GHOST] == 0) {
			console.log('Victoire team pacman');
			this.endGame(TEAM_PACMAN, io);
		} else if (this.nPlayerTeam[TEAM_PACMAN] == 0) {
			console.log('Victoire team ghost');
			this.endGame(TEAM_GHOST, io);
		}
	},
	//hard remove a player from current game
	removePlayer: function(playerId) {
		if (this.players[playerId]) {
			console.log(this.players[playerId].name + ' was removed' +
				' from the game DefaultPacman with id : ' + this.players[playerId].playerId);
			if (this.nPlayer > 0) {
				this.nPlayer--;
			}
			if (this.nPlayerTeam[this.players[playerId].team] > 0) {
				this.nPlayerTeam[this.players[playerId].team]--;
			}
			delete this.players[playerId];
		} else if (this.waitingRoom[playerId]) {
			console.log(this.waitingRoom[playerId].name + ' was removed' +
				' from the game DefaultPacman\'s waiting Room with id : ' + this.waitingRoom[playerId].playerId);
			this.nPlayerWaitingRoom--;
			delete this.waitingRoom[playerId];
		} else {
			console.log("removed a player that was nor in the active players nor in the waiting room");
			return;
		}
		if (!this.isRunning && (this.nPlayerTeam[TEAM_GHOST] < this.reqPlayer || this.nPlayerTeam[TEAM_PACMAN] < this.reqPlayer)) {
			this.state = 'Waiting for players';
			clearTimeout(this.startGameId);
		}
		this.emitUpdateLobby();
	},
	repawnDots: function() {
		for (var dot in this.mapDots) {
			this.mapDots[dot].isAlive = true;
		}
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
					console.log('added a new player to the defaultPacman\'s game');
				} else {
					game.addToWaitingRoom(player);
					console.log('added a new player to the defaultPacman\'s waitingRoom');
				}
				socket.emit('initSpawn', game.spawnPos[data.team]);
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

		/* hard respawn of all dots every x millis
		setInterval(function() {
			game.repawnDots();
		}, 30000);
		*/

		//set super dot randomly
		setInterval(function() {
			var keys = Object.keys(game.mapDots)
			game.mapDots[keys[keys.length * Math.random() << 0]].isSuper = true;
		}, 10000);

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
		}
	},
	timeOutSuper(playerTeam) {
		var game = this;
		clearTimeout(game.timeOutSuperID);
		game.timeOutSuperID = setTimeout(function() {
			game.isSuperState[playerTeam] = false;
		}, 10000);
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
