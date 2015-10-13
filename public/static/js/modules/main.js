var Game = Game || {};

Game.Main = (function () {
  'use strict';

  // Game design
  var canvas, renderer;
  // Game positions
  var currentSnake, snakes = {}, foods;
  // Game
  var loop, posLoop, socket;

  /**
   *
   * @param $canvas
   */
  function init($canvas, ws) {
    canvas = $canvas[0];

    renderer = new Renderer($canvas);
    currentSnake = new Snake(renderer.properties());
    socket = new Socket(ws, currentSnake);
    socket.connect();
  }

  /**
   *
   */
  function start() {
    if (typeof loop == "undefined") {
      Game.Control.enable();
      loop = setInterval(mainLoop, 60);
      posLoop = setInterval(positionLoop, 30);
    }
  }

  /**
   *
   */
  function mainLoop() {
    Game.Control.listen(currentSnake);
    renderer.drawBackground();
    socket.send(currentSnake.positions);
    renderer.drawPoints(currentSnake.positions);
    if (snakes) {
      snakes.forEach(function(snake) {
        renderer.drawPoints(snake);
      });
    }
  }

  /**
   *
   */
  function positionLoop() {
    socket.listen();
    // todo: dirty, dont pass with pseudo 'globals'
    snakes = Game.positions;
  }

  /**
   *
   */
  function stop() {
    if (typeof loop != "undefined") {
      Game.Control.disable();
      clearInterval(loop);
      clearInterval(posLoop);
      loop = posLoop = undefined;
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