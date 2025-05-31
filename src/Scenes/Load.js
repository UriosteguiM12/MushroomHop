class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load character sprite (if it's a uniform grid)
        this.load.spritesheet("platformer_characters", "tilemap-characters_packed.png", {
            frameWidth: 18,  // Replace with correct frame size if needed
            frameHeight: 18
        });

        // Load tileset image used in Tiled
        this.load.image("kenney_tiles", "tilemap_packed.png");

        // Load exported tilemap (.tmj = Tiled Map JSON)
        this.load.tilemapTiledJSON("platformer-level-1", "platformer-level-1.tmj");
    }

    create() {
        this.scene.start("mushroomHop");
    }
}