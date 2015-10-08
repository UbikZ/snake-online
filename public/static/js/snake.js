$(document).ready(function(){
  //Canvas stuff
  var canvas = $("#canvas")[0];
  var ctx = canvas.getContext("2d");
  var w = $("#canvas").width();
  var h = $("#canvas").height();
  var snake = undefined;
  var game_loop;

  //Lets save the cell width in a variable for easy control
  var cw = 10;
  var d;
  /*var food;
  var score;

  //Lets create the snake now
  var snake_array; //an array of cells to make up the snake*/

  function init()
  {
    snake = new Snake({ width: w, height: h, weight: cw });
    Game.Control.init();
    //Lets move the snake now using a timer which will trigger the paint function
    //every 60ms
    if(typeof game_loop != "undefined") clearInterval(game_loop);
    game_loop = setInterval(paint, 60);
  }
  init();

  /*function create_snake()
  {
    var length = 5; //Length of the snake
    snake_array = []; //Empty array to start with
    for(var i = length-1; i>=0; i--)
    {
      //This will create a horizontal snake starting from the top left
      snake_array.push({x: i, y:0});
    }
  }

  //Lets create the food now
  function create_food()
  {
    food = {
      x: Math.round(Math.random()*(w-cw)/cw),
      y: Math.round(Math.random()*(h-cw)/cw),
    };
    //This will create a cell with x/y between 0-44
    //Because there are 45(450/10) positions accross the rows and columns
  }
*/
  //Lets paint the snake now
  function paint()
  {
    Game.Control.listen(snake);
    //To avoid the snake trail we need to paint the BG on every frame
    //Lets paint the canvas now
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, w, h);


    //Lets write the code to make the snake eat the food
    //The logic is simple
    //If the new head position matches with that of the food,
    //Create a new head instead of moving the tail
    /*if(nx == food.x && ny == food.y)
    {
      var tail = {x: nx, y: ny};
      score++;
      //Create new food
      create_food();
    }
    else
    {
      var tail = snake_array.pop(); //pops out the last cell
      tail.x = nx; tail.y = ny;
    }
    //The snake can now eat the food.

    snake_array.unshift(tail); //puts back the tail as the first cell
*/
    snake.positions.forEach(function(position) {
      paint_cell(position.x, position.y);
    });
  }

  //Lets first create a generic function to paint cells
  function paint_cell(x, y)
  {
    ctx.fillStyle = "blue";
    ctx.fillRect(x*cw, y*cw, cw, cw);
    ctx.strokeStyle = "white";
    ctx.strokeRect(x*cw, y*cw, cw, cw);
  }
/*
  function check_collision(x, y, array)
  {
    //This function will check if the provided x/y coordinates exist
    //in an array of cells or not
    for(var i = 0; i < array.length; i++)
    {
      if(array[i].x == x && array[i].y == y)
        return true;
    }
    return false;
  }

  //Lets add the keyboard controls now
  $(document).keydown(function(e){
    var key = e.which;
    //We will add another clause to prevent reverse gear
    if(key == "37" && d != "right") d = "left";
    else if(key == "38" && d != "down") d = "up";
    else if(key == "39" && d != "left") d = "right";
    else if(key == "40" && d != "up") d = "down";
    //The snake is now keyboard controllable
  })*/
});