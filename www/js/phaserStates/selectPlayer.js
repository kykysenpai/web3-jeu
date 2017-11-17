var selectPlayer = {
	preload: function() {
		game.load.image('pacman', 'assets/pacman-preview.png');
		game.load.image('blankThumb', 'assets/blankImage.png');
	},
	create: function() {
		var startThumb = game.add.image(260, 320, 'blankThumb');
		var startThumbText = game.add.text(0, 0, 'Start', {
			font: "24px Atiat",
			fill: "#000000"
		});
		startThumb.addChild(startThumbText);
		startThumb.inputEnabled = true;
		startThumb.events.onInputDown.add(function() {
			game.state.start('lobby');
		}, this);

		game.add.text(20, 260, 'Team : ', {
			font: '25px Arial',
			fill: '#ffffff'
		});

		game.add.text(20, 260, 'Skin : ', {
			font: '25px Arial',
			fill: '#ffffff'
		});

		var team1 = game.add.image(130, 130, 'blankThumb');
		team1.team = TEAM_PACMAN;
		var teamText = game.add.text(0, 0, 'Pacman', {
			font: "24px Atiat",
			fill: "#000000"
		});
		team1.addChild(teamText);
		team1.inputEnabled = true;
		team1.events.onInputDown.add(function(clickedTeam) {
			playerInfos.team = clickedTeam.team;
		}, this);

		var team2 = game.add.image(260, 130, 'blankThumb');
		team2.team = TEAM_GHOST;
		var teamText = game.add.text(0, 0, 'Ghost', {
			font: "24px Atiat",
			fill: "#000000"
		});
		team2.addChild(teamText);
		team2.inputEnabled = true;
		team2.events.onInputDown.add(function(clickedTeam) {
			playerInfos.team = clickedTeam.team;
		}, this);

		var thumb = game.add.image(200, 270, 'pacman');
		thumb.skin = 'pacman';
		thumb.inputEnabled = true;
		thumb.events.onInputDown.add(function(clickedImage) {
			playerInfos.skin = clickedImage.skin;
		}, this);
	}
};
