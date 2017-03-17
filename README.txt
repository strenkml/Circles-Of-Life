Michael Farden (0524703)
Matthew Strenk (0437546)
CS452
Project 1
3/16/17

This project involved the creation of a 2D game in WebGL with the following attributes:

1) The game has more than 5 2D polygons in the duration of the game, each of a different color.
2) The game consists of a white circle that serves as the player's character. There are 4 square enemies of various colors with
	collision detection. If the player circle collides with an enemy, the game is over. When the game begins, a small red circle 
	(food) is spawned in a random location chosen from values in an array. When the player circle collides with the food, the 
	food dissapears, 10 is added to the score, and another piece of food is spawned in a random location. 
3) When the score reaches 100, the player wins the game.
4) To start a new game, the player can refresh the webpage using "F5" or "Ctrl + R".
4) The player interacts with the circle using keys w, a, s, and d to move in the positive y direction, negative x direction, 
	negative y direction, and positive x direction respectively. 

Common files:
webgl-utils.js: standard utilities from google to set up a webgl context
MV.js: our matrix/vector package. Documentation on website
initShaders.js: functions to initialize shaders in the html file