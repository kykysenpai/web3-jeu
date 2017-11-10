exports.DefaultPacman = function() {
	this.size = 256;
	this.grid = [];
	for (var i = 0; i < this.size; i++) {
		this.grid.push(1);
	}
	this.players = {};
	this.scores = [0, 0];

	var Dot = require('../Dot.js').Dot;
	var map = require('../../www/assets/random-map.json');

	mapDots = [];
	//chopper les dots
	var height = map.height;
	var width = map.width;
	for (var i = 1; i<height-1; i++){
		for (var j = 1; j < width-1; j++){
			tile = map.layers[0].data[i*width+j];
			if(tile == 40 || tile == 25 || tile == 30 || tile == 35){
				mapDots.push(new Dot(i*16,j*16));
			}
		}
	}

	console.log(mapDots);

};
exports.DefaultPacman.prototype = {
	addPlayer: function(player) {
		this.players[player.playerId] = player;
		console.log("a new player connected to the game");
	},
	removePlayer: function(playerId) {
		if (!this.players[playerId])
			return;
		console.log(this.players[playerId].name + ' was removed' +
			' from the game with id : ' + this.players[playerId].playerId);
		delete this.players[playerId];
	},
	incScore: function(playerId) {
		if (!this.players[playerId])
			return;
		var team = this.players[playerId].team;
		if (team === 1) {
			this.scores[0]++;
		} else if (team === 2) {
			this.scores[1]++;
		}
		//console.log("Team 1: " + this.scores[0] + " - Team 2: " + this.scores[1]);
	},
	initSocket: function(io, uuid, millisecondsBtwUpdates, Player) {
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
				game.addPlayer(player);
				//envoie des joueurs déja présent au socket demandant
				socket.emit('users', {
					playerId: socket.player.playerId,
					players: game.players
				});
				//envoie des infos du socket connectant a tout le monde
				socket.broadcast.emit('user', game.players[socket.player.playerId]);
				socket.emit('dotInit', game.grid, game.scores);
			});

			//on disconnection from websocket the player is removed from the game
			socket.on('disconnect', function() {
				game.removePlayer(socket.player.playerId);
				io.emit('disconnectedUser', {
					playerId: socket.player.playerId
				});
			});

			socket.on('eatDot', function(dot) {
				if (game.grid[dot] != 0) {
					game.incScore(socket.player.playerId);
					game.grid[dot] = 0;
					io.emit('dotEated', dot, game.scores);
				}
			});

			//got position update from a socket
			socket.on('positionUpdate', function(data) {
				if (!game.players[socket.player.playerId]) {
					//received position from a player that didn't make his first init yet
					return; //return to avoid sending useless informations to clients
				}
				game.setPosition(socket.player.playerId, data);
				//broadcasts information to everyone except itself
				data.playerId = socket.player.playerId;
				//socket.broadcast.emit('positionUpdate', data);
			});
		});

		setInterval(function() {
			io.emit('gameUpdate', game.players, game.scores);
		}, millisecondsBtwUpdates); //envoie les infos toutes les 50 millisecondes

	},
	setPosition: function(playerId, player) {
		this.players[playerId].x = player.x;
		this.players[playerId].y = player.y;
		this.players[playerId].dir = player.dir;
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
						if (this.scores[1] > this.scores[0]) {
							if (this.players[playerId].team == 1) {
								this.players[playerId].isAlive = false;
							} else if (this.players[playerIter].team == 1) {
								this.players[playerIter].isAlive = false;
							}
						} else if (this.scores[0] > this.scores[1]) {
							if (this.players[playerId].team == 2) {
								this.players[playerId].isAlive = false;
							} else if (this.players[playerIter].team == 2) {
								this.players[playerIter].isAlive = false;
							}
						}
					}
				}
			}
		}
	}
};
