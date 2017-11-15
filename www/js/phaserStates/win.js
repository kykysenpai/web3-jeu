var win = {
	create: function() {
		lobbySocket = io('/lobbySocket');
		this.gameStateLabel = game.add.text(40, 40, 'Game won !', {
			font: '60px Arial',
			fill: '#ffffff'
		});
		setTimeout(function() {
			game.state.start('titleMenuState');
		}, 5000);
	}
}
