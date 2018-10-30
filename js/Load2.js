//Create a Phaser game with dimensions 800x600
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-world', { preload: preload, create: create, update: update, render: render });

//Add the different games states
game.state.add('menu', menuState);  //The main menu
game.state.add('level', levelState);  //The game itself
game.state.add('win', winState);    //Game over screen

//Any game spanning variables/settings could be placed here
game.global = {
  //score: 0,
  //lives: 3
},

  create: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);  //Start the physics engine
  },

  preload: function() {
    //Add a line of text to the screen
    loadingLabel = game.add.text(80, 150, 'loading...', {font: '30px Courier', fill: '#ffffff'});

    //Load all the assets
    //(the size and number of assets will slow this process down)
    game.load.image('bg', 'assets/background.png');
	  game.load.image('USB', 'assets/missile.png');
	  game.load.image('bullet', 'assets/missile_Mk1.png');
	  game.load.image('weapon', 'assets/Weapon.png');
    game.load.spritesheet('Player', 'assets/player.png', 32, 48)

  },

  create: function() {
    game.state.start('level'); //Load the menu
  }

};
