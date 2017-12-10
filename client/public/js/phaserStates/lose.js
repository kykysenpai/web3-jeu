var lose = {
	preload: function() {
		game.load.image('bg', 'assets/bg.png');
		game.load.image('gameover', 'assets/gameover.png');
	},
	create: function() {
		lobbySocket = io('/lobbySocket');
		var bg = game.add.image(0, 0, 'bg');
		var gameover = game.add.image(0, 0, 'gameover');
		
		setTimeout(function() {
			game.state.start('titleMenuState');
		}, 5000);
	}
}
