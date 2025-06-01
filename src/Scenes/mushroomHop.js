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

        this.hasEnded = false;
        this.gameOver = false;
    }

    preload() {

        this.load.setPath("./assets/");
        this.load.audio('jump', 'phaseJump2.ogg');
        this.load.audio('collect', 'tone1.ogg');
        this.load.audio('impact', 'impactBell_heavy_001.ogg');
        this.load.audio('one', 'jingles_PIZZI00.ogg');
        this.load.audio('two', 'jingles_PIZZI01.ogg');
        this.load.audio('three', 'jingles_PIZZI02.ogg');
    }
    create() {

        this.hasWon = false;
        
        this.restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        this.jumpSound = this.sound.add('jump');
        this.collectSound = this.sound.add('collect');
        this.impactSound = this.sound.add('impact');
        this.sound1 = this.sound.add('one');
        this.sound2 = this.sound.add('two');
        this.sound3 = this.sound.add('three');


        this.map = this.make.tilemap({ key: "platformer-level-1" });

        this.tileset = this.map.addTilesetImage("kenney_tilemap_packed", "kenney_tiles");

        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);

        this.coins = this.map.createFromObjects("Objects", {
            name: "coin",
            key: "kenney_tiles",
            frame: 151
        });

        // Initialize coin count
        this.coinCount = 0;
        this.healthCount = 5;

        // Add text to the scene positioned relative to the camera viewport (top-left corner)
        this.coinText = this.add.text(16, 16, 'Coins: 0', {
            fontSize: '18px',
            fill: '#fff',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 3,
        });

        // Add text to the scene positioned relative to the camera viewport (top-left corner)
        this.healthText = this.add.text(16, 16, 'Hearts: 5', {
            fontSize: '18px',
            fill: '#fff',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 3,
        });

        this.endText = this.add.text(0, 0, '', {
            fontSize: '32px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
        }).setScrollFactor(0).setDepth(100).setVisible(false);

        this.coinText.setPosition(435, 275);
        this.healthText.setPosition(435, 300);

        // Make the text stay fixed on the camera (UI)
        this.coinText.setScrollFactor(0);
        this.healthText.setScrollFactor(0);


        this.spikes = this.map.createFromObjects("Danger", {
            name: "spike",
            key: "kenney_tiles",
            frame: 68
        });

        this.flag = this.map.createFromObjects("Flag", {
            name: "flag",
            key: "kenney_tiles",
            frame: 131
        });

        // Since createFromObjects returns an array of regular Sprites, we need to convert 
        // them into Arcade Physics sprites (STATIC_BODY, so they don't move) 
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.spikes, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.flag, Phaser.Physics.Arcade.STATIC_BODY);

        // Create a Phaser group out of the array this.coins
        // This will be used for collision detection below.
        this.coinGroup = this.add.group(this.coins);
        this.spikeGroup = this.add.group(this.spikes);
        this.flagGroup = this.add.group(this.flag);

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        this.input.keyboard.on('keydown-R', () => {
            if (this.gameOver) {
                this.scene.restart();
            }
        });

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(200, 300, "platformer_characters", "tile_0000.png").setScale(SCALE)
        my.sprite.player.setCollideWorldBounds(true);

        my.sprite.player.setScale(1);
        my.sprite.player.setOrigin(0, 0);

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

        my.vfx = {};
        // movement vfx
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_09.png', 'smoke_06.png', 'smoke_07.png'],
            // TODO: Try: add random: true
            random: true,
            scale: {start: 0.1, end: 0.3},
            // TODO: Try: maxAliveParticles: 8,
            maxAliveParticles: 8,
            lifespan: 350,
            // TODO: Try: gravityY: -400,
            gravityY: -400,
            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.jump = this.add.particles(0, 0, "kenny-particles", {
            frame: ['magic_03.png', 'magic_04.png', 'magic_02.png', 'magic_01.png'],
            // TODO: Try: add random: true
            random: true,
            scale: {start: 0.1, end: 0.3},
            // TODO: Try: maxAliveParticles: 8,
            maxAliveParticles: 8,
            lifespan: 500,
            // TODO: Try: gravityY: -400,
            gravityY: -400,
            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.walking.stop();
        my.vfx.jump.stop();

        console.log(this.textures.get('kenney-particles').getFrameNames());

    }

    update() {

        // Horizontal movement
        if (cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();

            // particle following code
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2+20, my.sprite.player.displayHeight/2+10, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();

            }


        } else if (cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);

            // particle following code
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-20, my.sprite.player.displayHeight/2+10, false);

            my.vfx.walking.setParticleSpeed(-this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground

            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
                my.vfx.jump.stop();
            }


        } else {
            my.sprite.player.setAccelerationX(0);

            // have the vfx stop playing
            my.vfx.walking.stop();
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

            my.vfx.jump.startFollow(my.sprite.player, my.sprite.player.displayWidth/2, my.sprite.player.displayHeight/2+10, false);
            my.vfx.jump.setParticleSpeed(-this.PARTICLE_VELOCITY, 0);
            
            my.vfx.jump.explode(10, my.sprite.player.x, my.sprite.player.y + my.sprite.player.displayHeight / 2);

        }
        

        // Handle collision detection with coins
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            this.collectSound.play();
            obj2.destroy(); // remove coin on overlap
            this.coinCount++;
            this.coinText.setText('Coins: ' + this.coinCount);
        });

        // Handle collision detection with spikes
        this.physics.add.overlap(my.sprite.player, this.spikeGroup, (obj1, obj2) => {

            this.impactSound.play();
            obj2.destroy(); // remove spike on overlap
            this.healthCount--;
            this.healthText.setText('Hearts: ' + this.healthCount);

            if (this.healthCount <= 0 && !this.hasEnded) {

                this.gameOver = true;

                // Stop player movement
                my.sprite.player.setVelocity(0);
                my.sprite.player.body.enable = false;

                this.hasEnded = true;
                this.endText.setText("     GAME OVER\nPress R to Restart");
                this.endText.setVisible(true);
                this.endText.setPosition(550, 425);
            }
        });

        this.physics.add.overlap(my.sprite.player, this.flagGroup, (obj1, obj2) => {

            this.gameOver = true;

            // Stop player movement
            my.sprite.player.setVelocity(0);
            my.sprite.player.body.enable = false;

            if (!this.hasEnded) {
                this.hasEnded = true;
                this.sound1.play();
                this.endText.setText("     YOU WIN!\nPress R to Restart");
                this.endText.setVisible(true);
                this.endText.setPosition(550, 425);
            }
        });

        this.sound1.on('complete', () => {
            this.sound2.play();
            this.sound2.once('complete', () => {
                this.sound3.play();
            });
        });

        if (this.hasEnded && Phaser.Input.Keyboard.JustDown(this.restartKey)) {
            this.scene.restart(); // Restarts the current scene
        }

        if (this.gameOver) {
            return;
        }
    }
}