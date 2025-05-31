class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.atlas("platformer_characters", "tilemap_packed.png");

        // Load tilemap information
        this.load.image("kenney_tiles", "spritesheet_retina.png");                         // Packed tilemap
        this.load.tilemapTiledJSON("platformer-level-1", "level1.tmj");   // Tilemap in JSON
    }

    create() {
         // ...and pass to the next Scene
         this.scene.start("Color");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}