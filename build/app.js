var GameState = function(game) {

}

GameState.prototype.preload = function() {
  this.game.load.spritesheet('ship', 'ship1.png', 100, 100);
  this.game.load.image('ground', 'ground.png');
}

GameState.prototype.create = function() {
  this.game.stage.backgroundColor = 0x333333;

  this.ROTATION_SPEED = 180;     // degrees per second
  this.ACCELERATION = 175;       // pixels/second^2
  this.ANGULAR_ACCEL = 200;       // degrees per second^2
  this.MAX_ANGULAR_VELOCITY = 800;
  this.MAX_SPEED = 250;          // pixels/second
  this.HALF_PI = Math.PI / 2.0;
  this.GRAVITY = 110;
  this.AUTO_SPIN = true;

  this.ship = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'ship');
  this.ship.anchor.setTo(0.5, 0.6);
  this.ship.angle = 0;

  this.game.physics.enable(this.ship, Phaser.Physics.ARCADE);
  this.game.physics.arcade.gravity.y = this.GRAVITY;

  this.ship.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED);
  this.ship.body.maxAngular = this.MAX_ANGULAR_VELOCITY;

  // key bindings
  this.game.input.keyboard.addKeyCapture([
    Phaser.Keyboard.LEFT,
    Phaser.Keyboard.RIGHT,
    Phaser.Keyboard.UP,
    Phaser.Keyboard.DOWN
  ]);

  // Show FPS
  this.game.time.advancedTiming = true;
  this.fpsText = this.game.add.text(20, 20, '', {font: '16px Segoe UI', fill: '#ffffff' });

}

// The update method is called each frame
GameState.prototype.update = function() {
  if(this.game.time.fps !== 0) {
    this.fpsText.setText(this.game.time.fps + ' FPS');
  }

  // Keep the ship on the screen
  if (this.ship.x > this.game.width) this.ship.x = 0;
  if (this.ship.x < 0) this.ship.x = this.game.width;
  if (this.ship.y > this.game.height) this.ship.y = 0;
  if (this.ship.y < 0) this.ship.y = this.game.height;

  if (this.leftInputIsActive()) {
    this.ship.body.angularVelocity -= this.game.time.physicsElapsed * this.ANGULAR_ACCEL;
  } else if (this.rightInputIsActive()) {
    this.ship.body.angularVelocity += this.game.time.physicsElapsed * this.ANGULAR_ACCEL;;
  } else if (this.AUTO_SPIN && Math.abs(this.ship.body.angularVelocity) > 0.5) {
    if (this.ship.body.angularVelocity > 0) {
      this.ship.body.angularVelocity -= this.game.time.physicsElapsed * this.ANGULAR_ACCEL;
    } else {
      this.ship.body.angularVelocity += this.game.time.physicsElapsed * this.ANGULAR_ACCEL;
    }
  }

  if (this.upInputIsActive()) {
    // if the up key is down, that's thrust
    var thrustAngle = this.ship.rotation - this.HALF_PI;
    this.ship.body.acceleration.x = Math.cos(thrustAngle) * this.ACCELERATION;
    this.ship.body.acceleration.y = Math.sin(thrustAngle) * this.ACCELERATION;
    // Show the frame from the sprite sheet with the flame on
    // this.ship.frame = 1;
  } else {
    this.ship.body.acceleration.setTo(0,0);
    this.ship.frame = 0;
  }
}

// This function should return true when the player activates the "go left" control
// In this case, either holding the right arrow or tapping or clicking on the left
// side of the screen.
GameState.prototype.leftInputIsActive = function() {
  var isActive = false;

  isActive = this.input.keyboard.isDown(Phaser.Keyboard.LEFT);
  isActive |= (this.game.input.activePointer.isDown &&this.game.input.activePointer.x < this.game.width/4);

  return isActive;
};

// This function should return true when the player activates the "go right" control
// In this case, either holding the right arrow or tapping or clicking on the right
// side of the screen.
GameState.prototype.rightInputIsActive = function() {
  var isActive = false;

  isActive = this.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
  isActive |= (this.game.input.activePointer.isDown &&
    this.game.input.activePointer.x > this.game.width/2 + this.game.width/4);

  return isActive;
};

// This function should return true when the player activates the "jump" control
// In this case, either holding the up arrow or tapping or clicking on the center
// part of the screen.
GameState.prototype.upInputIsActive = function() {
  var isActive = false;

  isActive = this.input.keyboard.isDown(Phaser.Keyboard.UP);
  isActive |= (this.game.input.activePointer.isDown &&
    this.game.input.activePointer.x > this.game.width/4 &&
    this.game.input.activePointer.x < this.game.width/2 + this.game.width/4);

  return isActive;
};

var game = new Phaser.Game(1000, 800, Phaser.AUTO, 'game');
game.state.add('game', GameState, true);
