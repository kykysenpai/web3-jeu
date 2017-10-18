exports.Game = function() {
	this.players = {};
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
	setInfos: function(player) {
		this.players[player.id] = player;
		console.log(this.players[player.playerId].name + ' just set his informations');
	},
	setPosition: function(playerId, player) {
		this.players[playerId].x = player.x;
		this.players[playerId].y = player.y;
	}
};
