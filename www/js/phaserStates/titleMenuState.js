var chosenGameMode;

var TEAM_PACMAN = 0;
var TEAM_GHOST = 1;

var playerInfos = { //default
	team: TEAM_PACMAN,
	skin: 'pacman',
	x: 24,
	y: 24,
	dir: 4
}

var titleMenuState = {
	preload: function() {
		game.load.image('levelThumb', 'assets/blankImage.png');
		game.load.image('default', 'assets/defaultThumb.png');
		game.load.image('randomS', 'assets/randomThumbS.png');
		game.load.image('randomM', 'assets/randomThumbM.png');
		game.load.image('randomL', 'assets/randomThumbL.png');
		game.load.image('title', 'assets/title.png');
		game.load.image('bg', 'assets/bg.png');
		game.load.image('mode', 'assets/mode.png');
		
	},
	create: function() {
		/*
		var nameLabel = game.add.text(80, 80, 'Pacman', {
			font: '50px Arial',
			fill: '#ffffff'
		});
		*/
		var bg = game.add.image(0, 0, 'bg');
		var title = game.add.image(0, 10, 'title');
		var mode = game.add.image(130, 130, 'mode');
		
		var modeThumbs = ['default', 'randomS', 'randomM', 'randomL']
		var j = 1;
		var nbGame = 4;
		for (var i = 0; i < nbGame; i++) {
			var thumb = game.add.image((400 / (nbGame+1)) * (i+1)-32, 200, modeThumbs[i]);
			thumb.levelNumber = j++;
			thumb.inputEnabled = true;
			thumb.useHandCursor = true;
			var levelText = game.add.text(0, 0, thumb.levelNumber, {
				font: "24px Atiat",
				fill: "#000000"
			});
			thumb.addChild(levelText);
			thumb.inputEnabled = true;
			thumb.events.onInputDown.add(function(clickedImage) {
				chosenGameMode = clickedImage.levelNumber;
				game.state.start('selectPlayer');
			}, this);
		}
		/*
		var startLabel = game.add.text(80, 240, '1: default \n2: Map random small \n3: Map random medium \n4: Map random large', {
			font: '25px Arial',
			fill: '#ffffff'
		});
		*/
	}
};
