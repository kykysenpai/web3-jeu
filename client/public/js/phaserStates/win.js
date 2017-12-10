var win = {
	preload: function() {
		game.load.image('bg', 'assets/bg.png');
		game.load.image('goodgame', 'assets/goodgame.png');
	},
	create: function() {
		lobbySocket = io('/lobbySocket');
		var bg = game.add.image(0, 0, 'bg');
		var gameover = game.add.image(0, 0, 'goodgame');

		setTimeout(function() {
			game.state.start('titleMenuState');
		}, 5000);
	}
}
