var TEAM_PACMAN = 0;
var TEAM_GHOST = 1;

exports.RandomMapPacmanS = function(updateLobby) {
	this.respawnTime = 800;
	//nbPlayer in each team required
	this.reqPlayer = 1;

	//players waiting
	this.waitingRoom = {};
	this.nPlayerWaitingRoom = 0;

	//players in game or ready for next game
	this.players = {};
	this.nPlayer = 0;
	this.nPlayerTeam = [0, 0];

	this.scores = [0, 0];
	this.state = 'Waiting for players';

	this.updateLobby = updateLobby;
	this.startGameId;
	this.isRunning = false;

	var Dot = require('../Dot.js').Dot;
	var map = require('../../www/assets/random-map-small.json');
	this.height = map.height;
	this.width = map.width
	console.log(this.width + " " + this.height);
	//spawn postitions of team pacman and ghost
	this.spawnPos = [
		[{
				x: 24,
				y: 24
			},
			{
				x: 24,
				y: 40
			},
			{
				x: 40,
				y: 24
			},
			{
				x: 40,
				y: 40
			}
		],
		[{
				x: 16 * (this.width - 2) + 8,
				y: 16 * (this.height - 2) + 8
			},
			{
				x: 16 * (this.width - 2) + 8,
				y: 16 * (this.height - 3) + 8
			},
			{
				x: 16 * (this.width - 3) + 8,
				y: 16 * (this.height - 2) + 8
			},
			{
				x: 16 * (this.width - 3) + 8,
				y: 16 * (this.height - 3) + 8
			}
		]
	];

	//this.mapDots = [];
	this.mapDots = {};
	//chopper les dots
	var height = map.height;
	var width = map.width;
	for (var i = 1; i < height - 1; i++) {
		for (var j = 1; j < width - 1; j++) {
			tile = map.layers[0].data[i * width + j];
			if (tile === 25 || tile === 30 || tile === 35 || tile === 40) {
				//this.mapDots.push(new Dot(j * 16 + 8, i * 16 + 8));
				this.mapDots[[j * 16, i * 16]] = new Dot(j * 16, i * 16);
			}
		}
	}
};
exports.RandomMapPacmanS.prototype = {
	addPlayer: function(player) {
		this.players[player.playerId] = player;
		console.log("a new player connected to the game RandomMapPacman");
		this.nPlayer++;
		this.nPlayerTeam[player.team]++;
		if (this.nPlayerTeam[TEAM_GHOST] >= this.reqPlayer && this.nPlayerTeam[TEAM_PACMAN] >= this.reqPlayer) {
			this.state = 'Starting the game ...';
			var thisContext = this;
			this.startGameId = setTimeout(function() {
				thisContext.emitLobby('startGame', null);
				thisContext.state = 'Game in progress';
				thisContext.isRunning = true;
			}, 10000);
		}
		this.emitUpdateLobby();
	},
	addToWaitingRoom: function(player) {
		this.waitingRoom[player.playerId] = player;
		console.log("a new player was added to the game randomMapPacman\'s waiting room");
		this.nPlayerWaitingRoom++;
		this.emitUpdateLobby();
	},
	emitLobby: function(event, data) {
		this.updateLobby({
			room: 'randomMapPacmanRoom',
			event: event,
			data: data
		});
	},
	emitUpdateLobby: function() {
		this.updateLobby({
			room: 'randomMapPacmanRoom',
			event: 'updateWaiting',
			data: {
				nPlayerTeam: this.nPlayerTeam,
				reqPlayer: this.reqPlayer,
				state: this.state
			}
		});
	},
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
	removePlayer: function(playerId) {
		if (this.players[playerId]) {
			console.log(this.players[playerId].name + ' was removed' +
				' from the game randomMapPacman with id : ' + this.players[playerId].playerId);
			if (this.nPlayer > 0) {
				this.nPlayer--;
			}
			if (this.nPlayerTeam[this.players[playerId].team] > 0) {
				this.nPlayerTeam[this.players[playerId].team]--;
			}
			delete this.players[playerId];
		} else if (this.waitingRoom[playerId]) {
			console.log(this.waitingRoom[playerId].name + ' was removed' +
				' from the game randomMapPacman\'s waiting Room with id : ' + this.waitingRoom[playerId].playerId);
			this.nPlayerWaitingRoom--;
			delete this.waitingRoom[playerId];
		} else {
			console.log("DISGUSTANG");
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
	initSocket: function(io, uuid, millisecondsBtwUpdates, millisecondsBtwUpdatesDots, Player) {
		//game instance is saved because 'this''s value is replaced by 'io'
		//in the on connection function
		var game = this;
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
					console.log('added a new player to the randomMapPacman\'s game');
				} else {
					game.addToWaitingRoom(player);
					console.log('added a new player to the randomMapPacman\'s waitingRoom');
				}
				console.log(game.nPlayerTeam);
				console.log(game.spawnPos[data.team][game.nPlayerTeam[data.team] - 1]);
				socket.emit('initSpawn', game.spawnPos[data.team][game.nPlayerTeam[data.team] - 1]);
				game.emitUpdateLobby();
				//envoie des infos du socket connectant a tout le monde
				//socket.broadcast.emit('user', game.players[socket.player.playerId]);
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
				console.log('a player socket disconnected');
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
				//socket.broadcast.emit('positionUpdate', data);
			});
		});

		setInterval(function() {
			io.emit('gameUpdate', {
				players: game.players,
				scores: game.scores,
				dots: game.mapDots
			});
		}, millisecondsBtwUpdatesDots);

		setInterval(function() {
			io.emit('gameUpdate', {
				players: game.players,
				scores: game.scores,
				dots: {} //game.mapDots
			});
			game.dotsLifeSpan();
		}, millisecondsBtwUpdates); //envoie les infos toutes les 50 millisecondes

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
	setPosition: function(playerId, player, io) {


		player.x = (((Math.floor(player.x / 16)) * 2) + 1) * 8;
		player.y = (((Math.floor(player.y / 16)) * 2) + 1) * 8;

		this.players[playerId].x = player.x;
		this.players[playerId].y = player.y;
		this.players[playerId].dir = player.dir;

		var currentDot;
		//collision without iteration
		if (this.mapDots[[player.x, player.y]]) {
			if (this.mapDots[[player.x, player.y]].isAlive) {
				this.incScore(playerId);
				this.mapDots[[player.x, player.y]].isAlive = false;
				this.mapDots[[player.x, player.y]].timeUntilAlive = this.respawnTime;
			}
		}
		/*
		//collision with a dot
		for (var dotsIter in this.mapDots) {
			if (!this.mapDots[dotsIter].isAlive) {
				continue;
			}
			if ((xDif = this.mapDots[dotsIter].x - player.x) > -16 &&
				xDif < 16) {
				if ((yDif = this.mapDots[dotsIter].y - player.y) > -16 &&
					yDif < 16) {
					if (this.mapDots[dotsIter].isAlive) {
						this.incScore(playerId);
					}
					this.mapDots[dotsIter].isAlive = false;
					this.mapDots[dotsIter].timeUntilAlive = this.respawnTime;
				}
			}
		}
		*/
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
						//Player with lowest team score is killed
						if (this.scores[TEAM_GHOST] > this.scores[TEAM_PACMAN]) {
							if (this.players[playerId].team == TEAM_PACMAN) {
								this.players[playerId].isAlive = false;
								if (this.nPlayerTeam[TEAM_PACMAN] > 0) {
									this.nPlayerTeam[TEAM_PACMAN]--;
								}
							} else if (this.players[playerIter].team == TEAM_PACMAN) {
								this.players[playerIter].isAlive = false;
								if (this.nPlayerTeam[TEAM_PACMAN] > 0) {
									this.nPlayerTeam[TEAM_PACMAN]--;
								}
							}
						} else if (this.scores[TEAM_PACMAN] > this.scores[TEAM_GHOST]) {
							if (this.players[playerId].team == TEAM_GHOST) {
								this.players[playerId].isAlive = false;
								if (this.nPlayerTeam[TEAM_GHOST] > 0) {
									this.nPlayerTeam[TEAM_GHOST]--;
								}
							} else if (this.players[playerIter].team == TEAM_GHOST) {
								this.players[playerIter].isAlive = false;
								if (this.nPlayerTeam[TEAM_GHOST] > 0) {
									this.nPlayerTeam[TEAM_GHOST]--;
								}
							}
						}
						this.checkTeams(io);
					}
				}
			}
		}
	}
};
