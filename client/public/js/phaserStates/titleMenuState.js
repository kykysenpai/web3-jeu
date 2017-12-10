var chosenGameMode;
var chosenGameModeInfos = {
	safeTiles: null,
	mapAsset: null,
	tilesAsset: null
};

var TEAM_PACMAN = 0;
var TEAM_GHOST = 1;

var playerInfos = { //default
	authName: sessionStorage.getItem("authName"),
	team: TEAM_PACMAN,
	skin: 'pacman',
	x: 24,
	y: 24,
	dir: 4
};

var skinList = [];

skinList.push({
	name: 'batman',
	path: 'assets/playerSkins/batman.png'
}, {
	name: 'clone',
	path: 'assets/playerSkins/clone.png'
}, {
	name: 'darthVader',
	path: 'assets/playerSkins/darthVader.png'
}, {
	name: 'dragon',
	path: 'assets/playerSkins/dragon.png'
}, {
	name: 'ghost',
	path: 'assets/playerSkins/ghost.png'
}, {
	name: 'goku',
	path: 'assets/playerSkins/goku.png'
}, {
	name: 'greenBird',
	path: 'assets/playerSkins/greenBird.png'
}, {
	name: 'joker',
	path: 'assets/playerSkins/joker.png'
}, {
	name: 'lucario',
	path: 'assets/playerSkins/lucario.png'
}, {
	name: 'luigi',
	path: 'assets/playerSkins/luigi.png'
}, {
	name: 'mario',
	path: 'assets/playerSkins/mario.png'
}, {
	name: 'masterChief',
	path: 'assets/playerSkins/masterChief.png'
}, {
	name: 'pacman',
	path: 'assets/playerSkins/pacman.png'
}, {
	name: 'yellowBird',
	path: 'assets/playerSkins/yellowBird.png'
}
);

