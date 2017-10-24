exports.Player = function(data) {
	this.playerId = data.playerId;
	this.x = data.x;
	this.y = data.y;
	this.dir = data.dir;
	this.team = data.team;
	this.skin = data.skin;
};
exports.Player.prototype = {

};
