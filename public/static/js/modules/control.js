var Game = Game || {};

Game.Control = (function () {
  'use strict';

  const LEFT = 'left';
  const RIGHT = 'right';
  const UP = 'up';
  const DOWN = 'down';

  var snake, socket, direction;

  /**
   *
   */
  function enable(instanceSocket) {
    socket = instanceSocket;
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
      socket.sendDirection(direction);
    });
  }

  /**
   *
   */
  function disable() {
    $(document).unbind('keydown');
  }

  /**
   *
   * @param instanceSnake
   */
  function listen(instanceSnake) {
    snake = instanceSnake;
    if (direction == LEFT && direction != RIGHT) {
      snake.left();
      socket.sendDirection(LEFT);
    } else if (direction == UP && direction != DOWN) {
      snake.up();
      socket.sendDirection(UP);
    } else if (direction == RIGHT && direction != LEFT) {
      snake.right();
      socket.sendDirection(RIGHT);
    } else if (direction == DOWN && direction != UP) {
      snake.down();
      socket.sendDirection(DOWN);
    }
  }

  // Public
  return {
    enable: enable,
    disable: disable,
    listen: listen,
    LEFT: LEFT,
    RIGHT: RIGHT,
    UP: UP,
    DOWN: DOWN,
  };
})();