var titleMenuState = {
	preload: function() {
		game.load.image('levelThumb', 'assets/blankImage.png');
		game.load.image('default', 'assets/defaultThumb.png');
		game.load.image('randomS', 'assets/randomThumbS.png');
		game.load.image('randomM', 'assets/randomThumbM.png');
		game.load.image('randomL', 'assets/randomThumbL.png');
		game.load.image('defaultSnake', 'assets/defaultSnake.png');
		game.load.image('randomSSnake', 'assets/randomSSnake.png');
		game.load.image('randomMSnake', 'assets/randomMSnake.png');
		game.load.image('randomLSnake', 'assets/randomLSnake.png');

		game.load.image('title', 'assets/title.png');
		game.load.image('bg', 'assets/bg.png');
		game.load.image('mode', 'assets/mode.png');
		game.load.image('blackScreen', 'assets/blackScreen.png');
		game.load.image('replay', 'assets/replay.png');
	},
	create: function() {
		var bg = game.add.image(0, 0, 'bg');
		var mode = game.add.image(130, 130, 'mode');

		var defaultModeThumbs = ['default', 'randomS', 'randomM', 'randomL'] 
		var snakeModeThumbs = ['defaultSnake', 'randomSSnake', 'randomMSnake', 'randomLSnake']
		var j = 1;
		var nbGame = 4;
		for (var i = 0; i < nbGame; i++) {
			var thumb = game.add.image((400 / (nbGame + 1)) * (i + 1) - 32, 180, defaultModeThumbs[i]);
			var replay = game.add.image((400 / (nbGame + 1)) * (i + 1) - 32+19, 244, 'replay');
			thumb.levelNumber = j;
			replay.levelNumber = j;
			j++;
			thumb.useHandCursor = true;
			replay.useHandCursor = true;
			thumb.inputEnabled = true;
			replay.inputEnabled = true;
			thumb.input.useHandCursor = true;
			replay.input.useHandCursor = true;
			thumb.events.onInputDown.add(function(clickedImage) {
				chosenGameMode = clickedImage.levelNumber;
				game.state.start('selectPlayer');
			}, this);
			replay.events.onInputDown.add(function(clickedImage) {
				chosenGameMode = clickedImage.levelNumber;
				playerInfos.team = 0;
				switch(chosenGameMode){
					case 1:
						chosenGameModeInfos.safeTiles = [7, 14];
						chosenGameModeInfos.mapAsset = 'assets/pacman-map.json';
						chosenGameModeInfos.tilesAsset = 'assets/pacman-tiles.png';
						break;
					case 2:
                        chosenGameModeInfos.mapAsset = 'assets/random-map-small.json';
                        chosenGameModeInfos.safeTiles = [25, 30, 35, 40];
                        chosenGameModeInfos.tilesAsset = 'assets/tiles.png';
						break;
					case 3:
                        chosenGameModeInfos.mapAsset = 'assets/random-map-medium.json';
                        chosenGameModeInfos.safeTiles = [25, 30, 35, 40];
                        chosenGameModeInfos.tilesAsset = 'assets/tiles.png';
						break;
					case 4:
                        chosenGameModeInfos.mapAsset = 'assets/random-map-large.json';
                        chosenGameModeInfos.safeTiles = [25, 30, 35, 40];
                        chosenGameModeInfos.tilesAsset = 'assets/tiles.png';
						break;
				}
				game.state.start('ReplaySelector');
			}, this);
		}
		//var j = 1;
		for (var i = 0; i < nbGame; i++) {
			var thumb = game.add.image((400 / (nbGame + 1)) * (i + 1) - 32, 280, snakeModeThumbs[i]);
			var replay = game.add.image((400 / (nbGame + 1)) * (i + 1) - 32+19, 344, 'replay');
			thumb.levelNumber = j;
			replay.levelNumber = j;
			j++;
			thumb.useHandCursor = true;
			replay.useHandCursor = true;
			thumb.inputEnabled = true;
			replay.inputEnabled = true;
			thumb.input.useHandCursor = true;
			replay.input.useHandCursor = true;
			thumb.events.onInputDown.add(function(clickedImage) {
				chosenGameMode = clickedImage.levelNumber;
				game.state.start('selectPlayer');
			}, this);
			replay.events.onInputDown.add(function(clickedImage) {
				chosenGameMode = clickedImage.levelNumber;
				playerInfos.team = 0;
				switch(chosenGameMode){
					case 5:
						chosenGameModeInfos.safeTiles = [7, 14];
						chosenGameModeInfos.mapAsset = 'assets/pacman-map.json';
						chosenGameModeInfos.tilesAsset = 'assets/pacman-tiles.png';
						break;
					case 6:
                        chosenGameModeInfos.mapAsset = 'assets/random-map-small.json';
                        chosenGameModeInfos.safeTiles = [25, 30, 35, 40];
                        chosenGameModeInfos.tilesAsset = 'assets/tiles.png';
						break;
					case 7:
                        chosenGameModeInfos.mapAsset = 'assets/random-map-medium.json';
                        chosenGameModeInfos.safeTiles = [25, 30, 35, 40];
                        chosenGameModeInfos.tilesAsset = 'assets/tiles.png';
						break;
					case 8:
                        chosenGameModeInfos.mapAsset = 'assets/random-map-large.json';
                        chosenGameModeInfos.safeTiles = [25, 30, 35, 40];
                        chosenGameModeInfos.tilesAsset = 'assets/tiles.png';
						break;
				}
				game.state.start('ReplaySelector');
			}, this);
		}

		this.blackScreen = game.add.image(0, 0, 'blackScreen');
		var title = game.add.image(0, 10, 'title');
		title.inputEnabled = true;
		title.events.onInputDown.add(function(clickedImage) {
			game.state.start('bootState');
		}, this);
		title.input.useHandCursor = true;
	},
	update: function() {
		if (this.blackScreen.alpha > 0) {
			this.blackScreen.alpha -= 0.1;
		}
	}
};