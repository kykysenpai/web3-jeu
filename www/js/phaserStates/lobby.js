var lobby = {
	/*init: function() {
		this.titleLabel;
		this.waitingForLabel;
		this.gameStateLabel;
	},*/
	preload: function() {
		game.load.image('blankThumb', 'assets/blankImage.png');
	},
	create: function() {
		this.nPlayerPacman = 0;
		this.nPlayerGhost = 0;
		this.reqPlayer = 0;

		lobbySocket = io('/lobbySocket');
		this.gameStateLabel = game.add.text(80, 80, '', {
			font: '30px Arial',
			fill: '#ffffff'
		});
		game.add.text(60, game.world.height - 160, 'Pacmans', {
			font: '25px Arial',
			fill: '#ffffff'
		});
		game.add.text(game.world.width - 100, game.world.height - 160, 'Ghosts', {
			font: '25px Arial',
			fill: '#ffffff'
		});
		this.waitingForLabelPacman = game.add.text(80, game.world.height - 80, this.nPlayerPacman + '/' + this.reqPlayer, {
			font: '25px Arial',
			fill: '#ffffff'
		});
		this.waitingForLabelGhost = game.add.text(game.world.width - 80, game.world.height - 80, this.nPlayerGhost + '/' + this.reqPlayer, {
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
		this.nPlayerPacman = data.nPlayerTeam[TEAM_PACMAN];
		this.nPlayerGhost = data.nPlayerTeam[TEAM_GHOST];
		this.reqPlayer = data.reqPlayer;
		this.gameStateLabel.setText(data.state);
		this.waitingForLabelPacman.setText(this.nPlayerPacman + '/' + this.reqPlayer);
		this.waitingForLabelGhost.setText(this.nPlayerGhost + '/' + this.reqPlayer);
	}
};

function lobbySockets() {
	lobbySocket.on('updateWaiting', function(data) {
		game.state.callbackContext.updateWaiting(data);
	});
	lobbySocket.on('startGame', function() {
		game.state.callbackContext.startGame();
	});
	lobbySocket.on('initSpawn', function(data) {
		console.log(data);
		playerInfos.x = data.x;
		playerInfos.y = data.y;
	});
	lobbySocket.emit('joinLobby', chosenGameMode);
	switch (chosenGameMode) {
		case 1:
			socket = io('/defaultPacman');
			break;
		case 2:
			socket = io('/randomMapPacman');
			break;
		case 3:
			alert('pas encore de jeu ici');
			break;
		default:
			console.log('erreur n* level');
	}
	socket.emit('firstInit', playerInfos);
}
