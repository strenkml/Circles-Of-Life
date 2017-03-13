var theta, canvas, gl;
var myShaderProgramCircle, myShaderProgramFood, myShaderProgramEnemy, myShaderProgramEnemy2;
var bufferIdCircle, bufferIdFood, bufferIdEnemy, bufferIdEnemy2;
var arrayOfPointsForCircle, arrayOfPointsForFood, arrayOfPointsForEnemy, arrayOfPointsForEnemy2;
var score = 0;
var foodLeft = 5;
var randX,randY;
var foodRadius = 30;
var circleRadius = 10;

//Animation global variables
var coordinatesUniform;
var stepX, stepY;
var directionX, directionY;
var stepScale;
var thetaUniform;

function init() {
	canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL is unavailable"); }
	gl.viewport(0, 0, 720, 720);
	gl.clearColor(0, 0, 0, 1);

	myShaderProgramCircle = initShaders(gl,"vertex-shader", "fragment-shader-circle");
	drawCircle();

	myShaderProgramFood = initShaders(gl,"vertex-shader2", "fragment-shader-food");
	drawFood();

	myShaderProgramEnemy = initShaders(gl,"vertex-shader3", "fragment-shader-enemy");
	drawEnemy();

	myShaderProgramEnemy2 = initShaders(gl,"vertex-shader3", "fragment-shader-enemy2");
	drawEnemy2();

	theta = .0;
	stepX = .0;
	stepY = .0;
	directionX = .0; directionY = .0;
	stepScale = .01;

	coordinatesUniform = gl.getUniformLocation(myShaderProgramCircle, "mouseCoordinates");
	gl.uniform2f(coordinatesUniform, .0, .0);

	document.getElementById('score').innerHTML = score;

	render();
}

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Enemy shader program
	gl.useProgram(myShaderProgramEnemy);
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdEnemy);
	var myPositionEnemy = gl.getAttribLocation(myShaderProgramEnemy, "enemyPosition");
	gl.vertexAttribPointer(myPositionEnemy, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(myPositionEnemy);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 5);

	// Enemy2 shader program
	gl.useProgram(myShaderProgramEnemy2);
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdEnemy2);
	var myPositionEnemy2 = gl.getAttribLocation(myShaderProgramEnemy2, "enemyPosition");
	gl.vertexAttribPointer(myPositionEnemy2, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(myPositionEnemy2);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);

	// Food shader program
	gl.useProgram(myShaderProgramFood);
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdFood);
	var myPositionFood = gl.getAttribLocation(myShaderProgramFood, "foodPosition");
	gl.vertexAttribPointer(myPositionFood, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(myPositionFood);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 100);

	// Circle shader program
	gl.useProgram(myShaderProgramCircle);
	thetaUniform = gl.getUniformLocation(myShaderProgramCircle, "theta");
	gl.uniform1f(thetaUniform, theta);
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdCircle);
	var myPosition = gl.getAttribLocation(myShaderProgramCircle, "myPosition");
	gl.vertexAttribPointer(myPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(myPosition);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 100);
	gl.uniform2f(coordinatesUniform, stepX, stepY);
	stepX += directionX;
	stepY += directionY;

	bounds();
	foodCollision();
	enemyCollision();

	requestAnimFrame(render);
}

function drawCircle() {
	arrayOfPointsForCircle = [];
	var thetaStart = 0;
	var thetaEnd = 2 * Math.PI;
	var thetaStep = (thetaEnd - thetaStart)/100;

	for (var i = 0; i < 100; i++) {
		theta = thetaStart + i * thetaStep;
		var x = Math.cos(theta)/circleRadius;
		var y = Math.sin(theta)/circleRadius;
		var myPoint = vec2(x,y);
		arrayOfPointsForCircle.push(myPoint);
	}

	bufferIdCircle = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdCircle);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(arrayOfPointsForCircle), gl.STATIC_DRAW);
}

function drawFood() {
	arrayOfPointsForFood = [];
	var thetaStart = 0;
	var thetaEnd = 2 * Math.PI;
	var thetaStep = (thetaEnd - thetaStart)/100;

	randX = Math.random() * 2 - 1;
	randY = Math.random() * 2 - 1;

	for (var i = 0; i < 100; i++) {
		theta = thetaStart + i * thetaStep;
		var x = randX + Math.cos(theta)/foodRadius;
		var y = randY + Math.sin(theta)/foodRadius;
		var myPoint = vec2(x,y);
		arrayOfPointsForFood.push(myPoint);
	}

	bufferIdFood = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdFood);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(arrayOfPointsForFood), gl.STATIC_DRAW);
}

function drawEnemy() {
	arrayOfPointsForEnemy = [];
	var thetaStart = 0;
	var thetaEnd = 2 * Math.PI;
	var thetaStep = (thetaEnd - thetaStart)/5;

	for (var i = 0; i < 5; i++) {
		theta = thetaStart + i * thetaStep;
		var x = -.5 + Math.cos(theta)/6;
		var y = -.5 + Math.sin(theta)/6;
		var myPoint = vec2(x,y);
		arrayOfPointsForEnemy.push(myPoint);
	}

	bufferIdEnemy = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdEnemy);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(arrayOfPointsForEnemy), gl.STATIC_DRAW);
}

function drawEnemy2() {
	arrayOfPointsForEnemy2 = [];
	var thetaStart = 0;
	var thetaEnd = 2 * Math.PI;
	var thetaStep = (thetaEnd - thetaStart)/3;

	for (var i = 0; i < 3; i++) {
		theta = thetaStart + i * thetaStep;
		var x = .5 + Math.cos(theta)/6;
		var y = .5 + Math.sin(theta)/6;
		var myPoint = vec2(x,y);
		arrayOfPointsForEnemy2.push(myPoint);
	}

	bufferIdEnemy2 = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdEnemy2);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(arrayOfPointsForEnemy2), gl.STATIC_DRAW);
}

function moveCircleKeys(event) {
	var theKeyCode = event.keyCode;
	if (theKeyCode == 65) { // 'a'
		directionX = -stepScale;
		directionY = .0;
	}
	else if (theKeyCode == 68) { // 'd'
		directionX = stepScale;
		directionY = .0;
	}
	else if (theKeyCode == 83) { // 's'
		directionY = -stepScale;
		directionX = .0;
	}
	else if (theKeyCode == 87) { // 'w'
		directionY = stepScale;
		directionX = .0;
	}
}

function updateScore() {
	score += 10;
	document.getElementById('score').innerHTML = score;

	if (score == 1000){
		win();
	}//end if
}

function foodCollision(){
	var collide = false;
	for (var x = randX - .2; x <= randX + .2; x += .02){
		for (var y = randY -.2; y <= randY + .2; y += .02){
			if (x == stepX && y == stepY){
					collide = true;
			}
		}
	}

	if (collide == true) {
		//delete food circle
		foodRadius -= 2;
		circleRadius--;
		updateScore();
	}
}

function enemyCollision(){
	var collide = false;
	var x,y;
	for (x = -.7; x <= -.3; x += .02) {
		for (y = -.7; y <= -.3; y += .02) {
			if (x == stepX && y == stepY) {
					collide = true;
			}
		}
	}

	if (collide == true) {
		//Lose game
		console.logo("LOSER");
	}
}

function win() {

}

function bounds() {
	if (stepX >=1){
		stepX = -1;
	} else if (stepX <=-1){
		stepX = 1;
	} else if (stepY >= 1) {
		stepY = -1;
	} else if (stepY <= -1) {
		stepY = 1;
	}
}
