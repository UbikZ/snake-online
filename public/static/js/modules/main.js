var Game = Game || {};

Game.Main = (function () {
  'use strict';

  // Game design
  var canvas, renderer;
  // Game positions
  var currentSnake, snakes = {}, foods;
  // Game
  var loop, posLoop, socket, control;

  /**
   * @param $canvas
   * @param ws
   */
  function init($canvas, ws) {
    canvas = $canvas[0];

    renderer = new Renderer($canvas);
    currentSnake = new Snake(undefined, renderer.properties());
    socket = new Socket(ws);
    socket.connect(currentSnake.positions);
    socket.sendDirection(currentSnake.getDirection());
    generateOriginSnakes();
  }

  function generateOriginSnakes() {
    waitValidConnection(function() {
      currentSnake.setUsername(Game.username);
      generateSnakes(Game.originSnakes);
    });
  }

  function generateMissingSnakes()
  {
    waitValidConnection(function() {
      generateSnakes(Game.missingSnakes);
    });
  }

  function generateSnakes(positions) {
    for (var user in positions) {
      if (positions.hasOwnProperty(user)) {
        if (snakes[user] == undefined) {
          var snake = positions[user],
            options = $.extend({}, renderer.properties(), {positions: snake.positions}),
            instSnake = new Snake(user, options);
          instSnake.setDirection(snake.direction);
          snakes[user] = instSnake;
        }
      }
    }
  }

  function waitValidConnection(callback) {
    setTimeout(function() {
      if (Game.username) {
        if (callback != null) {
          callback();
        }
      } else {
        waitValidConnection(callback);
      }
    }, 5);
  }

  /**
   *
   */
  function start() {
    if (typeof loop == "undefined") {
      control = new Control(currentSnake, socket);
      control.enable();
      loop = setInterval(mainLoop, 60);
    }
  }

  /**
   *
   */
  function mainLoop() {
    control.listen();
    renderer.drawBackground();
    socket.sendPositions(currentSnake.positions);
    renderer.drawPoints(currentSnake.positions);
    generateMissingSnakes(Game.missingSnakes);
    if (snakes) {
      Game.snakes = snakes;
      for (var user in snakes) {
        if (snakes.hasOwnProperty(user)) {
          var snake = snakes[user];
          if (Game.directions) {
            snake.setDirection(Game.directions[user]);
          }
          snake.move();
          renderer.drawPoints(snake.positions);
        }
      }
    }
  }

  /**
   *
   */
  function stop() {
    if (typeof loop != "undefined") {
      control.disable();
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