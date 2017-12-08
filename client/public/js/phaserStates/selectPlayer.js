var selectPlayer = {
	preload: function() {
		game.load.image('blankThumb', 'assets/blankImage.png');
		game.load.image('title', 'assets/title.png');
		game.load.image('bg', 'assets/bg.png');
		game.load.image('teamGhost', 'assets/teamGhost.png');
		game.load.image('teamPacman', 'assets/teamPacman.png');
		game.load.image('teamFrame', 'assets/teamFrame.png');
		game.load.image('skinFrame', 'assets/skinFrame.png');
		game.load.image('start', 'assets/start.png');
		for (var i = 0; i < skinList.length; i++) {
			this.load.spritesheet(skinList[i].name, skinList[i].path, 32, 32);
		}
		$.ajax({
			url: '/infoPlayer',
			type: 'POST',
			data: {
				authName: sessionStorage.getItem("authName") ? sessionStorage.getItem("authName") : localStorage.getItem("authName")
			},
			success: function(ret) {
				//load les skins :D
			},
			error: function(ret) {

			}
		});
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

		var j = 80;
		for (var i = 0; i < skinList.length; i++) {
			var thumb = game.add.sprite(j, 270, skinList[i].name, 0);
			j += 37; //32px for sprite width + 5 for margin
			thumb.skin = skinList[i].name;
			thumb.inputEnabled = true;
			thumb.events.onInputDown.add(function(clickedImage) {
				playerInfos.skin = clickedImage.skin;
			}, this);
		}
	}
}
