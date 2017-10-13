var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);


app.set('port', (process.env.PORT || 5000));
//www is the public directory served to clients
app.use(express.static(__dirname + '/www'));

//get at root
app.get('/', function(req, res) {
	res.sendFile('www/index.html');
});

//socket managing
io.on('connection', function(socket) {
	console.log("A websocket connected");
	socket.on('disconnect', function() {
		console.log("A websocket disconnected");
	});
});

server.listen(app.get('port'), function() {
	console.log("Pacman is listening on port " + app.get('port'));
});
