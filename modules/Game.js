exports.Game = function() {
	this.players = {};
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
						this.players[playerIter].isAlive = false;
						this.players[playerId].isAlive = false;
					}
				}
			}
		}
	}
};
