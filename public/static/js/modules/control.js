var Game = Game || {};

Game.Control = (function () {
  'use strict';

  const LEFT = 'left';
  const RIGHT = 'right';
  const UP = 'up';
  const DOWN = 'down';

  var snake, direction;

  /**
   *
   */
  function enable()
  {
    direction = getDirection(Math.floor(Math.random() * 4));
    $(document).keydown(function(e){
      var key = e.which;
      if (key == '37' && direction != RIGHT) {
        direction = LEFT;
      } else if (key == '38' && direction != DOWN) {
        direction = UP;
      } else if (key == '39' && direction != LEFT) {
        direction = RIGHT;
      } else if (key == '40' && direction != UP) {
        direction = DOWN;
      }
    });
  }

  /**
   *
   */
  function disable()
  {
    $(document).unbind('keydown');
  }

  /**
   *
   * @param instanceSnake
   */
  function listen(instanceSnake)
  {
    snake = instanceSnake;
    if (direction == LEFT && direction != RIGHT) {
      snake.left();
    } else if (direction == UP && direction != DOWN) {
      snake.up();
    } else if (direction == RIGHT && direction != LEFT) {
      snake.right();
    } else if (direction == DOWN && direction != UP) {
      snake.down();
    }
  }

  /**
   *
   * @param value
   */
  function getDirection(value) {
    var direction = undefined;
    switch (value) {
      case 0:
        direction = LEFT;
        break;
      case 1:
        direction = RIGHT;
        break;
      case 2:
        direction = UP;
        break;
      case 3:
        direction = DOWN;
        break;
    }
  }

  // Public
  return {
    enable: enable,
    disable: disable,
    listen: listen,
    currentDirection: direction,
  };
})();