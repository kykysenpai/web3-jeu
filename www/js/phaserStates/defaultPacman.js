//var map = "assets/pacman-map.json";
var showDebug = false;

var spawn1 = {
	x: 24,
	y: 24
}

var spawn2 = {
	x: 24,
	y: 24
}

var leftMobile = false;
var rightMobile = false;
var upMobile = false;
var downMobile = false;

/*
 Default Pacman game
*/
var defaultPacman = {
	/*
	 * Window auto adjust to client window size + start physics managing in phase
	 */
	init: function() {
		this.map = null;
		this.mapDots = null;
		this.layer = null;
		this.pacman = null;
		this.skin = null;
		this.safetile = [7, 14];
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
		this.playerId = null;

		Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
	},
	/*
	 * fetch all assets in /assets directory
	 */
	preload: function() {
		if (showDebug) {
			game.time.advancedTiming = true;
		}
		this.load.image('dot', 'assets/dot.png');
		this.load.image('tiles', 'assets/pacman-tiles.png');
		this.load.spritesheet('pacman', 'assets/pacman.png', 32, 32);
		this.load.tilemap('map', 'assets/pacman-map.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.spritesheet('buttonvertical', 'assets/button-vertical.png', 32, 48);
		this.load.spritesheet('buttonhorizontal', 'assets/button-horizontal.png', 48, 32);
	},
	/*
	 * Var initialisation of in game items
	 */
	create: function() {

		//socket = io('/defaultPacman');

		//mobile button var
		var buttonLeft = null;
		var buttonRight = null;
		var buttonUp = null;
		var buttonDown = null;

		this.map = this.add.tilemap('map'); //pacman-map.json
		this.map.addTilesetImage('pacman-tiles', 'tiles'); //pacman-tiles.png
		this.layer = this.map.createLayer('Pacman');
		this.dots = this.add.physicsGroup(); //Group of dots (= things to catch could be removed later if we don't need for multiplayer aspect)
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
		this.scoresDisplay.position.x = game.width / 2;
		//this.scoresDisplay.setTextBounds(0, 0, 400, 0);
		this.scoresDisplay.fixedToCamera = true;
		//this.map.createFromTiles(this.safetile, this.safetile, 'dot', this.layer, this.dots);
		this.world.setBounds(0, 0, 1920, 1920);
		//  The dots will need to be offset by 6px to put them back in the middle of the grid => I trust the dude from the tutorial lmao
		this.dots.setAll('x', 6, false, false, 1);
		this.dots.setAll('y', 6, false, false, 1);
		//  Pacman should collide with everything except the safe tile
		this.map.setCollisionByExclusion(this.safetile, true, this.layer);
		//skin is hardcoded, should be added to GUI later
		this.team = playerInfos.team;
		this.createLocalPlayer({
			skin: playerInfos.skin
		});

		//Enabling gamepad
		game.input.gamepad.start();
		pad1 = game.input.gamepad.pad1;

		//check if mobile device to render mobile button
		if (!game.device.desktop) {
			buttonLeft = game.add.button(0, 320, 'buttonhorizontal', null, this, 0, 1, 0, 1);
			buttonLeft.fixedToCamera = true;
			buttonLeft.events.onInputDown.add(function() {
				leftMobile = true;
			});
			buttonLeft.events.onInputOver.add(function() {
				leftMobile = true;
			});
			buttonLeft.events.onInputOut.add(function() {
				leftMobile = false;
			});
			buttonLeft.events.onInputUp.add(function() {
				leftMobile = false;
			});

			buttonUp = game.add.button(48, 272, 'buttonvertical', null, this, 0, 1, 0, 1);
			buttonUp.fixedToCamera = true;
			buttonUp.events.onInputDown.add(function() {
				upMobile = true;
			});
			buttonUp.events.onInputOver.add(function() {
				upMobile = true;
			});
			buttonUp.events.onInputUp.add(function() {
				upMobile = false;
			});
			buttonUp.events.onInputOut.add(function() {
				upMobile = false;
			});

			buttonDown = game.add.button(48, 352, 'buttonvertical', null, this, 0, 1, 0, 1);
			buttonDown.fixedToCamera = true;
			buttonDown.events.onInputDown.add(function() {
				downMobile = true;
			});
			buttonDown.events.onInputOver.add(function() {
				downMobile = true;
			});
			buttonDown.events.onInputUp.add(function() {
				downMobile = false;
			});
			buttonDown.events.onInputOut.add(function() {
				downMobile = false;
			});

			buttonRight = game.add.button(80, 320, 'buttonhorizontal', null, this, 0, 1, 0, 1);
			buttonRight.fixedToCamera = true;
			buttonRight.events.onInputDown.add(function() {
				rightMobile = true;
			});
			buttonRight.events.onInputOver.add(function() {
				rightMobile = true;
			});
			buttonRight.events.onInputUp.add(function() {
				rightMobile = false;
			});
			buttonRight.events.onInputOut.add(function() {
				rightMobile = false;
			});
		}
		defaultPacmanSockets();
	},
	render: function() {
		if (showDebug) {
			game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
			game.debug.body(this.pacman);
		}
	},
	updatePlayer: function(data) {
		var player;
		var speed = this.speed;
		if (!(player = this.players[data.playerId]))
			return;
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
	//create player movable with keys
	createLocalPlayer: function(data) {
		if (this.pacman) { // this.pacman is not null
			if (this.pacman.alive) { //check if alive before reinstancing
				return;
			}
		}
		this.skin = data.skin;
		var xSpawn;
		var ySpawn;
		if (this.team === TEAM_PACMAN) {
			xSpawn = spawn1.x;
			ySpawn = spawn1.y;
		} else if (this.team === TEAM_GHOST) {
			xSpawn = spawn2.x;
			ySpawn = spawn2.y;
		}
		//  Position Pacman at grid location 14x17 (the +8 accounts for his anchor) => still trusting
		this.pacman = this.add.sprite(xSpawn, ySpawn, data.skin, 0);
		this.pacman.anchor.set(0.5);
		this.pacman.animations.add('munch', [0, 1, 2, 1], 20, true); //Add crunching animation to the character with the pacman.png sprite
		this.physics.arcade.enable(this.pacman);
		this.pacman.body.setSize(16, 16, 0, 0);
		this.cursors = this.input.keyboard.createCursorKeys();
		this.pacman.play('munch'); //play animation
		this.move(Phaser.DOWN); //initial movement
		this.camera.follow(this.pacman); //follow pacman with camera
	},
	//instanciate external player
	createPlayer: function(data) {
		var newPlayer;
		if (data.team === this.team) {
			newPlayer = this.allies.create(data.x, data.y, data.skin);
		} else {
			newPlayer = this.enemies.create(data.x, data.y, data.skin);
		}
		newPlayer.anchor.set(0.5);
		newPlayer.animations.add('munch', [0, 1, 2, 1], 20, true);
		this.physics.arcade.enable(newPlayer);
		newPlayer.body.setSize(16, 16, 0, 0);
		newPlayer.play('munch');
		this.players[data.playerId] = newPlayer;
	},
	//instanciate a dot
	createDot: function(data) {
		var newDot = this.add.sprite(data.x, data.y, 'dot');
		if (!data.isAlive) {
			newDot.visible = false;
		}
		return newDot;
	},
	checkKeys: function() {

		if (game.input.gamepad.supported && game.input.gamepad.active && pad1.connected) {
			if ((pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) && this.current !== Phaser.LEFT) {
				this.checkDirection(Phaser.LEFT);
			} else if ((pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1) && this.current !== Phaser.RIGHT) {
				this.checkDirection(Phaser.RIGHT);
			} else if ((pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1) && this.current !== Phaser.UP) {
				this.checkDirection(Phaser.UP);
			} else if ((pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1) && this.current !== Phaser.DOWN) {
				this.checkDirection(Phaser.DOWN);
			} else {
				//  This forces them to hold the key down to turn the corner
				this.turning = Phaser.NONE;
			}
		} else {
			if ((this.cursors.left.isDown || leftMobile) && this.current !== Phaser.LEFT) {
				this.checkDirection(Phaser.LEFT);
			} else if ((this.cursors.right.isDown || rightMobile) && this.current !== Phaser.RIGHT) {
				this.checkDirection(Phaser.RIGHT);
			} else if ((this.cursors.up.isDown || upMobile) && this.current !== Phaser.UP) {
				this.checkDirection(Phaser.UP);
			} else if ((this.cursors.down.isDown || downMobile) && this.current !== Phaser.DOWN) {
				this.checkDirection(Phaser.DOWN);
			} else {
				//  This forces them to hold the key down to turn the corner
				this.turning = Phaser.NONE;
			}
		}
	},
	/*
	 * Check if player can go in the requested direction (there is no tile in the way)
	 */
	checkSafeTiles: function(turnTo) {
		var toReturn = false;
		for (var toCheck in this.safetile) {
			if (this.directions[turnTo].index === this.safetile[toCheck]) {
				toReturn = true;
			}
		}
		return toReturn;
	},
	checkDirection: function(turnTo) {
		if (this.turning === turnTo || this.directions[turnTo] === null ||
			!this.checkSafeTiles(turnTo)
		) {
			//  Invalid direction if they're already set to turn that way
			//  Or there is no tile there, or the tile isn't index 1 (a floor tile)
			return;
		}
		//  Check if they want to turn around and can
		if (this.current === this.opposites[turnTo]) {
			this.move(turnTo);
		} else {
			this.turning = turnTo;
			this.turnPoint.x = (this.marker.x * this.gridsize) + (this.gridsize / 2);
			this.turnPoint.y = (this.marker.y * this.gridsize) + (this.gridsize / 2);
		}
	},
	turn: function() {
		var cx = Math.floor(this.pacman.x);
		var cy = Math.floor(this.pacman.y);
		//  This needs a threshold, because at high speeds you can't turn because the coordinates skip past
		if (!this.math.fuzzyEqual(cx, this.turnPoint.x, this.threshold) || !this.math.fuzzyEqual(cy, this.turnPoint.y, this.threshold)) {
			return false;
		}
		//  Grid align before turning
		this.pacman.x = this.turnPoint.x;
		this.pacman.y = this.turnPoint.y;
		this.pacman.body.reset(this.turnPoint.x, this.turnPoint.y);
		this.move(this.turning);
		this.turning = Phaser.NONE;
		return true;
		//We should send info over socket for multiplayer at least here to tell server something moved
	},
	move: function(direction) {
		var speed = this.speed;
		if (direction === Phaser.LEFT || direction === Phaser.UP) {
			speed = -speed; //pacman is going towards negative x and y value (a canvas 0,0 is at top left)
		}
		if (direction === Phaser.LEFT || direction === Phaser.RIGHT) {
			this.pacman.body.velocity.x = speed;
		} else {
			this.pacman.body.velocity.y = speed;
		}
		//  Reset the scale and angle (Pacman is facing to the right in the sprite sheet)
		//  Only update sprite when change direction (not at EVERY frame)
		//	Send update to server (reduce rubberbanding effect caused by lag)
		if (this.current != direction) {
			this.pacman.scale.x = 1;
			this.pacman.angle = 0;
			if (direction === Phaser.LEFT) {
				this.pacman.scale.x = -1; //invert the sprite
			} else if (direction === Phaser.UP) {
				this.pacman.angle = 270;
			} else if (direction === Phaser.DOWN) {
				this.pacman.angle = 90;
			}
			this.current = direction;
		}

	},
	//emit current movement to server
	positionUpdate: function() {
		if (this.pacman === null) {
			return;
		}
		socket.emit('positionUpdate', {
			x: this.pacman.x,
			y: this.pacman.y,
			dir: this.current
		})
	},
	//kill local player
	destroyPlayer: function() {
		this.pacman.kill();
		//closeDefaultPacmanSockets();
		//socket.close();
		//game.state.start('titleMenuState');
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
		socket.close();
		if (this.team == winner) {
			game.state.start('win');
		} else {
			game.state.start('lose');
		}
	},
	/*
	 * Called at each frame
	 */
	update: function() {
		//check collides
		this.physics.arcade.collide(this.pacman, this.layer);

		//géré dans le serveur
		//this.physics.arcade.overlap(this.pacman, this.dots, this.eatDot, null, this);

		//collision entre les pacmans et le décor
		this.physics.arcade.collide(this.enemies, this.layer);
		this.physics.arcade.collide(this.allies, this.layer);

		this.marker.x = this.math.snapToFloor(Math.floor(this.pacman.x), this.gridsize) / this.gridsize;
		this.marker.y = this.math.snapToFloor(Math.floor(this.pacman.y), this.gridsize) / this.gridsize;
		//  Update our grid sensors
		this.directions[1] = this.map.getTileLeft(this.layer.index, this.marker.x, this.marker.y);
		this.directions[2] = this.map.getTileRight(this.layer.index, this.marker.x, this.marker.y);
		this.directions[3] = this.map.getTileAbove(this.layer.index, this.marker.x, this.marker.y);
		this.directions[4] = this.map.getTileBelow(this.layer.index, this.marker.x, this.marker.y);
		this.checkKeys();
		if (this.turning !== Phaser.NONE) {
			this.turn();
		}
		//sends info $HowManyInfoPerSecond times per second of current position
		//less should decrease server load but might bring collision problems and lags
		//FPS should be 60, if less performance problems, lags
		this.updateNeeded++;
		if (this.updateNeeded == (theoreticalFps / howManyInfoPerSecond)) {
			this.updateNeeded = 0;
			this.positionUpdate();
		}
	}
}

function defaultPacmanSockets() {

	//Another player disconnected
	socket.on('disconnectedUser', function(data) {
		game.state.callbackContext.killPlayer(data);
	});

	socket.on('endGame', function(winner) {
		game.state.callbackContext.endGame(winner);
	})

	//Getting all currently connected player
	socket.on('users', function(data) {
		game.state.callbackContext.playerId = data.playerId;
		for (var player in data.players) {
			if (player === data.playerId) {
				//doesn't create itself
				continue;
			}
			game.state.callbackContext.createPlayer(data.players[player]);
		}
		game.state.callbackContext.mapDots = {};
		for (var i in data.mapDots) {
			var dot = data.mapDots[i];
			var spriteDot = game.state.callbackContext.createDot(dot);
			game.state.callbackContext.mapDots[[dot.x, dot.y]] = spriteDot;
		}
	});

	//A new player connected
	socket.on('user', function(data) {
		game.state.callbackContext.createPlayer(data);
	});

	//Server sent current state
	socket.on('gameUpdate', function(infos) {
		var context = game.state.callbackContext;
		players = infos.players;
		for (var player in players) {
			//info sur sois même
			if (players[player].playerId === context.playerId) {
				if (!players[player].isAlive) {
					context.destroyPlayer();
				}
			}
			context.updatePlayer(players[player]);
		}

		//update score
		context.updateScores(infos.scores);

		//info dots
		if (context.mapDots != null) {
			dots = infos.dots;
			for (var i in dots) {
				if (dots[i].isAlive) {
					context.mapDots[i].visible = true;
				} else {
					context.mapDots[i].visible = false;
				}
			}
		}
	});

	//Ask servers for currently connected players
	socket.emit('gameStarted');
};
