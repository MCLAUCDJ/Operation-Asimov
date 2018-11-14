var levelState = {
  create: function() {

    //Some basic controls for the game
    game.add.sprite(0,0,'bg');
    this.controls = game.input.keyboard.addKeys(
      {
        'Up' : Phaser.KeyCode.W,
        'Down' : Phaser.KeyCode.S,
        'Left' : Phaser.KeyCode.A,
        'Right' : Phaser.KeyCode.D,
        'aimUp' : Phaser.KeyCode.UP,
        'aimDown' : Phaser.KeyCode.DOWN,
        'aimRight' : Phaser.KeyCode.RIGHT,
        'aimLeft' : Phaser.KeyCode.LEFT,
        'Use' : Phaser.KeyCode.SPACEBAR
      }
    );

    //Create the player
    player = game.add.sprite(game.world.centerX, game.world.centerY, 'Player')
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.anchor.setTo(0.5, 0.5)
    player.MoveSpeed = 300
    player.hacking = 0
    player.facing = 90;

    playerWeapon = player.addChild(game.make.sprite(0, 0, 'weapon'));
    playerWeapon.anchor.setTo(0.5, 0.5)

    USB = this.add.weapon(100, 'USB');
    USB.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    USB.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
    USB.bulletKillDistance = 80;
    USB.bulletAngleOffset = 0;
    USB.bulletSpeed = 400;
    USB.fireRate = 450
    USB.trackSprite(playerWeapon, 16, 0, true);
    USB.bulletRotateToVelocity;
    weaponType = USB;

    playerRifle = game.add.weapon(10,'playerBullet');
    playerRifle.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    playerRifle.bulletSpeed = 400;
    playerRifle.fireRate = 200;
    playerRifle.bulletAngleVariance = 5;
    playerRifle.trackSprite(playerWeapon, 16, 0, true);  //Fire from enemy position

    playerCharge = game.add.weapon(3,'playerPointyBullet');
    playerCharge.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    playerCharge.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
    playerCharge.bulletKillDistance = 30;
    playerCharge.bulletAngleOffset = 0;
    playerCharge.bulletSpeed = player.MoveSpeed + 20;
    playerCharge.trackSprite(playerWeapon, 16, 0, true);


    enemies = game.add.group(); //A group to hold the enemy objects
    enemies.enableBody = true;
    weapons = []; //An array to hold the weapon objects

    this.generateEnemy();

  },

  update: function() {  //This function runs every frame

    //Movement code
    this.PlayerMovement();
    this.EnemyController();
    this.CollisionDetect();

  },

  generateEnemy: function(){
    for(i = 0; i < 5; i++){
      //Create an enemy in a random position

      baddie = enemies.create(this.game.world.randomX, this.game.world.randomY, 'Baddie');
      baddie.anchor.setTo(0.5, 0.5);
      game.physics.arcade.enable(baddie);
      baddie.body.collideWorldBounds = true;
      baddie.hacked = false;
      baddie.facing = 0
      baddie.MoveSpeed

      //Add a weapon to each enemy
      Rifle = game.add.weapon(5,'bullet');
      Rifle.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
      Rifle.bulletSpeed = 200;
      Rifle.fireRate = 200;
      Rifle.bulletAngleVariance = 20;
      Rifle.trackSprite(baddie, 0, 0, true);  //Fire from enemy position
      weapons[i] = Rifle;  //Add weapon to array
    }
    //enemies.setAll(baddie.tint, 0xff0000);
  },

  CollisionDetect : function(){
    game.physics.arcade.collide(player, enemies);
    game.physics.arcade.collide(enemies);
    game.physics.arcade.overlap(USB.bullets, enemies, this.Hack, null, this);
    game.physics.arcade.overlap(playerRifle.bullets, enemies, this.Hack, null, this);
    game.physics.arcade.overlap(playerCharge.bullets, enemies, this.Hack, null, this);
    for(i = 0; i < weapons.length; i++){
      game.physics.arcade.overlap(weapons[i].bullets, player, this.Hit, null, this);
    }
  },
  //Fire each weapon stored in the array at the player
  EnemyController: function() {
    for(i = 0; i < weapons.length; i++){
      enemies.forEach(function(baddie){
        goAngle = game.physics.arcade.angleBetween(player, baddie);
        //  goAngle = (goAngle * (180/Math.PI)) - 180;
        baddie.rotation = goAngle;
        if(baddie.alive == true){
          weapons[i].fireAtSprite(player);
        }
        //game.time.events.loop(Phaser.Timer.SECOND, this.randomAngle(), this);

        //if(baddie.body.x > (game.world.x - 30)){
          game.physics.arcade.velocityFromAngle(baddie.facing, 0, baddie.body.velocity);
        //}else{
          game.physics.arcade.velocityFromAngle(baddie.facing, 100, baddie.body.velocity);
      //  }
      }, this);
    }
  },

  PlayerMovement : function(){
    if(this.controls.Up.isDown && this.controls.Left.isDown){
      game.physics.arcade.velocityFromAngle(-135, player.MoveSpeed, player.body.velocity);
    }else if(this.controls.Up.isDown && this.controls.Right.isDown){
      game.physics.arcade.velocityFromAngle(-45, player.MoveSpeed, player.body.velocity);
    }else if(this.controls.Down.isDown && this.controls.Right.isDown){
      game.physics.arcade.velocityFromAngle(45, player.MoveSpeed, player.body.velocity);
    }else if(this.controls.Down.isDown && this.controls.Left.isDown){
      game.physics.arcade.velocityFromAngle(135, player.MoveSpeed, player.body.velocity);
    }else if(this.controls.Up.isDown){
      game.physics.arcade.velocityFromAngle(-90, player.MoveSpeed, player.body.velocity);
    }else if(this.controls.Down.isDown){
      game.physics.arcade.velocityFromAngle(90, player.MoveSpeed, player.body.velocity);
    }else if(this.controls.Right.isDown){
      game.physics.arcade.velocityFromAngle(0, player.MoveSpeed, player.body.velocity);
    }else if(this.controls.Left.isDown){
      game.physics.arcade.velocityFromAngle(180, player.MoveSpeed, player.body.velocity);
    }else{
      player.body.velocity.y = 0;
      player.body.velocity.x = 0;
    }
    this.aim();

  },

  aim : function(){
    if(this.controls.aimUp.isDown && this.controls.aimLeft.isDown){
      player.facing = -135
    }else if(this.controls.aimUp.isDown && this.controls.aimRight.isDown){
      player.facing = -45
    }else if(this.controls.aimDown.isDown && this.controls.aimRight.isDown){
      player.facing = 45
    }else if(this.controls.aimDown.isDown && this.controls.aimLeft.isDown){
      player.facing = 135
    }else if(this.controls.aimUp.isDown){
      player.facing = -90
    }else if(this.controls.aimDown.isDown){
      player.facing = 90
    }else if(this.controls.aimRight.isDown){
      player.facing = 0
    }else if(this.controls.aimLeft.isDown){
      player.facing = 180
    }
    playerWeapon.angle = player.facing;
    if (this.controls.Use.isDown){
      console.log("bang");
      (weaponType).fire();
    }

  },



  Hit: function(player, bullet){
    console.log("ouch");
    bullet.kill();
  },

  Hack: function(bullet, enemy){
    console.log("hit");
    bullet.kill();
      if(weaponType == USB){
        player.body.x = enemy.body.x;
        player.body.y = enemy.body.y;
      }
    horse = enemies.getIndex(enemy);
    enemy.kill();
    enemy.alive = false;
    weapons.splice(horse, 1);
    weaponType = playerRifle;

  }

};
