var selectPlayer = {
	preload: function() {
		game.load.image('pacman', 'assets/pacman-preview.png');
		game.load.image('blankThumb', 'assets/blankImage.png');
		game.load.image('title', 'assets/title.png');
		game.load.image('bg', 'assets/bg.png');
		game.load.image('teamGhost', 'assets/teamGhost.png');
		game.load.image('teamPacman', 'assets/teamPacman.png');
		game.load.image('teamFrame', 'assets/teamFrame.png');
		game.load.image('skinFrame', 'assets/skinFrame.png');
		game.load.image('start', 'assets/start.png');		
	},
	create: function() {
		var teamHeight = 160;
		var title = game.add.image(0, 0, 'bg');
		var title = game.add.image(0, 10, 'title');
		var startThumb = game.add.image(125, 320, 'start');
		/*
		var startThumbText = game.add.text(0, 0, 'Start', {
			font: "24px Atiat",
			fill: "#000000"
		});
		startThumb.addChild(startThumbText);
		*/
		startThumb.inputEnabled = true;
		startThumb.events.onInputDown.add(function() {
			game.state.start('lobby');
		}, this);
		/*
		game.add.text(20, 130, 'Team : ', {
			font: '25px Arial',
			fill: '#ffffff'
		});172
		
		game.add.text(20, 260, 'Skin : ', {
			font: '25px Arial',
			fill: '#ffffff'
		});
		*/
		var frame1 = game.add.image(101, teamHeight, 'teamFrame');
		var team1 = game.add.image(101, teamHeight, 'teamPacman');
		team1.team = TEAM_PACMAN;
		/*
		var teamText = game.add.text(0, 0, 'Pacman', {
			font: "24px Atiat",
			fill: "#000000"
		});
		
		team1.addChild(teamText);
		*/
		team1.inputEnabled = true;
		team1.events.onInputDown.add(function(clickedTeam) {
			playerInfos.team = clickedTeam.team;
			team2.alpha = 0.5;
			team1.alpha = 1;
		}, this);
		
		var frame2 = game.add.image(234, teamHeight, 'teamFrame');
		var team2 = game.add.image(234, teamHeight, 'teamGhost');
		team2.team = TEAM_GHOST;
		team2.alpha = 0.5;
		/*
		var teamText = game.add.text(0, 0, 'Ghost', {
			font: "24px Atiat",
			fill: "#000000"
		});
		
		team2.addChild(teamText);
		*/
		team2.inputEnabled = true;
		team2.events.onInputDown.add(function(clickedTeam) {
			playerInfos.team = clickedTeam.team;
			team1.alpha = 0.5;
			team2.alpha = 1;
		}, this);
		
		var skinFrame = game.add.image(72, 270, 'skinFrame');		
		var thumb = game.add.image(168, 270, 'pacman');
		thumb.skin = 'pacman';
		thumb.inputEnabled = true;
		thumb.events.onInputDown.add(function(clickedImage) {
			playerInfos.skin = clickedImage.skin;
		}, this);
	}
};
