var chosenGameMode;

var TEAM_PACMAN = 0;
var TEAM_GHOST = 1;

var playerInfos = { //default
	authName: sessionStorage.getItem("authName"),
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
		game.load.image('blackScreen', 'assets/blackScreen.png');
	},
	create: function() {
		var bg = game.add.image(0, 0, 'bg');
		var mode = game.add.image(130, 130, 'mode');

		var modeThumbs = ['default', 'randomS', 'randomM', 'randomL']
		var j = 1;
		var nbGame = 4;
		for (var i = 0; i < nbGame; i++) {
			var thumb = game.add.image((400 / (nbGame+1)) * (i+1)-32, 200, modeThumbs[i]);
			thumb.levelNumber = j++;
			thumb.inputEnabled = true;
			thumb.useHandCursor = true;
			thumb.inputEnabled = true;
			thumb.input.useHandCursor = true;
			thumb.events.onInputDown.add(function(clickedImage) {
				chosenGameMode = clickedImage.levelNumber;
				game.state.start('selectPlayer');
			}, this);
		}

		this.blackScreen = game.add.image(0,0,'blackScreen');
		var title = game.add.image(0, 10, 'title');		
		title.inputEnabled = true;
		title.events.onInputDown.add(function(clickedImage) {
			game.state.start('bootState');
		}, this);
		title.input.useHandCursor = true;
	},
	update: function(){
		if(this.blackScreen.alpha>0){
			this.blackScreen.alpha-=0.1;
		}
	}
};
