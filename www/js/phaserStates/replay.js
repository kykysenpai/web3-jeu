var showDebug = false;
/*
 * Pacman replay player
*/
var replay = {
	/*
	 * Window auto adjust to client window size + start physics managing in phase
	 */
	init: function() {
		this.map = null;
		this.mapDots = {};
		this.layer = null;
		this.pacman = null;
		this.skin = null;
		this.safetile = chosenGameModeInfos.safeTiles;
		this.gridsize = 16;
		this.speed = 150;
		this.threshold = 3;
		this.networkThreshold = 15;
		this.marker = new Phaser.Point();
		this.turnPoint = new Phaser.Point();
		this.directions = [null, null, null, null, null];
		this.opposites = [Phaser.NONE, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP];
		this.current = Phaser.NONE;
		this.turning = Phaser.NONE;
		this.updateNeeded = 0;
		this.enemies = null;
		this.allies = null;
		this.players = {};
		this.scores = [0, 0];
		this.scoresDisplay = null;
		//Receives a random team, will be changed later
		this.team = null;
		this.enemyTeam = null;
		this.playerId = null;

		this.cursors = null;

		Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
	},
	/*
	 * fetch all assets in /assets directory
	 */
	preload: function() {
		switch(chosenGameMode){
			case 1:
				chosenGameMode='Default';
				break;
			case 2:
				chosenGameMode='Small';
				break;
			case 3:
				chosenGameMode='Medium';				
				break;
			case 4:
				chosenGameMode='Large';
			break;
		}
		game.load.json('replay', 'assets/replays/'+chosenGameMode+'/'+replayNum+'.json');
		if (showDebug) {
			game.time.advancedTiming = true;
		}
		this.load.image('dot', 'assets/dot.png');
		this.load.image('tiles', chosenGameModeInfos.tilesAsset);
		this.load.spritesheet('superPacman', 'assets/superPacman.png', 32, 32);
		this.load.spritesheet('badPacman', 'assets/badPacman.png', 32, 32);
		this.load.tilemap('map', chosenGameModeInfos.mapAsset, null, Phaser.Tilemap.TILED_JSON);
		this.load.spritesheet('buttonvertical', 'assets/button-vertical.png', 32, 48);
		this.load.spritesheet('buttonhorizontal', 'assets/button-horizontal.png', 48, 32);
		this.load.image('superDot', 'assets/superDot.png');
		for (var i = 0; i < skinList.length; i++) {
			this.load.spritesheet(skinList[i].name, skinList[i].path, 32, 32);
		}
		this.game.disableVisibilityChange = true;
	},
	/*
	 * Var initialisation of in game items
	 */
	create: function() {

		this.map = this.add.tilemap('map');
		this.map.addTilesetImage('pacman-tiles', 'tiles');
		this.layer = this.map.createLayer('Pacman');
		this.dots = this.add.physicsGroup();
		this.enemies = this.add.physicsGroup();
		this.allies = this.add.physicsGroup();
		this.scoresDisplay = this.add.text(0, 0, "000 | 000", {
			font: "12px Arial",
			backgroundColor: "#000000",
			fill: "#ffffff",
			align: "center",
			boundsAlignH: "center",
			boundsAlignV: "top"
		});
		this.scoresDisplay.position.x = 200;
		this.scoresDisplay.fixedToCamera = true;
		//change bounds to actual map size to allow camera follow out of the 400x400 window created initially
		this.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
		//  The dots will need to be offset by 6px to put them back in the middle of the grid => I trust the dude from the tutorial lmao
		this.dots.setAll('x', 6, false, false, 1);
		this.dots.setAll('y', 6, false, false, 1);
		//  Pacman should collide with everything except the safe tile
		this.map.setCollisionByExclusion(this.safetile, true, this.layer);
		//skin is hardcoded, should be added to GUI later
		this.team = playerInfos.team;
		if (this.team == TEAM_GHOST) {
			this.enemyTeam = TEAM_PACMAN;
		} else {
			this.enemyTeam = TEAM_GHOST;
		}

		this.replay = game.cache.getJSON('replay');
		this.stepReplay = 0;
		for (var playerNum in this.replay[0][0]) {
			var player = this.replay[0][this.stepReplay][playerNum];
			this.createPlayer(player);
		}
		//Timer to fetch data from replay:
		game.time.events.repeat(Phaser.Timer.SECOND * 0.025, this.replay[0].length, this.readData, this);

		cursors = game.input.keyboard.createCursorKeys();
	},
	render: function() {
		if (showDebug) {
			game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
			game.debug.body(this.pacman);
		}
	},
	readData:function(){
		for(playerNum in this.replay[0][this.stepReplay]){
			var player = this.replay[0][this.stepReplay][playerNum];
			this.updatePlayer(player);
		}

		for (var dotNum in this.replay[1][this.stepReplay]) {
			var dot = this.replay[1][this.stepReplay][dotNum]
			if(!([dot.x, dot.y] in this.mapDots)){
				if([dot.x, dot.y]=="16,16")console.log(dot.isAlive)
				var spriteDot = this.createDot(dot);
				this.mapDots[[dot.x, dot.y]] = spriteDot;
			}else if(!dot.isAlive){
				this.mapDots[[dot.x, dot.y]].visible=false;
			}else{
				this.mapDots[[dot.x, dot.y]].visible=true;
			}
		}

		this.updateScores(this.replay[2][this.stepReplay]);
		this.stepReplay++;
		if(this.stepReplay>=this.replay[0].length){
			this.endGame();
		}
	},
	updatePlayer: function(data) {
		var player;
		var speed = this.speed;
		if (!(player = this.players[data.playerId])){
			return;
		}
			
		//player died		
		if (!data.isAlive) {
			this.killPlayer({
				playerId: data.playerId
			});
			return;
		}

		player.scale.x = 1;
		player.angle = 0;
		if (data.dir === Phaser.LEFT) {
			player.scale.x = -1; //invert the sprite
			speed = -speed;
		} else if (data.dir === Phaser.UP) {
			player.angle = 270;
			speed = -speed
		} else if (data.dir === Phaser.DOWN) {
			player.angle = 90;
		}

		//regulate speed OR replace player if detla too big
		if (!this.math.fuzzyEqual(player.y, data.y, this.networkThreshold) || !this.math.fuzzyEqual(player.x, data.x, this.networkThreshold)) {
			player.x = data.x;
			player.y = data.y;
		} else {
			speed += this.math.max((data.x - player.x) * 2, (player.y - data.y));
		}

		if (data.dir === Phaser.LEFT || data.dir === Phaser.RIGHT) {
			player.body.velocity.x = speed;
		} else {
			player.body.velocity.y = speed;
		}
	},
	updateScores: function(scores) {
		this.scores = scores;
		this.scoresDisplay.setText(('000' + scores[0]).slice(-3) + " | " + ('000' + scores[1]).slice(-3));
		('0000' + scores[0]).slice(-4);
	},
	
	//instanciate external player
	createPlayer: function(data) {
		var newPlayer;
		//if (data.team === this.team) {
			newPlayer = this.allies.create(data.x, data.y, data.skin);
		//} else {
		//	newPlayer = this.enemies.create(data.x, data.y, data.skin);
		//}
		newPlayer.anchor.set(0.5);
		newPlayer.animations.add('munch', [0, 1, 2, 1], 20, true);
		newPlayer.chosenSkin = data.skin;
		this.physics.arcade.enable(newPlayer);
		newPlayer.body.setSize(16, 16, 0, 0);
		newPlayer.play('munch');
		this.players[data.playerId] = newPlayer;
	},
	//instanciate a dot
	createDot: function(data) {
		var newDot = this.dots.create(data.x, data.y, 'dot');
		if (!data.isAlive) {
			newDot.visible = false;
		}
		//if (data.isSuper) {
		//	newDot.loadTexture('superDot', 0, false);
		//} else {}
		return newDot;
	},
	
	//kill not local player
	killPlayer: function(data) {
		if (!this.players[data.playerId])
			return;
		this.players[data.playerId].kill();
		delete this.players[data.playerId];
		if (this.enemies[data.playerId]) {
			delete this.enemies[data.playerId];
		} else {
			delete this.allies[data.playerId];
		}
	},
	endGame: function(winner) {
		game.state.start('titleMenuState');
	},
	eatDot: function(pacman, dot) {
		dot.visible = false;
	},
	/*
	 * Called at each frame
	 */
	update: function() {
		this.physics.arcade.overlap(this.enemies, this.dots, this.eatDot, null, this);
		this.physics.arcade.overlap(this.allies, this.dots, this.eatDot, null, this);
		
		this.physics.arcade.collide(this.enemies, this.layer);
		this.physics.arcade.collide(this.allies, this.layer);

		if (cursors.up.isDown){
			game.camera.y -= 4;
		}else if (cursors.down.isDown){
			game.camera.y += 4;
		}
	
		if (cursors.left.isDown){
			game.camera.x -= 4;
		}else if (cursors.right.isDown){
			game.camera.x += 4;
		}
	}
}