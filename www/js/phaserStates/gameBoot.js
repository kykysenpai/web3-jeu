var bootState = {
	create: function() {
		game.physics.startSystem(Phaser.Physics.ARCADE);
		//game.state.start('titleMenuState');
		game.state.start('defaultPacman');
	}
}
