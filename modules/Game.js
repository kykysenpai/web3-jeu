exports.Game = function() {
	this.size = 256;
	this.grid = [];
	for (var i = 0; i < this.size; i++) {
		this.grid.push(1);
	}
	this.players = {};
	this.scores = [0, 0];
};
exports.Game.prototype = {
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
		console.log("Team 1: " + this.scores[0] + " - Team 2: " + this.scores[1]);
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
						//Player with highest score is killed
						if (this.scores[0] > this.scores[1]) {
							if (this.players[playerId].team == 1) {
								this.players[playerId].isAlive = false;
							} else if (this.players[playerIter].team == 1) {
								this.players[playerIter].isAlive = false;
							}
						} else if (this.scores[1] > this.scores[0]) {
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
