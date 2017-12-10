var ReplaySelector = {
	preload: function() {
		game.load.image('title', 'assets/title.png');
		game.load.image('bg', 'assets/bg.png');
        game.load.image('replay', 'assets/replay.png');
        game.load.image('noreplay', 'assets/noreplay.png');
        console.log(chosenGameMode)
        switch(chosenGameMode){
            case 1:
                console.log("pass")
                game.load.json('replay', 'assets/replays/Default/replays.json');
                game.load.image('levelThumb', 'assets/defaultThumb.png');
                break;
            case 2:
                game.load.json('replay', 'assets/replays/Small/replays.json');
                game.load.image('levelThumb', 'assets/randomThumbS.png');
                break;
            case 3:
                game.load.json('replay', 'assets/replays/Medium/replays.json');
                game.load.image('levelThumb', 'assets/randomThumbM.png');
                break;
            case 4:
                game.load.json('replay', 'assets/replays/Large/replays.json');            
                game.load.image('levelThumb', 'assets/randomThumbL.png');
                break;
        }
	},
	create: function() {
		var bg = game.add.image(0, 0, 'bg');
        nbrReplay=0;
        nbrReplay=game.cache.getJSON('replay');
        if(nbrReplay==0){
            var noreplay = game.add.image(0, 0, 'noreplay');            
        }
		for (var i = 0; i < nbrReplay; i++) {
			var thumb = game.add.image(168, (400 / (nbrReplay + 1)) * (i + 1)+20, 'levelThumb');
			thumb.replayNumber = i;
			thumb.useHandCursor = true;
			thumb.inputEnabled = true;
			thumb.input.useHandCursor = true;
			thumb.events.onInputDown.add(function(clickedImage) {
                replayNum = clickedImage.replayNumber;                
				game.state.start('replay');
            }, this);
		}

		var title = game.add.image(0, 10, 'title');
		title.inputEnabled = true;
		title.events.onInputDown.add(function(clickedImage) {
			game.state.start('bootState');
		}, this);
		title.input.useHandCursor = true;
	},
	update: function() {
		
	}
};
