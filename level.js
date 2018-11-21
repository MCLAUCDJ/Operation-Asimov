var jumpforce = -350
var gravityforce = 400
var runspeed = 150
var jumpmultiplyer = 0
var levelState = {
  create: function() {
    //Some basic controls for the game
    this.controls = game.input.keyboard.addKeys(
      {
        'left': Phaser.KeyCode.A,
        'right': Phaser.KeyCode.D,
        'jump' : Phaser.KeyCode.W
      }
    );
    //Add a background
    game.add.sprite(0,0,'bg');

    platforms = game.add.group();  //A group can help organise sprites within the game
    platforms.enableBody = true;  //All objects in the group will have physics bodies (hitbox, gravity, velocity etc)
    var ground = platforms.create(0, game.world.height - 64, 'ground'); //Create a platform called ground at the bottom of the screen
    ground.scale.setTo(2,2);  //Scale the ground object to fill the bottom of the screen
    ground.body.immovable = true;  //The ground will not move when another object collides with it
    var ledge = platforms.create(400, 400, 'ground'); //Create another platform called ledge
    ledge.body.immovable = true;
    var ledge = platforms.create(-150, 250, 'ground'); //Create another platform, also called ledge
    ledge.body.immovable = true;

    baddie = game.add.sprite(90,218,'baddie')
    game.physics.arcade.enable(baddie);
    baddie.body.bounce.y = 0.2;
    baddie.body.gravity.y = gravityforce;
    baddie.body.collideWorldBounds = true;

    baddie.animations.add('left', [0,1], 10, true)
    baddie.animations.add('right', [2,3], 10, true)

    player = game.add.sprite(32, game.world.height - 150, 'player');
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.2;
    player.body.gravity.y = gravityforce;
    player.body.collideWorldBounds = true;

    player.animations.add('left', [0,1,2,3], 10, true);
    player.animations.add('right', [5,6,7,8], 10, true);
    player.animations.add('still', [4], 1, false);


    //Add any other objects that need to exist
    stars = game.add.group();
    game.physics.arcade.enable(stars);
    stars.enableBody = true;
    for (var i = 0; i < 12; i++) {
      newStar = stars.create(i * 70, 0, 'star');
      newStar.body.gravity.y = 6 + Math.random() * 1.1;
      newStar.body.bounce.y = 0.7 + Math.random() * 0.5;
      newStar.body.collideWorldBounds = true;
    }

    gems = game.add.group();
    game.physics.arcade.enable(gems);
    gems.enableBody = true;
    randX = game.rnd.integerInRange(1, 11);
    newGem = gems.create((randX * 70 + 32) , 0, 'gem');
    newGem.body.gravity.y = 6;
    newGem.body.bounce.y = 0.99;

    //Add any display elements (score, lives etc)
    scoreText = game.add.text(16, 16, 'Score: ' + game.global.score, { fontSize: '32px', fill: '#ff0000' });
    livesText = game.add.text(16, 42, 'Lives: ' + game.global.lives, { fontSize: '32px', fill: '#ff0000' });


  },

  update: function() {  //This function runs every frame
    //Collision detection
    var hitPlatform = game.physics.arcade.collide(player, platforms);

    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.collide(gems, platforms);
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(baddie, platforms);
    game.physics.arcade.overlap(player, platforms);
    game.physics.arcade.overlap(player, stars, this.CollectStar, null, this);
    game.physics.arcade.overlap(player, gems, this.CollectGem, null, this);
    game.physics.arcade.overlap(player, baddie, this.Bump, null, this);

    if (player.body.touching.down && hitPlatform){
      jumpmultiplyer = 0;
    }

    //Movement code

    if(player.x < baddie.x){
      baddie.body.velocity.x = -runspeed - 50;
      baddie.animations.play('left');
    }else if (player.x > baddie.x) {
      baddie.body.velocity.x = runspeed - 50;
      baddie.animations.play('right')
    }
    if(this.controls.left.isDown){
      player.body.velocity.x = -runspeed;
      player.animations.play('left');
    }else if (this.controls.right.isDown) {
      player.body.velocity.x = runspeed;
      player.animations.play('right')
    }else{
      player.animations.play('still')
      player.body.velocity.x = 0;
    }
    if(this.controls.jump.isDown && player.body.touching.down){
      player.body.velocity.y = jumpforce;
    }
    //Other code
  },


  CollectStar: function(player, star) {
    game.global.score += jumpmultiplyer * 10 +10;  //Increase the score by 10
    stars.remove(star);  //Remove the star from the group and the game
    scoreText.text = 'Score: ' + game.global.score;  //Update the UI display
    //  play.audio('point')
    jumpmultiplyer += 1;
    if(stars.total < 1) { //Has the player collected all the stars?
      game.state.start('end');
    }
  },

  CollectGem: function(player, gem) {
    game.global.score += jumpmultiplyer * 10 + 50;  //Increase the score by 50
    gems.remove(gem);
    scoreText.text = 'Score: ' + game.global.score;  //Update the UI display
    //  play.audio('point')
  },


  Win: function() {
    game.state.start('end');  //Go to the win state
  },

  toggleInvincible: function() {
    player.invincible = !player.invincible
  },

  invincibility_tint: function()  {
    player.tint = 0xff0000
  },

  invincibility_untint: function()  {
    player.tint = 0xffffff
  },

  Bump: function(player, baddie) {
    if (!player.invincible) { //We only damage the player if not invincible
      game.global.lives -= 1;      //we start damage flashing and toggle invincibility
      if (game.global.lives <= 0){
        game.state.start('end');
      }
      this.invincibility_tint();
      game.time.events.add(250, this.invincibility_untint, this);
      livesText.text = 'Lives: ' + game.global.lives;
      this.toggleInvincible();             //and then we add a timer to restore the player to a vulnerable state
      game.time.events.add(1500, this.toggleInvincible, this);
    }
  }

};
