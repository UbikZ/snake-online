var App = App || {};

App.Game = (function() {
  'use strict';

  var $element, canvas, ctx, width, height, weight, length, _socket, _snake = {}, snakes = {}, loop;

  $(document).keydown(function(e){
    var key = e.which;
    if (key == "37" && _snake.direction != "right") _snake.direction = "left";
    else if (key == "38" && _snake.direction != "down") _snake.direction = "up";
    else if (key == "39" && _snake.direction != "left") _snake.direction = "right";
    else if (key == "40" && _snake.direction != "up") _snake.direction = "down";
    else if (key == "13") init();
  });

  // Methods

  function init(socket) {
    $element = $('#canvas');
    canvas = $element[0];
    ctx = canvas.getContext("2d");
    width = parseFloat($element.width() < 0 ? $element.attr('width').replace('px', '') : $element.width());
    height = parseFloat($element.height() < 0 ? $element.attr('height').replace('px', '') : $element.height());
    weight = 10;
    length = 5;
    _socket = socket;
    generateSnake();
    socketBinding();
  }

  function socketBinding() {
    _socket.on('send coords', function(data) {
      
    });
  }

  function generateSnake() {
    _snake.direction = getDirection(Math.floor(Math.random() * 4));
    _snake.coords = [];
    var origin = { x: Math.random() * width / weight, y: Math.random() * height / weight };
    for (var i = length - 1 ; i >= 0 ; i--) {
      _snake.coords.push({ x: origin.x + i, y: origin.y });
    }
    console.info(_snake);
  }

  function updateSnake() {
    var newX = _snake.coords[0].x,
      newY = _snake.coords[0].y;

    if (_snake.direction == 'right') newX++;
    else if (_snake.direction == 'left') newX--;
    else if (_snake.direction == 'up') newY--;
    else if (_snake.direction == 'down') newY++;

    var coord = { x: newX, y: newY };
    console.info(coord);
    _snake.coords.unshift(coord);
    _socket.emit('send coords', JSON.stringify(coord));
  }

  function printSnake() {
    _snake.coords.forEach(function(element) {
      printCell(element.x, element.y, "blue");
    });
  }
  
  function printCell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * weight, y * weight, weight, weight);
    ctx.strokeStyle = "white";
    ctx.strokeRect(x * weight, y * weight, weight, weight);
  }

  function mainLoop() {
    paintBackground();
    updateSnake();
    printSnake();
  }

  function paintBackground() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, width, height);
  }

  function start() {
    if (typeof loop == "undefined") {
      console.info("Start loop...");
      loop = setInterval(mainLoop, 60);
    }
  }

  function stop() {
    if (typeof loop != "undefined") {
      console.info("Stop loop...");
      clearInterval(loop);
    }
  }

  function getDirection(value) {
    var direction = undefined;
    switch (value) {
      case 0:
        direction = 'left';
        break;
      case 1:
        direction = 'right';
        break;
      case 2:
        direction = 'up';
        break;
      case 3:
        direction = 'down';
        break;
    }

    return direction;
  }

  return {
    init: init,
    start: start,
    stop: stop
  };
})();