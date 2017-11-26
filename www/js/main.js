/*
 * Canvas init sizes, AUTO => CANVAS OR WEBGL chosen automatically in 4rth parameter div (id), I didn't put it in because it fucks up the scaling
 */

var size = 400
var game = new Phaser.Game(size, size, Phaser.AUTO, "gameDiv");


//Number or position update infos sent to servers per second if fps is accurate
var howManyInfoPerSecond = 10;
var theoreticalFps = 60;

//add all states
game.state.add('bootState', bootState);
game.state.add('titleMenuState', titleMenuState);
game.state.add('lobby', lobby);
game.state.add('defaultPacman', defaultPacman);
game.state.add('randomMapPacman', randomMapPacman);
game.state.add('randomMapPacmanS', randomMapPacmanS);
game.state.add('randomMapPacmanL', randomMapPacmanL);
game.state.add('selectPlayer', selectPlayer);
game.state.add('win', win);
game.state.add('lose', lose);

game.state.start('bootState');
