(function() {
    'use strict';

    function Boot() {}

    Boot.prototype = {

        preload: function() {
            this.load.image('preloader', 'assets/preloader.jpg');
        },

        create: function() {
            this.game.input.maxPointers = 1;
            this.game.backgroundColor = '#000';
            this.game.scale.minWidth = 800;
            this.game.scale.minHeight = 600;
            this.game.state.start('preloader');
        }
    };

    window['slides'] = window['slides'] || {};
    window['slides'].Boot = Boot;

}());