var Game = Game || {};

Game.Main = (function () {
  'use strict';

  // Game design
  var canvas, renderer;
  // Game positions
  var currentSnake, snakes, foods;
  // Game
  var loop;

  /**
   *
   * @param $canvas
   */
  function init($canvas) {
    canvas = $canvas[0];

    renderer = new Renderer($canvas);
    currentSnake = new Snake(renderer.properties());
    Game.Socket.connect();
    Game.Socket.init(currentSnake, renderer);
  }

  /**
   *
   */
  function start() {
    if (typeof loop == "undefined") {
      Game.Control.enable();
      loop = setInterval(mainLoop, 60);
    }
  }

  /**
   *
   */
  function mainLoop() {
    Game.Control.listen(currentSnake);
    renderer.drawBackground();
    Game.Socket.send(currentSnake.positions);
    Game.Socket.listen();
    renderer.drawPoints(currentSnake.positions);
  }

  /**
   *
   */
  function stop() {
    if (typeof loop != "undefined") {
      Game.Control.disable();
      clearInterval(loop);
      loop = undefined;
    }
  }

  /**
   *
   */
  function reset() {
    // todo
  }

  // Public
  return {
    init: init,
    start: start,
    stop: stop,
    reset: reset,
  };
})();