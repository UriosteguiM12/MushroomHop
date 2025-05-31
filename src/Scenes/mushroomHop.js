class mushroomHop extends Phaser.Scene {
    constructor() {
        super("mushroomHop");
    }

    init() {
        this.ACCELERATION = 800;
        this.MAX_VELOCITY = 512;
        this.DRAG = 1152;
        this.JUMP_VELOCITY = -600;
        this.physics.world.gravity.y = 820;
    }

    create() {
        this.map = this.make.tilemap({ key: "platformer-level-1" });

        this.tileset = this.map.addTilesetImage("kenney_tilemap_packed", "kenney_tiles");

        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);

        this.groundLayer.setScale(2.0);

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });


        // set up player avatar
        my.sprite.player = this.physics.add.sprite(game.config.width/4, game.config.height/2, "platformer_characters", "tile_0020.png").setScale(SCALE)
        my.sprite.player.setCollideWorldBounds(true);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);


        this.cameras.main.setBounds(0, 0,4800, 800);
        this.physics.world.setBounds(0, 0, 4800, 800);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

    }

    update() {

        // Horizontal movement
        if (cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
        } else if (cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
        } else {
            my.sprite.player.setAccelerationX(0);
        }

        // Apply max speed
        if (Math.abs(my.sprite.player.body.velocity.x) > this.MAX_VELOCITY) {
            my.sprite.player.setVelocityX(Phaser.Math.Clamp(my.sprite.player.body.velocity.x, -this.MAX_VELOCITY, this.MAX_VELOCITY));
        }

        // Grounded drag
        if (my.sprite.player.body.blocked.down) {
            my.sprite.player.setDragX(this.DRAG);
        } else {
            my.sprite.player.setDragX(0);
        }

        // Gravity multiplier when falling
        if (!my.sprite.player.body.blocked.down && my.sprite.player.body.velocity.y > 0) {
            my.sprite.player.setGravityY(this.physics.world.gravity.y * 1.5);
        } else {
            my.sprite.player.setGravityY(0);
        }

        // Jumping
        if (my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.sprite.player.setVelocityY(this.JUMP_VELOCITY);
        }

        /*
        if(cursors.left.isDown) {
            // TODO: have the player accelerate to the left
            
            my.sprite.player.body.setAccelerationX(-this.ACCELERATION);

            my.sprite.player.resetFlip();
            //my.sprite.player.anims.play('walk', true);

        } else if(cursors.right.isDown) {
            // TODO: have the player accelerate to the right

            my.sprite.player.body.setAccelerationX(this.ACCELERATION);

            my.sprite.player.setFlip(true, false);
            //my.sprite.player.anims.play('walk', true);

        } else {
            // TODO: set acceleration to 0 and have DRAG take over

            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG);

            //my.sprite.player.anims.play('idle');
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            //my.sprite.player.anims.play('jump');
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            // TODO: set a Y velocity to have the player "jump" upwards (negative Y direction)

            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);

        }
        */
    }
}