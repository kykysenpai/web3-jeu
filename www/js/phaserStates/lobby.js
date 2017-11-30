var lobby = {
	preload: function() {
		game.load.image('blankThumb', 'assets/blankImage.png');
		game.load.image('teamGhost', 'assets/teamGhost.png');
		game.load.image('teamPacman', 'assets/teamPacman.png');
		game.load.image('frame', 'assets/teamFrame.png');
		game.load.image('title', 'assets/title.png');
		game.load.image('bg', 'assets/bg.png');
	},
	create: function() {
		var teamHeight = 200;
		var bg = game.add.image(0, 0, 'bg');
		var title = game.add.image(0, 10, 'title');

		title.inputEnabled = true;
		title.events.onInputDown.add(function(clickedImage) {
			lobbySocket.close();
			game.state.start('bootState');
		}, this);

		this.nPlayerPacman = 0;
		this.nPlayerGhost = 0;
		this.reqPlayer = 0;

		lobbySocket = io('/lobbySocket');
		this.gameStateLabel = game.add.text(80, 80, '', {
			font: '30px Arial',
			fill: '#ffffff'
		});
		var frame1 = game.add.image(101, teamHeight, 'frame');
		var team1 = game.add.image(101, teamHeight, 'teamPacman');
		var frame2 = game.add.image(234, teamHeight, 'frame');
		var team2 = game.add.image(234, teamHeight, 'teamGhost');

		this.waitingForLabelPacman = game.add.text(115, teamHeight + 64, this.nPlayerPacman + '/' + this.reqPlayer, {
			font: '25px Arial',
			fill: '#ffffff'
		});
		this.waitingForLabelGhost = game.add.text(250, teamHeight + 64, this.nPlayerGhost + '/' + this.reqPlayer, {
			font: '25px Arial',
			fill: '#ffffff'
		});
		lobbySockets();
	},
	startGame: function() {
		lobbySocket.close();
		switch (chosenGameMode) {
			case 1:
				chosenGameModeInfos.safeTiles = [7, 14];
				chosenGameModeInfos.mapAsset = 'assets/pacman-map.json';
				chosenGameModeInfos.tilesAsset = 'assets/pacman-tiles.png';
				break;
			case 2:
				chosenGameModeInfos.mapAsset = 'assets/random-map-small.json';
				break;
			case 3:
				chosenGameModeInfos.mapAsset = 'assets/random-map-medium.json';
				break;
			case 4:
				chosenGameModeInfos.mapAsset = 'assets/random-map-large.json';
				break;
		}
		switch (chosenGameMode) {
			case 2:
			case 3:
			case 4:
				chosenGameModeInfos.safeTiles = [25, 30, 35, 40];
				chosenGameModeInfos.tilesAsset = 'assets/tiles.png';
				break;
		}
		game.state.start('PacmanGameClient');
	},
	updateWaiting: function(data) {
		this.nPlayerPacman = data.nPlayerTeam[TEAM_PACMAN];
		this.nPlayerGhost = data.nPlayerTeam[TEAM_GHOST];
		this.reqPlayer = data.reqPlayer;
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
			game.load.image('title', 'assets/title.png');
			game.load.image('bg', 'assets/bg.png');
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
	}
	socket.on('initSpawn', function(data) {
		playerInfos.x = data.x;
		playerInfos.y = data.y;
	});
	socket.emit('firstInit', playerInfos);
}
