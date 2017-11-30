var selectPlayer = {
	preload: function() {
		game.load.spritesheet('pacman', 'assets/playerSkins/pacman.png', 32, 32);
		game.load.image('blankThumb', 'assets/blankImage.png');
		game.load.image('title', 'assets/title.png');
		game.load.image('bg', 'assets/bg.png');
		game.load.image('teamGhost', 'assets/teamGhost.png');
		game.load.image('teamPacman', 'assets/teamPacman.png');
		game.load.image('teamFrame', 'assets/teamFrame.png');
		game.load.image('skinFrame', 'assets/skinFrame.png');
		game.load.image('start', 'assets/start.png');
		this.load.spritesheet('darthVader', 'assets/playerSkins/darthVader.png', 32, 32);
		this.load.spritesheet('batman', 'assets/playerSkins/batman.png', 32, 32);
		this.load.spritesheet('clone', 'assets/playerSkins/clone.png', 32, 32);
	},
	create: function() {
		var teamHeight = 160;
		var bg = game.add.image(0, 0, 'bg');
		var title = game.add.image(0, 10, 'title');
		var startThumb = game.add.image(125, 320, 'start');

		title.inputEnabled = true;
		title.input.useHandCursor = true;
		title.events.onInputDown.add(function(clickedImage) {
			game.state.start('bootState');
		}, this);

		startThumb.inputEnabled = true;
		startThumb.input.useHandCursor = true;
		startThumb.events.onInputDown.add(function() {
			game.state.start('lobby');
		}, this);

		var frame1 = game.add.image(101, teamHeight, 'teamFrame');
		var team1 = game.add.image(101, teamHeight, 'teamPacman');
		team1.team = TEAM_PACMAN;

		team1.inputEnabled = true;
		team1.input.useHandCursor = true;
		team1.events.onInputDown.add(function(clickedTeam) {
			playerInfos.team = clickedTeam.team;
			team2.alpha = 0.5;
			team1.alpha = 1;
		}, this);

		var frame2 = game.add.image(234, teamHeight, 'teamFrame');
		var team2 = game.add.image(234, teamHeight, 'teamGhost');
		team2.team = TEAM_GHOST;
		team2.alpha = 0.5;

		team2.inputEnabled = true;
		team2.input.useHandCursor = true;
		team2.events.onInputDown.add(function(clickedTeam) {
			playerInfos.team = clickedTeam.team;
			team1.alpha = 0.5;
			team2.alpha = 1;
		}, this);

		var skinFrame = game.add.image(72, 270, 'skinFrame');

		//all skins
		var thumb = game.add.sprite(80, 270, 'pacman', 0);
		thumb.skin = 'pacman';
		thumb.inputEnabled = true;
		thumb.events.onInputDown.add(function(clickedImage) {
			playerInfos.skin = clickedImage.skin;
		}, this);

		var thumb = game.add.sprite(117, 270, 'batman', 0);
		thumb.skin = 'batman';
		thumb.inputEnabled = true;
		thumb.events.onInputDown.add(function(clickedImage) {
			playerInfos.skin = clickedImage.skin;
		}, this);

		var thumb = game.add.sprite(154, 270, 'darthVader', 0);
		thumb.skin = 'darthVader';
		thumb.inputEnabled = true;
		thumb.events.onInputDown.add(function(clickedImage) {
			playerInfos.skin = clickedImage.skin;
		}, this);

		var thumb = game.add.sprite(191, 270, 'clone', 0);
		thumb.skin = 'clone';
		thumb.inputEnabled = true;
		thumb.events.onInputDown.add(function(clickedImage) {
			playerInfos.skin = clickedImage.skin;
		}, this);
	}
};
