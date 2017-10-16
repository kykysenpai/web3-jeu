exports.Game = function() {
	this.players = {};
};
exports.Game.prototype = {
	addPlayer: function(player) {
		this.players[player.id] = player;
		console.log("a new player connected to the game");
	},
	removePlayer: function(playerId) {
		console.log(this.players[playerId].name + ' was removed' +
			' from the game with id : ' + this.players[playerId].id);
		delete this.players[playerId];
	},
	setInfos: function(player) {
		this.players[player.id] = player;
		console.log(this.players[player.id].name + ' just set his informations');
	}
};
