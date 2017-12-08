var bootState = {
	preload: function() {
		game.load.image('bg', 'assets/bg.png');
		game.load.image('title', 'assets/title.png');
		game.load.image('mode', 'assets/mode.png');
		game.load.image('default', 'assets/defaultThumb.png');
		game.load.image('randomS', 'assets/randomThumbS.png');
		game.load.image('randomM', 'assets/randomThumbM.png');
		game.load.image('randomL', 'assets/randomThumbL.png');
	},
	create: function() {
		game.physics.startSystem(Phaser.Physics.ARCADE);
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;

		this.titleImg = this.add.image(0, 140, 'title');
		this.titleImg.alpha = 0
	},
	update: function() {
		if (this.titleImg.alpha < 1) {
			this.titleImg.alpha += 0.01;
		} else if (this.titleImg.y >= 10) {
			this.titleImg.y -= 5;
		} else {
			game.state.start('titleMenuState');
		}
	}

}
