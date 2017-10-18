exports.Player = function(playerId) {
	this.playerId = playerId;
	this.name = null;
	this.x = null;
	this.y = null;
};
exports.Player.prototype = {
	movement: function(x, y) {
		this.x = x;
		this.y = y;
	},
	setName: function(name) {
		this.name = name;
	}
};
