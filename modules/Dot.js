exports.Dot = function(x, y) {
	this.isAlive = true;
	this.x = x;
	this.y = y;
	this.timeUntilAlive = 0;
	this.superTimeout = 0;
	this.isSuper = false;
}
