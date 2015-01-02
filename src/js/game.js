(function() {
    'use strict';

    function Game() {}

    Game.prototype = {

        create: function() {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity.y = 485;

            this.bg = this.game.add.tileSprite(0, 0, 800, 600, 'background');
            this.bg.fixedToCamera = true;

            // slides
            this.allSlides = this.game.add.group();
            this.allSlides.create(0, 0, 'allSlides', 0);
            this.allSlides.create(1500, 160, 'allSlides', 1).scale.setTo(0.7, 0.7);
            this.allSlides.create(2500, 60, 'allSlides', 2); // pokemon
            this.allSlides.create(3300, 60, 'allSlides', 3);
            this.allSlides.create(3150, 700, 'allSlides', 4).scale.setTo(0.9, 0.9);
            this.allSlides.create(2400, 550, 'allSlides', 5).scale.setTo(0.9, 0.9);
            this.allSlides.create(1400, 650, 'allSlides', 6).scale.setTo(0.75, 0.75); // sprite editors
            this.securityActive = true;
            this.allSlides.create(1600, 1400, 'allSlides', 10).scale.setTo(0.75, 0.75); // Construc2
            this.allSlides.getAt(7).alpha = 0;
            this.allSlides.create(2400, 1400, 'allSlides2', 0).scale.setTo(0.75, 0.75);
            this.allSlides.getAt(8).alpha = 0;
            this.allSlides.create(3400, 1350, 'allSlides2', 1).scale.setTo(0.75, 0.75);
            this.allSlides.create(4900, 1400, 'allSlides2', 6).scale.setTo(0.75, 0.75);
            this.allSlides.getAt(10).alpha = 0;
            this.allSlides.create(6500, 1400, 'allSlides2', 7).scale.setTo(0.75, 0.75);
            this.allSlides.create(7400, 1400, 'allSlides2', 8).scale.setTo(0.75, 0.75);

            // map
            this.map = this.game.add.tilemap('tilemap');
            this.map.addTilesetImage('tiles');
            this.map.setCollisionBetween(0, this.map.tiles.length);
            this.layer = this.map.createLayer('Tiles');
            this.layer.resizeWorld();
            // this.layer.debug = true;


            // player
            function setupPlayer(player) {
                player.animations.add('standby', [0, 1, 2, 1], 6, true);
                player.animations.add('move', [3, 4, 5, 6, 7, 8, 9, 10, 11], 18, true);
                player.animations.add('fire', [12, 13, 14, 15], 12, true);
                player.body.collideWorldBounds = true;
                player.body.setSize(18, 35, -6, 6);
                player.anchor.setTo(0.3, 0.5);
                player.fireTimer = 0;
                player.health = 1;
            }

            this.player = this.game.add.sprite(400, 200, 'marco');
            this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
            setupPlayer(this.player);
            this.game.camera.follow(this.player);

            // keyboard controls
            function createControls(gameContext) {
                gameContext.controls = {
                    'left': gameContext.game.input.keyboard.addKey(65), //A
                    'right': gameContext.game.input.keyboard.addKey(68), //D
                    'fire': gameContext.game.input.keyboard.addKey(75), // K
                    'jump': gameContext.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
                };
            }
            createControls(this);

            // xbox controls
            this.game.input.gamepad.start();
            this.pad = this.game.input.gamepad.pad1;

            // enemies
            // abul-abbas
            function setupAbul(enemy) {
                this.game.physics.enable(enemy, Phaser.Physics.ARCADE);
                enemy.animations.add('default', [0, 1, 2, 3, 4, 5], 10, true);
                enemy.body.collideWorldBounds = true;
                enemy.body.setSize(20, 38);
                enemy.anchor.setTo(0.5, 0.5);
                enemy.health = 3;
                enemy.animations.play('default');
            }
            this.abuls = this.game.add.group();
            // this.abuls.create(460, 390, 'abul');
            this.abuls.forEach(setupAbul, this);

            // dartboards
            function setupDartboard(enemy) {
                this.game.physics.enable(enemy, Phaser.Physics.ARCADE);
                enemy.body.collideWorldBounds = true;
                enemy.body.setSize(100, 300);
                enemy.scale.setTo(0.08, 0.08);
                enemy.anchor.setTo(0.5, 0.5);
                enemy.body.allowGravity = false;
                enemy.health = 9999;
            }
            this.dartboards = this.game.add.group();
            this.dartboards.create(1450, 950, 'dartboard');
            this.dartboards.create(3970, 1780, 'dartboard');
            this.dartboards.create(7350, 1865, 'dartboard');
            this.dartboards.forEach(setupDartboard, this);

            // chests
            function setupChest(element) {
                this.game.physics.enable(element, Phaser.Physics.ARCADE);
                element.body.collideWorldBounds = true;
                element.body.setSize(280, 270);
                element.scale.setTo(0.2, 0.2);
                element.anchor.setTo(0.5, 0.5);
            }
            this.chests = this.game.add.group();
            this.chests.create(1900, 1700, 'chest');
            // this.chests.create(5100, 1700, 'chest');
            this.chests.forEach(setupChest, this);
            // bullets
            function setupBullet(bullet) {
                this.game.physics.enable(bullet, Phaser.Physics.ARCADE);
                bullet.body.collideWorldBounds = false;
                bullet.body.setSize(13, 13);
                bullet.anchor.setTo(0.5, 0.5);
                bullet.lifespan = 15000;
                bullet.outOfBoundsKill = true;
                bullet.checkWorldBounds = true;
                bullet.body.allowGravity = false;
            }
            this.bullets = this.game.add.group();
            this.bullets.createMultiple(20, 'bullet');
            this.bullets.forEach(setupBullet, this);

            // audio
            this.game.sound.stopAll();
            this.pokemonMusic = this.game.add.audio('pokemon', 0.5, false);
            this.zeldaSound = this.game.add.audio('zeldaChest', 1, false, 2);
            this.shootSound = this.game.add.audio('shootSound');

            // teleport keys [0-9]
            this.game.input.keyboard.addKey(48).onDown.add(function () {this.player.x = 400;this.player.y = 200;}, this); // 0
            this.game.input.keyboard.addKey(49).onDown.add(function () {this.player.x = 1270;this.player.y = 275;}, this); // 1
            this.game.input.keyboard.addKey(50).onDown.add(function () {this.player.x = 2880;this.player.y = 375;}, this);
            this.game.input.keyboard.addKey(51).onDown.add(function () {this.player.x = 3500;this.player.y = 1000;}, this);
            this.game.input.keyboard.addKey(52).onDown.add(function () {this.player.x = 1830;this.player.y = 950;}, this);
            this.game.input.keyboard.addKey(53).onDown.add(function () {this.player.x = 1780;this.player.y = 1880;}, this);
            this.game.input.keyboard.addKey(54).onDown.add(function () {this.player.x = 3620;this.player.y = 1830;}, this);
            this.game.input.keyboard.addKey(55).onDown.add(function () {this.player.x = 4830;this.player.y = 1780;}, this);
            this.game.input.keyboard.addKey(56).onDown.add(function () {this.player.x = 6790;this.player.y = 1880;}, this);
            this.game.input.keyboard.addKey(57).onDown.add(function () {this.player.x = 7530;this.player.y = 1780;}, this);

        },

        update: function() {
            this.input.onDown.add(this.changeScreenSize, this);

            this.game.physics.arcade.collide(this.player, this.layer);
            this.game.physics.arcade.collide(this.abuls, this.layer);
            this.game.physics.arcade.collide(this.chests, this.layer);
            this.abuls.forEach(function(abul) {
                if (this.game.physics.arcade.distanceBetween(abul, this.player) < 250) {
                    this.game.physics.arcade.accelerateToObject(abul, this.player, 120, 120, 0);
                    // accelerateToObject(objeto, destino, vel, xVelMax, yVelMax)
                } else {
                    abul.body.velocity.x = 0;
                }
            }, this);
            this.game.physics.arcade.collide(this.abuls, this.player, this.playerIsDamaged, null, this);
            this.game.physics.arcade.collide(this.abuls, this.bullets, this.enemyIsDamaged, null, this);
            this.game.physics.arcade.collide(this.layer, this.bullets, this.destroyBullet, null, this);
            // collide(object1, object2, collideCallback, processCallback, callbackContext)
            this.game.physics.arcade.overlap(this.dartboards, this.bullets, this.dartboardIsDamaged, null, this);
            this.game.physics.arcade.overlap(this.chests, this.player, this.openChest, null, this);

            if (this.player.x > 1300 && this.player.x < 2240 && this.player.y < 300 && !this.pokemonMusic.isPlaying) {
                this.pokemonMusic.play();
            } else if ((this.player.x < 1300 || this.player.x > 2240 || this.player.y > 300) && this.pokemonMusic.isPlaying) {
                this.pokemonMusic.stop();
            }

            this.playerActions();

        },
        gamepadButtonIsDown: function(button, value) {
            if (button.buttonCode === Phaser.Gamepad.XBOX360_A) {
                this.player.body.velocity.x = -150;
            } else if (button.buttonCode === Phaser.Gamepad.XBOX360_B) {
                this.player.body.velocity.x = -150;
            } else if (button.buttonCode === Phaser.Gamepad.XBOX360_X) {
                this.player.body.velocity.x = -150;
            } else if (button.buttonCode === Phaser.Gamepad.XBOX360_Y) {
                this.player.body.velocity.x = -150;
            }

        },
        playerActions: function() {
            this.player.body.velocity.x = 0;
            if (this.controls.left.isDown || this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT)) {
                this.player.body.velocity.x = -150;
                this.player.animations.play('move');
                if (this.player.scale.x > 0) {
                    this.player.scale.x = -1;
                    this.player.body.setSize(18, 35, 0, 6);
                }
            } else if (this.controls.right.isDown || this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT)) {
                this.player.body.velocity.x = 150;
                this.player.animations.play('move');
                if (this.player.scale.x < 0) {
                    this.player.scale.x = 1;
                    this.player.body.setSize(18, 35, -6, 6);
                }
            } else if ((this.controls.fire.isDown || this.pad.isDown(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER)) && this.player.alive) {
                this.player.animations.play('fire');
                this.fireBullet(this);
            } else {
                this.player.animations.play('standby');
            }

            if ((this.controls.jump.isDown || this.pad.isDown(Phaser.Gamepad.XBOX360_A)) && this.player.body.onFloor()) {
                this.player.body.velocity.y = -250;
            }
        },
        playerIsDamaged: function(player) {
            player.damage(1);
        },
        enemyIsDamaged: function(enemy, bullet) {
            enemy.damage(1);
            bullet.kill();
        },
        dartboardIsDamaged: function(dartboard, bullet) {
            var dartboardIndex = this.dartboards.getIndex(dartboard);

            if (dartboardIndex === 0) {
                if (this.allSlides.getAt(6).frame === 6 && !this.securityActive) {
                    this.allSlides.getAt(6).frame = 7;
                    this.securityActive = true;
                } else if (this.allSlides.getAt(6).frame === 7 && !this.securityActive) {
                    this.allSlides.getAt(6).frame = 8;
                    this.securityActive = true;
                } else if (this.allSlides.getAt(6).frame === 8 && !this.securityActive) {
                    this.allSlides.getAt(6).frame = 9;
                    this.securityActive = true;
                } else if (this.allSlides.getAt(6).frame === 9 && !this.securityActive) {
                    this.allSlides.getAt(6).frame = 6;
                    this.securityActive = true;
                } else {
                    this.securityActive = !this.securityActive;
                }
            } else if (dartboardIndex === 1) {
                if (this.allSlides.getAt(9).frame === 1 && !this.securityActive) {
                    this.allSlides.getAt(9).frame = 2;
                    this.securityActive = true;
                } else if (this.allSlides.getAt(9).frame === 2 && !this.securityActive) {
                    this.allSlides.getAt(9).frame = 3;
                    this.securityActive = true;
                } else if (this.allSlides.getAt(9).frame === 3 && !this.securityActive) {
                    this.allSlides.getAt(9).frame = 4;
                    this.securityActive = true;
                } else if (this.allSlides.getAt(9).frame === 4 && !this.securityActive) {
                    this.allSlides.getAt(9).frame = 5;
                    this.securityActive = true;
                } else if (this.allSlides.getAt(9).frame === 5 && !this.securityActive) {
                    this.allSlides.getAt(9).frame = 1;
                    this.securityActive = true;
                } else {
                    this.securityActive = !this.securityActive;
                }
            } else if (dartboardIndex === 2) {
                if (this.allSlides.getAt(12).frame === 8 && !this.securityActive) {
                    this.allSlides.getAt(12).frame = 9;
                    this.securityActive = true;
                } else if (this.allSlides.getAt(12).frame === 9 && !this.securityActive) {
                    this.allSlides.getAt(12).frame = 10;
                    this.securityActive = true;
                } else if (this.allSlides.getAt(12).frame === 10 && !this.securityActive) {
                    this.allSlides.getAt(12).frame = 8;
                    this.securityActive = true;
                } else {
                    this.securityActive = !this.securityActive;
                }
            }

            bullet.kill();
        },
        openChest: function(player, chest) {
            var chestIndex = this.chests.getIndex(chest),
                chestTweened;

            this.securityActive = true;

            chest.kill();

            chestTweened = this.game.add.sprite(chest.x, chest.y, 'chest');
            chestTweened.anchor.setTo(0.5, 0.5);
            chestTweened.scale.setTo(0.2, 0.2);
            chestTweened.lifespan = 6000;
            chestTweened.alpha = 0.9;

            this.game.add.tween(chestTweened)
                .to({
                    y: chestTweened.y - 300,
                    alpha: 0
                }, 7000, Phaser.Easing.Cubic.In)
                .start();
            this.game.add.tween(chestTweened)
                .to({
                    x: chestTweened.x - 15
                }, 900, Phaser.Easing.Back.In)
                .to({
                    x: chestTweened.x + 15
                }, 900, Phaser.Easing.Back.In)
                .start()
                .loop();

            if (chestIndex === 0) {
                this.game.add.tween(this.allSlides.getAt(7)) // construct2
                    .to({
                        alpha: 1
                    }, 2000, Phaser.Easing.Cubic.Out, true, 6000)
                    .start();
                this.game.add.tween(this.allSlides.getAt(8))
                    .to({
                        alpha: 1
                    }, 2000, Phaser.Easing.Cubic.Out, true, 6000)
                    .start();
            }

            if (chestIndex === 1) {
                this.game.add.tween(this.allSlides.getAt(10))
                    .to({
                        alpha: 1
                    }, 2000, Phaser.Easing.Cubic.Out, true, 6000)
                    .start();
            }

            this.zeldaSound.play();
        },
        destroyBullet: function(bullet) {
            bullet.kill();
        },
        fireBullet: function(context) {
            if (context.game.time.now > context.player.fireTimer) {
                var bullet = context.bullets.getFirstExists(false);
                if (bullet) {
                    context.shootSound.play('', 0, 0.4, false);
                    bullet.reset(context.player.x, context.player.y - 6);
                    bullet.body.velocity.x = 400 * context.player.scale.x;
                    context.player.fireTimer = context.game.time.now + 200;
                }
            }
        },
        changeScreenSize: function() {
            console.log(this.game.scale.width);
            if (this.game.scale.width === 800) {
                this.game.scale.setShowAll();
                // this.game.scale.startFullScreen(true); // full screen but not responsive
            } else {
                this.game.scale.setupScale(800, 600);
                this.game.scale.stopFullScreen();
            }
            this.game.scale.refresh();
        },
        render: function() {
            // this.game.debug.spriteInfo(this.player, 150, 30);
            // this.game.debug.body(this.dartboards.getAt(1));
            // this.game.debug.body(this.player);
            // this.game.debug.body(this.abuls.getAt(0));
        }
    };

    window['slides'] = window['slides'] || {};
    window['slides'].Game = Game;
}());