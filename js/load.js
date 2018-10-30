var loadState = {
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
    game.load.spritesheet('Baddie', 'assets/baddie.png', 32, 32)




  },

  create: function() {
    game.state.start('level'); //Load the menu
  }

};
