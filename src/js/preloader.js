(function() {
  'use strict';

  function Preloader() {
    this.asset = null;
    this.ready = false;
  }

  Preloader.prototype = {

    preload: function () {
      this.asset = this.add.sprite(226, 200, 'preloader');
      this.assetAlpha = this.add.sprite(226, 200, 'preloader');
      this.assetAlpha.alpha = 0.4;

      this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
      this.load.setPreloadSprite(this.asset);
      // audio
      this.load.audio('pokemon', 'assets/audio/pokemon.ogg');
      this.load.audio('zeldaChest', 'assets/audio/zelda-chest.ogg');
      this.load.audio('shootSound', 'assets/audio/shoot.wav');

      // scenario
      this.load.image('background', 'assets/scenario/background.jpg');
      this.load.spritesheet('tiles', 'assets/scenario/tiles.png', 16, 16, 1, 0);
      this.load.tilemap('tilemap', 'assets/scenario/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
      this.load.image('dartboard', 'assets/scenario/dartboard.png');
      this.load.image('chest', 'assets/scenario/chest.png');
      this.load.spritesheet('allSlides', 'assets/scenario/all-slides.png', 800, 600);
      this.load.spritesheet('allSlides2', 'assets/scenario/all-slides2.png', 800, 600);
      this.load.spritesheet('marketing', 'assets/scenario/marketing.png', 480, 400);

      // player
      this.load.spritesheet('marco', 'assets/character/marco-rossi.png', 55, 50);
      this.load.image('bullet', 'assets/character/bullet.png');

      // enemies
      // this.load.spritesheet('abul', 'assets/enemies/abul-abbas.png', 41, 41);
    },

    create: function () {
      this.asset.cropEnabled = false;
    },

    update: function () {
      if (!!this.ready) {
        this.game.state.start('game');
      }
    },

    onLoadComplete: function () {
      this.ready = true;
    }
  };

  window['slides'] = window['slides'] || {};
  window['slides'].Preloader = Preloader;

}());
