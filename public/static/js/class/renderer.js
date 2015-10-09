var Renderer = function(canvasDOM) {
  'use strict';

  var $canvas = canvasDOM,
    canvas = $canvas[0],
    ctx = canvas.getContext('2d'),
    width = $canvas.width(),
    height = $canvas.height(),
    weight = 10;  // todo: config on server

  /**
   *
   * @returns {{width: *, height: *, weight: number}}
   */
  function properties() {
    return { width: width, height: height, weight: weight };
  }

  /**
   *
   */
  function drawBackground() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, width, height);
  }

  /**
   *
   * @param positions
   * @param options
   */
  function drawPoints(positions, options) {
    options = $.extend({}, { fillStyle: 'blue', strokeStyle: 'white' }, options);
    positions.forEach(function(position) {
      drawPoint(position.x, position.y, options);
    });
  }

  /**
   *
   * @param posX
   * @param posY
   * @param options
   */
  function drawPoint(posX, posY, options) {
    options = $.extend({}, { fillStyle: 'blue', strokeStyle: 'white' }, options);
    ctx.fillStyle = options.fillStyle;
    ctx.fillRect(posX * weight, posY * weight, weight, weight);
    ctx.strokeStyle = options.strokeStyle;
    ctx.strokeRect(posX * weight, posY * weight, weight, weight);
  }


  // Public
  return {
    properties: properties,
    drawBackground: drawBackground,
    drawPoints: drawPoints,
    drawPoint: drawPoint,
  };
};