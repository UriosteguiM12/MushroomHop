class Color extends Phaser.Scene {
    constructor() {
        super("Color");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 500;
        this.DRAG = 800;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -800;
    }

    create() {
        this.map = this.make.tilemap({ key: "platformer-level-1" });

        this.tileset = this.map.addTilesetImage("kenney-scribble", "kenney_tiles");

        this.layerOne = this.map.createLayer("Tile Layer 1", this.tileset, 0, 0);
        this.layerTwo = this.map.createLayer("Tile Layer 2", this.tileset, 0, 0);
        this.layerThree = this.map.createLayer("Tile Layer 3", this.tileset, 0, 0);

        this.layerOne.setScale(2.0);
        this.layerTwo.setScale(2.0);
        this.layerThree.setScale(2.0);

        // Make it collidable
        this.layerOne.setCollisionByProperty({
            collides: true
        });
        this.layerTwo.setCollisionByProperty({
            collides: true
        });
        this.layerThree.setCollisionByProperty({
            collides: true
        });

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(game.config.width/4, game.config.height/2, "platformer_characters", "tile_0115.png").setScale(SCALE)
        my.sprite.player.setCollideWorldBounds(true);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.layerOne);

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

    }

    update() {
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
    }
}