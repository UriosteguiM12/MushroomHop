class mushroomHop extends Phaser.Scene {
    constructor() {
        super("mushroomHop");
    }

    init() {
        this.ACCELERATION = 500;
        this.MAX_VELOCITY = 512;
        this.DRAG = 2000;
        this.JUMP_VELOCITY = -550;
        this.physics.world.gravity.y = 1600;
    }

    preload() {

        this.load.setPath('assets/');
        this.load.audio('jump', 'phaseJump2.ogg');
        this.load.audio('collect', 'tone1.ogg');
        this.load.audio('impact', 'impactBell_heavy_001.ogg');
    }
    create() {

        this.jumpSound = this.sound.add('jump');
        this.collectSound = this.sound.add('collect');
        this.impactSound = this.sound.add('impact');


        this.map = this.make.tilemap({ key: "platformer-level-1" });

        this.tileset = this.map.addTilesetImage("kenney_tilemap_packed", "kenney_tiles");

        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);

        this.coins = this.map.createFromObjects("Objects", {
            name: "coin",
            key: "kenney_tiles",
            frame: 151
        });

        this.spikes = this.map.createFromObjects("Danger", {
            name: "spike",
            key: "kenney_tiles",
            frame: 68
        });

        // Since createFromObjects returns an array of regular Sprites, we need to convert 
        // them into Arcade Physics sprites (STATIC_BODY, so they don't move) 
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.spikes, Phaser.Physics.Arcade.STATIC_BODY);

        // Create a Phaser group out of the array this.coins
        // This will be used for collision detection below.
        this.coinGroup = this.add.group(this.coins);
        this.spikeGroup = this.add.group(this.spikes);

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });


        // set up player avatar
        my.sprite.player = this.physics.add.sprite(200, 300, "platformer_characters", "tile_0000.png").setScale(SCALE)
        my.sprite.player.setCollideWorldBounds(true);

        my.sprite.player.setScale(1);
        my.sprite.player.setOrigin(0, 0);

        console.log("Sprite size:", my.sprite.player.width, my.sprite.player.height);
        console.log("Origin:", my.sprite.player.originX, my.sprite.player.originY);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.cameras.main.setBounds(0, 0, 2410, 450)
        this.physics.world.setBounds(0, 0, 2410, 450);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        //this.cameras.main.setZoom(this.SCALE);


        this.cameras.main.setZoom(2.5);
        this.cameras.main.followOffset.set(0, 150); // shift down to keep bottom half visible

        this.physics.world.drawDebug = false;
        this.physics.world.debugGraphic.clear();

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
            my.sprite.player.setGravityY(this.physics.world.gravity.y);
        } else {
            my.sprite.player.setGravityY(0);
        }

        // Jumping
        if (my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            this.jumpSound.play();
            my.sprite.player.setVelocityY(this.JUMP_VELOCITY);
        }

        // Handle collision detection with coins
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            this.collectSound.play();
            obj2.destroy(); // remove coin on overlap
        });

        // Handle collision detection with spikes
        this.physics.add.overlap(my.sprite.player, this.spikeGroup, (obj1, obj2) => {
            this.impactSound.play();
            obj2.destroy(); // remove spike on overlap
        });

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