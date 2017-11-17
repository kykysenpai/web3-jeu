//init global variable socket
var socket;
var lobbySocket;


$(window).on('beforeunload', function() {
	socket.close();
	lobbySocket.close();
});
