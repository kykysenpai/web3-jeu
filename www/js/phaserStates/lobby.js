var lobby = {
	init: function() {
		this.nPlayer = 0;
		this.reqPlayer = 0;
		this.titleLabel;
		this.waitingForLabel;
		this.gameStateLabel;
	},
	preload: function() {
		game.load.image('blankThumb', 'assets/blankImage.png');
	},
	create: function() {
		lobbySocket = io('/lobbySocket');
		this.gameStateLabel = game.add.text(80, 80, '', {
			font: '30px Arial',
			fill: '#ffffff'
		});
		this.waitingForLabel = game.add.text(80, game.world.height - 80, this.nPlayer + '/' + this.reqPlayer, {
			font: '25px Arial',
			fill: '#ffffff'
		});
		lobbySockets();
	},
	startGame: function() {
		lobbySocket.close();
		switch (chosenGameMode) {
			case 1:
				game.state.start('defaultPacman');
				break;
			case 2:
				game.state.start('randomMapPacman');
				break;
			case 3:
				console.log('pas encore de jeu ici');
				break;
			default:
				console.log('erreur n* level');
		}
	},
	updateWaiting: function(data) {
		this.nPlayer = data.nPlayer;
		this.reqPlayer = data.reqPlayer;
		this.gameStateLabel.setText(data.state);
		this.waitingForLabel.setText(this.nPlayer + '/' + this.reqPlayer);
	}
};

function lobbySockets() {
	lobbySocket.on('updateWaiting', function(data) {
		game.state.callbackContext.updateWaiting(data);
	});
	lobbySocket.on('startGame', function() {
		game.state.callbackContext.startGame();
	});
	lobbySocket.emit('joinLobby', chosenGameMode);
	switch (chosenGameMode) {
		case 1:
			socket = io('/defaultPacman');
			socket.emit('firstInit', playerInfos);
			break;
		case 2:
			break;
		case 3:
			console.log('pas encore de jeu ici');
			break;
		default:
			console.log('erreur n* level');
	}
}
