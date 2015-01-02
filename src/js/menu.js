(function() {
  'use strict';

  function Menu() {
    this.titleTxt = null;
    this.startTxt = null;
  }

  Menu.prototype = {

    create: function () {},

    update: function () {

    },

    onDown: function () {
      this.game.state.start('game');
    }
  };

  window['slides'] = window['slides'] || {};
  window['slides'].Menu = Menu;

}());
