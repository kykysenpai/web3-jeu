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
	},
	create: function() {
		var nameLabel = game.add.text(80, 80, 'Pacman', {
			font: '50px Arial',
			fill: '#ffffff'
		});

		var j = 1;
		var nbGame = 4;
		for (var i = 0; i < nbGame; i++) {
			var thumb = game.add.image((400 / nbGame) * i + 20, 200, 'levelThumb');
			thumb.levelNumber = j++;
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
		var startLabel = game.add.text(80, 320, '1: default \n 2: Map random small \n 3: Map random medium \n 4: Map random large', {
			font: '25px Arial',
			fill: '#ffffff'
		});
	}
};
