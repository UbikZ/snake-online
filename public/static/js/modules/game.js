var Game = Game || {};

Game.Main = (function () {
  'use strict';

  // Game design
  var canvas, ctx, width, height, weight;
  // Game positions
  var currentSnake, snakes, foods;
  // Game
  var loop;

  /**
   *
   * @param $canvas
   */
  function init($canvas)
  {
    canvas = $canvas[0];
    ctx = canvas.getContext('2d');
    width = $canvas.width();
    height = $canvas.height();
    weight = 10; // todo: config on server
    currentSnake = new Snake({ width: width, height: height, weight: weight });
  }

  /**
   *
   */
  function start()
  {
    if (typeof loop == "undefined") {
      Game.Control.enable();
      loop = setInterval(mainLoop, 60);
    }
  }

  /**
   *
   */
  function mainLoop()
  {
    Game.Control.listen(currentSnake);
    // todo : export in game.render module
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, width, height);
    currentSnake.positions.forEach(function(position) {
      paint_cell(position.x, position.y);
      function paint_cell(x, y)
      {
        ctx.fillStyle = "blue";
        ctx.fillRect(x*weight, y*weight, weight, weight);
        ctx.strokeStyle = "white";
        ctx.strokeRect(x*weight, y*weight, weight, weight);
      }
    });
  }

  /**
   *
   */
  function stop()
  {
    if (typeof loop != "undefined") {
      Game.Control.disable();
      clearInterval(loop);
      loop = undefined;
    }
  }

  /**
   *
   */
  function reset()
  {
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