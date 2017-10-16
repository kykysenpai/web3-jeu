$(function() {
	//form to test socket connection
	$('form[name=createUser] > button').click(function() {
		var data = {
			name: $('form[name=createUser] > input[name=name]').val(),
			x: 14, //should change later
			y: 17
		};
		socket.emit('user', data);
	});
});
