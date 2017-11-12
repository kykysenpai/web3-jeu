var chosenGameMode;

var playerInfos = { //default
	team: 1,
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
		for (var i = 0; i < 3; i++) {
			var thumb = game.add.image((game.width / 3) * i + 20, game.height / 2, 'levelThumb');
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
				/*
				switch (clickedImage.levelNumber) {
					case 1:
						this.startDefaultPacman();
						break;
					case 2:
						this.startRandomMapPacman();
						break;
					case 3:
						console.log('pas encore de jeu ici');
						break;
					default:
						console.log('erreur n* level');
				}
				*/
			}, this);
		}
		var startLabel = game.add.text(80, game.world.height - 80, '1: default \n 2: Map random', {
			font: '25px Arial',
			fill: '#ffffff'
		});
	}
	/*,
		startDefaultPacman: function() {
			game.state.start('defaultPacman');
		},
		startRandomMapPacman: function() {
			game.state.start('randomMapPacman');
		}
		*/
};
