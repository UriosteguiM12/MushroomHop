class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.atlas("platformer_characters", "tilemap-characters_packed.png", "tilemap-characters-packed.json");

        this.load.spritesheet("kenney_tiles", "tilemap_packed.png", {
            frameWidth: 18,   // or 32, depending on your tile size
            frameHeight: 18 //match what you used in Tiled
        });

        // Load exported tilemap (.tmj = Tiled Map JSON)
        this.load.tilemapTiledJSON("platformer-level-1", "platformer-level-1.tmj");
    }

    create() {

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 0,
                end: 1,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0000.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0001.png" }
            ],
        });

        this.scene.start("mushroomHop");
    }
}