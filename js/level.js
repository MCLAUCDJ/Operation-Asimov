var levelState = {
  create: function() {
    //Add a backgroung
    game.add.sprite(0,0,'bg');

    //Some basic controls for the game
    this.controls = game.input.keyboard.addKeys(
      {
        'Up':Phaser.KeyCode.W,
        'Down':Phaser.KeyCode.S,
        'Left':Phaser.KeyCode.A,
        'Right':Phaser.KeyCode.D,
        'Use':Phaser.KeyCode.SPACEBAR,
      }
    );

	  //Setting up the Player
	  player = game.add.sprite(game.world.centerX, game.world.centerY, 'Player')
	  game.physics.arcade.enable(player);
	  player.body.collideWorldBounds = true;
	  player.anchor.setTo(0.5, 0.5)
	  player.walkSpeed = 300
	  MoveSpeed = player.walkSpeed
	  player.hacking = 0
	  player.facing = 90;

    this.generateEnemy();

    //Setting up weapons
    playerWeapon = player.addChild(game.make.sprite(12, 24, 'weapon'));
    playerWeapon.anchor.setTo(0.5, 0.5)

	  USB = this.add.weapon(1, 'USB');
	  USB.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	  USB.bulletAngleOffset = 0;
	  USB.bulletSpeed = 400;
	  USB.trackSprite(playerWeapon, 0, 16, true);
	  USB.bulletRotateToVelocity;




    //Add any display elements (score, lives etc)
  },

  update: function() {  //This function runs every frame
    this.CollisionDetect();
    this.PlayerController();
    this.EnemyController();
  //Other code
  },


  CollisionDetect: function(){
    if(player.haking = 0){
      game.physics.arcade.collide(player, this.enemies, this.hit, null, this);
    }
    game.physics.arcade.collide(USB, this.enemies, this.hack, null, this);
  },

  PlayerController: function(){
    if(this.controls.Up.isDown && this.controls.Left.isDown){
		game.physics.arcade.velocityFromAngle(player.facing, MoveSpeed, player.body.velocity);
		player.facing = -135
    }else if(this.controls.Up.isDown && this.controls.Right.isDown){
		game.physics.arcade.velocityFromAngle(player.facing, MoveSpeed, player.body.velocity);
		player.facing = -45
    }else if(this.controls.Down.isDown && this.controls.Right.isDown){
		game.physics.arcade.velocityFromAngle(player.facing, MoveSpeed, player.body.velocity);
		player.facing = 45
    }else if(this.controls.Down.isDown && this.controls.Left.isDown){
		game.physics.arcade.velocityFromAngle(player.facing, MoveSpeed, player.body.velocity);
		player.facing = 135
    }else if(this.controls.Up.isDown){
		game.physics.arcade.velocityFromAngle(player.facing, MoveSpeed, player.body.velocity);
		player.facing = -90
    }else if(this.controls.Down.isDown){
		game.physics.arcade.velocityFromAngle(player.facing, MoveSpeed, player.body.velocity);
		player.facing = 90
    }else if(this.controls.Right.isDown){
		game.physics.arcade.velocityFromAngle(player.facing, MoveSpeed, player.body.velocity);
		player.facing = 0
    }else if(this.controls.Left.isDown){
		game.physics.arcade.velocityFromAngle(player.facing, MoveSpeed, player.body.velocity);
		player.facing = 180
    }else{
    player.body.velocity.y = 0;
	  player.body.velocity.x = 0;
	}
  this.aim();
	if (this.controls.Use.isDown){
		USB.fire();
    }
  },

  aim: function(){
    playerWeapon.angle = player.facing;
  },



  EnemyController: function(){
    /*if(enemy.hacked == 1 && enemy.inCamera){
      physics.arcade.moveToObject(enemy, this.player, enemy.walkSpeed)
    }else if(hacked == true){
      MoveSpeed = enemy.walkSpeed;
      this.PlayerMove();
    }*/
    enemy.forEach(function(baddie){
      goAngle = game.physics.arcade.angleBetween(player, baddie);
      goAngle = (goAngle * (180/Math.PI)) - 180;
      baddie.angle = goAngle;
      //for(var i = 0; i < enemy.burst; i++){
        Rifle.fireFrom.x = baddie.x;
        Rifle.fireFrom.y = baddie.y;
        Rifle.fire();
          //if(i >= enemy.burst)
            //i = 0
        //  }
    }, this);


  },

  generateEnemy: function(){
    //Setting up the Enemies
    enemy = game.add.group();
    baddie = enemy.create(this.game.world.randomX, this.game.world.randomY, 'Baddie')
    enemy.add(baddie);
    gun = game.add.group();

    for(var i = 0; i < 2; i++){

      baddie = enemy.create(this.game.world.randomX, this.game.world.randomY, 'Baddie')

      game.physics.arcade.enable(baddie);
      baddie.anchor.setTo(0.5, 0.5);
      enemy.walkSpeed = 200;
      enemy.burst = 5;

      //gun.add(Rifle);
    }
    Rifle = game.add.weapon(100, 'bullet');
    Rifle.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    Rifle.bulletAngleVariance = 10;
    Rifle.bulletSpeed = 400;
    Rifle.trackSprite(baddie, 0, 0, true);

  },

  Hit: function(attack, target){


  },

  //Hack: function(usb, enemy){
//    this.enemy.hack = true
//  },

};
