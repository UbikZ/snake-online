var Snake = function(user, options) {
  'use strict';

  const LEFT = 'left';
  const RIGHT = 'right';
  const UP = 'up';
  const DOWN = 'down';

  var positions = [],
    direction = formatDirection(Math.floor(Math.random() * 4));
  var username = user;
  var settings = $.extend({}, {
      width:  800,
      height: 800,
      weight: 10,
      fillStyle: 'blue',
      strokeStyle: 'white',
      length: 5,
    }, options);

  if (settings.positions == undefined) {
    construct();
  } else {
    positions = settings.positions;
  }

  /**
   *
   */
  function construct() {
    for (var i = settings.length-1; i >= 0; i--) {
      positions.push(formatPositions(i, 0));
    }
  }

  /*
   * Movements
   */
  function setDirection(dir) {
    direction = dir;
  }

  function getDirection() {
    return direction;
  }

  function setUsername(user) {
    username = user;
  }

  function getUsername() {
    return username;
  }

  function move() {
    var x = positions[0].x, y = positions[0].y;
    switch (direction) {
      case RIGHT:
        x = ++positions[0].x;
        break;
      case LEFT:
        x = --positions[0].x;
        break;
      case DOWN:
        y = ++positions[0].y;
        break;
      case UP:
        y = --positions[0].y;
        break;
    }
    addNewCell(formatPositions(x, y));
  }

  /**
   *
   * @param position
   * @returns {*}
   */
  function guessPosition(position) {
    if (position.x == settings.width/settings.weight) {
      position.x = 0;
    } else if (position.x == -1) {
      position.x = settings.width/settings.weight;
    }

    if (position.y == settings.height/settings.weight) {
      position.y = 0;
    } else if (position.y == -1) {
      position.y = settings.height/settings.weight;
    }

    return position;
  }

  /**
   *
   * @param position
   * @returns {boolean}
   */
  function checkCollision(position) {
    positions.forEach(function(item) {
      if (item.x == position.x && item.y == position.y) {
        return true;
      }
    });

    return false;
  }

  /**
   *
   * @param position
   */
  function addNewCell(position) {
    position = guessPosition(position);
    if (!checkCollision(position)) {
      var tail = positions.pop();
      tail.x = position.x;
      tail.y = position.y;
      positions.unshift(tail);
    }
  }

  /**
   * @param posX
   * @param posY
   * @returns {{x: *, y: *}}
   */
  function formatPositions(posX, posY) {
    return { x: posX, y: posY };
  }

  /**
   *
   * @param value
   */
  function formatDirection(value) {
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

    return direction;
  }

  // Public
  return {
    positions: positions,
    settings: settings,
    setUsername: setUsername,
    getUsername: getUsername,
    setDirection: setDirection,
    getDirection: getDirection,
    move: move,
    addCell: addNewCell,
    LEFT: LEFT,
    RIGHT: RIGHT,
    UP: UP,
    DOWN: DOWN,
  };
};