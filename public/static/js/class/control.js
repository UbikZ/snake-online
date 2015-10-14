var Control = function(instanceSnake, instanceSocket) {
  'use strict';

  var snake = instanceSnake, socket = instanceSocket;

  function enable() {
    $(document).keydown(function(e){
      var key = e.which, direction, snakeDirection = snake.getDirection();
      if (key == '37' && snakeDirection != snake.RIGHT) {
        direction = snake.LEFT;
      } else if (key == '38' && snakeDirection != snake.DOWN) {
        direction = snake.UP;
      } else if (key == '39' && snakeDirection != snake.LEFT) {
        direction = snake.RIGHT;
      } else if (key == '40' && snakeDirection != snake.UP) {
        direction = snake.DOWN;
      }
      if (direction) {
        snake.setDirection(direction);
        socket.sendDirection(direction);
      }
    });
  }

  function disable() {
    $(document).unbind('keydown');
  }

  function listen() {
    if (snake.getDirection()) {
      snake.move();
    }
  }

  // Public
  return {
    enable: enable,
    disable: disable,
    listen: listen,
  };
};