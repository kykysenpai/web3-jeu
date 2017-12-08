exports.Player = function(data) {
	this.authName = data.authName;
	this.playerId = data.playerId;
	this.x = data.x;
	this.y = data.y;
	this.dir = data.dir;
	this.team = data.team;
	this.skin = data.skin;
	this.isAlive = true;
};
exports.Player.prototype = {

};
