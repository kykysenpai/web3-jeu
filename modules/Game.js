exports.Game = function() {
	this.players = new Object();
};
exports.Game.prototype = {
	addPlayer: function(player) {
		this.players[player.playerId] = player;
		console.log("a new player connected to the game");
	},
	removePlayer: function(playerId) {
		console.log(this.players[playerId].name + ' was removed' +
			' from the game with id : ' + this.players[playerId].playerId);
		delete this.players[playerId];
	},
	setPosition: function(playerId, player) {
		this.players[playerId].x = player.x;
		this.players[playerId].y = player.y;
		this.players[playerId].dir = player.dir;
	},
	setTeam: function(playerId, team) {
		this.players[playerId].team = team;
	}
};
