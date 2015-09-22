var Snake = Snake || {};

$(document).ready(function(){
  //Canvas stuff
  var canvas = $("#canvas")[0];
  var ctx = canvas.getContext("2d");
  var w = $("#canvas").width();
  var h = $("#canvas").height();

  //Lets save the cell width in a variable for easy control
  var cw = 10;
  var d;

  //Lets create the snake now
  var snake_array; //an array of cells to make up the snake

  function init()
  {
    d = "right"; //default direction
    create_snake();

    if(typeof game_loop != "undefined") clearInterval(game_loop);
    game_loop = setInterval(paint, 60);
  }
  //init();

  function create_snake()
  {
    var length = 5; //Length of the snake
    snake_array = []; //Empty array to start with
    for(var i = length-1; i>=0; i--)
    {
      //This will create a horizontal snake starting from the top left
      snake_array.push({x: i, y:0});
    }
  }

  //Lets paint the snake now
  function paint()
  {
    //To avoid the snake trail we need to paint the BG on every frame
    //Lets paint the canvas now
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, w, h);

    //The movement code for the snake to come here.
    //The logic is simple
    //Pop out the tail cell and place it infront of the head cell
    var nx = snake_array[0].x;
    var ny = snake_array[0].y;
    //These were the position of the head cell.
    //We will increment it to get the new head position
    //Lets add proper direction based movement now
    if(d == "right") nx++;
    else if(d == "left") nx--;
    else if(d == "up") ny--;
    else if(d == "down") ny++;


    if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array))
    {
      //restart game
      //init();
      //Lets organize the code a bit now.
      return;
    }

    snake_array.unshift({x: nx, y: ny}); //puts back the tail as the first cell
    snake_array.forEach(function(element) { paint_cell(element.x, element.y); });
  }

  //Lets first create a generic function to paint cells
  function paint_cell(x, y)
  {
    ctx.fillStyle = "blue";
    ctx.fillRect(x*cw, y*cw, cw, cw);
    ctx.strokeStyle = "white";
    ctx.strokeRect(x*cw, y*cw, cw, cw);
  }

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

  $(document).keydown(function(e){
    var key = e.which;
    if(key == "37" && d != "right") d = "left";
    else if(key == "38" && d != "down") d = "up";
    else if(key == "39" && d != "left") d = "right";
    else if(key == "40" && d != "up") d = "down";
    else if(key == "13") init();
  })
});