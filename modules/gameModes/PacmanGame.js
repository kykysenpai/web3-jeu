const fs = require("fs");
const path = require('path');

var replayPath = './client/build/assets/replays/';
var TEAM_PACMAN = 0;
var TEAM_GHOST = 1;
exports.PacmanGame = function(properties, updateLobby, size) {
	//players waiting
	this.waitingRoom = {};
	this.nPlayerWaitingRoom = 0;
	this.nbrReplay = 0;
	this.replay = [
		[], //Players
		[], //Dots
		[] //Scores
	];

	var SpawnPositions = require(__dirname + '/SpawnPositions.js');

	this.respawnTime = properties.get('respawnTime');
	this.superBuffDuration = properties.get('superBuffDuration');
	this.startOfTheGameTimeoutDuration = properties.get('startOfTheGameTimeoutDuration');

	this.size = size;
	var map;
	switch (size) {
		case 'Default':
			map = require(__dirname + '/../../client/public/assets/pacman-map.json');
			this.reqPlayer = properties.get('reqPlayerDefault');
			this.spawnPos = SpawnPositions.default(map.width, map.height);
			this.room = 'defaultPacmanRoom';
			break;
		case 'Small':
			map = require(__dirname + '/../../client/public/assets/random-map-small.json');
			this.reqPlayer = properties.get('reqPlayerSmall');
			this.spawnPos = SpawnPositions.small(map.width, map.height);
			this.room = 'randomMapPacmanRoomS';
			break;
		case 'Medium':
			map = require(__dirname + '/../../www/client/public/random-map-medium.json');
			this.reqPlayer = properties.get('reqPlayerMedium');
			this.spawnPos = SpawnPositions.medium(map.width, map.height);
			this.room = 'randomMapPacmanRoom';
			break;

		case 'Large':
			map = require(__dirname + '/../../www/client/public/random-map-large.json');
			this.reqPlayer = properties.get('reqPlayerLarge');
			this.spawnPos = SpawnPositions.large(map.width, map.height);
			this.room = 'randomMapPacmanRoomL';
			break;
	}
	this.height = map.height;
	this.width = map.width;

	//Cleaning replay directories
	//const directoryD = 'www/assets/replays/'+size+'/';
	const directoryD = replayPath + size + '/';

	fs.readdir(directoryD, (err, files) => {
		if (err) throw err;
		for (const file of files) {
			if (file === 'replays.json') continue
			fs.unlinkSync(path.join(directoryD, file), err => {
				if (err) throw err;
			});
		}
	});
	const dir = replayPath + this.size + '/replays.json';
	fs.writeFile(dir,
		JSON.stringify(0),
		function(err) {
			console.log("Wringting replays.json in " + size)
			if (err) {
				console.error('Crap happens');
			}
		}
	);

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

		this.writeReplay();
		this.replay = [
			[],
			[],
			[]
		];

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

	writeReplay: function() {
		//Make room for 0.json
		const dir3 = replayPath + this.size + '/2.json';
		const dir2 = replayPath + this.size + '/1.json';
		const dir1 = replayPath + this.size + '/0.json';
		const countDir = replayPath + this.size + '/replays.json';

		console.log(this.nbrReplay)
		switch (this.nbrReplay) {
			case 3: //Deleting oldest replay
				fs.unlinkSync(dir3, err => {
					if (err) throw err;
				});
			case 2: //Moving 1.json to 2.json
				fs.renameSync(dir2, dir3, function(err) {
					if (err) console.log('ERROR: ' + err);
				});
			case 1: //Moving 0.json to 1.json
				fs.renameSync(dir1, dir2, function(err) {
					if (err) console.log('ERROR: ' + err);
				});
				break;
		}
		//Saving replay to 0.json
		fs.writeFileSync(dir1,
			JSON.stringify(this.replay),
			function(err) {
				if (err) {
					console.error('Crap happens');
				}
			}
		);
		//Updating replay counter
		if (this.nbrReplay < 3) this.nbrReplay++;
		fs.writeFileSync(countDir,
			JSON.stringify(this.nbrReplay),
			function(err) {
				if (err) {
					console.error('Crap happens');
				}
			}
		);
	},

	initSocket: function(io, properties) {
		//game instance is saved because 'this''s value is replaced by 'io'
		//in the on connection function
		var millisecondsBtwUpdates = properties.get('millisecondsBtwUpdates');
		var millisecondsBtwUpdatesDots = properties.get('millisecondsBtwUpdatesDots');
		var millisecondsBtwNewSuperDot = properties.get('millisecondsBtwNewSuperDot');
		var millisecondsBtwReplaySave = properties.get('millisecondsBtwReplaySave');
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

		//Save game state to array in memory
		setInterval(function() {
			if (game.players !== undefined && game.scores !== undefined && game.mapDots !== undefined && game.isRunning) {
				//if(typeof this.replay != 'undefined' && this.replay[0].length>5000)return;
				playersCpy = [];
				dotsCpy = [];
				for (var player in game.players) {
					data = {};
					data.playerId = game.players[player].playerId;
					data.x = game.players[player].x;
					data.y = game.players[player].y;
					data.dir = game.players[player].dir;
					data.team = game.players[player].team;
					data.skin = game.players[player].skin;
					data.isAlive = game.players[player].isAlive;
					playersCpy.push(data);
				}
				for (var dot in game.mapDots) {
					data = {}
					data.x = game.mapDots[dot].x;
					data.y = game.mapDots[dot].y;
					data.isAlive = game.mapDots[dot].isAlive;
					dotsCpy.push(data);
				}
				game.replay[0].push(playersCpy);
				game.replay[1].push(dotsCpy);
				game.replay[2].push([game.scores[0], game.scores[1]]);
			}
		}, millisecondsBtwReplaySave);

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