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

		game.add.text(60, 240, 'Pacmans', {
			font: '25px Arial',
			fill: '#ffffff'
		});
		game.add.text(300, 240, 'Ghosts', {
			font: '25px Arial',
			fill: '#ffffff'
		});
		this.waitingForLabelPacman = game.add.text(80, 320, this.nPlayerPacman + '/' + this.reqPlayer, {
			font: '25px Arial',
			fill: '#ffffff'
		});
		this.waitingForLabelGhost = game.add.text(320, 320, this.nPlayerGhost + '/' + this.reqPlayer, {
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
				game.state.start('randomMapPacmanS');
				break;
			case 3:
				game.state.start('randomMapPacman');
				break;
			case 4:
				game.state.start('randomMapPacmanL');
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
	lobbySocket.emit('joinLobby', chosenGameMode);
	switch (chosenGameMode) {
		case 1:
			socket = io('/defaultPacman');
			break;
		case 2:
			socket = io('/randomMapPacmanS');
			break;
		case 3:
			socket = io('/randomMapPacman');
			break;
		case 4:
			socket = io('/randomMapPacmanL');
			break;
		default:
			console.log('erreur n* level');
	}
	socket.on('initSpawn', function(data) {
		playerInfos.x = data.x;
		playerInfos.y = data.y;
	});
	socket.emit('firstInit', playerInfos);
}
