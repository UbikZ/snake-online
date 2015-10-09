var Snake = function(options) {
  'use strict';

  var positions = [];
  var settings = $.extend({}, {
      width:  800,
      height: 800,
      weight: 10,
      fillStyle: 'blue',
      strokeStyle: 'white',
      length: 5,
    }, options);

  construct();

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

  function right() {
    addNewCell(formatPositions(++positions[0].x, positions[0].y ))
  }

  function left() {
    addNewCell(formatPositions(--positions[0].x, positions[0].y ))
  }

  function up() {
    addNewCell(formatPositions(positions[0].x, --positions[0].y ))
  }

  function down() {
    addNewCell(formatPositions(positions[0].x, ++positions[0].y ))
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

  // Public
  return {
    positions: positions,
    settings: settings,
    right: right,
    left: left,
    up: up,
    down: down,
    addCell: addNewCell,
  };
};