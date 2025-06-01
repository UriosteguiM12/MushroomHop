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

        this.load.multiatlas("kenny-particles", "kenny-particles.json", "./assets/");
        console.log(this.textures.get('kenny-particles').getFrameNames());
    }

    create() {
        this.scene.start("mushroomHop");
    }
}