var lose = {
	create: function() {
		lobbySocket = io('/lobbySocket');
		this.gameStateLabel = game.add.text(40, 40, 'Game lost !', {
			font: '60px Arial',
			fill: '#ffffff'
		});
		setTimeout(function() {
			game.state.start('titleMenuState');
		}, 5000);
	}
}
