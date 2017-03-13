var theta, canvas, gl;
var myShaderProgramCircle, myShaderProgramFood, myShaderProgramEnemy, myShaderProgramEnemy2;
var bufferIdCircle, bufferIdFood, bufferIdEnemy, bufferIdEnemy2;
var arrayOfPointsForCircle, arrayOfPointsForFood, arrayOfPointsForEnemy, arrayOfPointsForEnemy2;
var nEnemy = 6; var nEnemy2 = 3;
var score = 0;
var foodLeft = 5;
var randX,randY;
var foodRadius = 30;
var circleRadius = 10;

var gameOver = false;

//Animation global variables
var coordinatesUniform;
var stepX, stepY, stepScale;
var directionX, directionY;
var thetaUniform;

function init() {
	canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL is unavailable"); }
	gl.viewport(0, 0, 720, 720);
	gl.clearColor(0, 0, 0, 1);

	myShaderProgramCircle = initShaders(gl,"vertex-shader", "fragment-shader-circle");
	drawCircle(1);

	myShaderProgramFood = initShaders(gl,"vertex-shader2", "fragment-shader-food");
	drawFood(1);

	myShaderProgramEnemy = initShaders(gl,"vertex-shader3", "fragment-shader-enemy");
	drawEnemy(1);

	myShaderProgramEnemy2 = initShaders(gl,"vertex-shader3", "fragment-shader-enemy2");
	drawEnemy2(1);

	theta = .0;
	stepX = .0; stepY = .0; stepScale = .01;
	directionX = .0; directionY = .0;

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
	gl.drawArrays(gl.TRIANGLE_FAN, 0, nEnemy);

	// Enemy2 shader program
	gl.useProgram(myShaderProgramEnemy2);
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdEnemy2);
	var myPositionEnemy2 = gl.getAttribLocation(myShaderProgramEnemy2, "enemyPosition");
	gl.vertexAttribPointer(myPositionEnemy2, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(myPositionEnemy2);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, nEnemy2);

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

function drawCircle(visible) {
	arrayOfPointsForCircle = [];
	var thetaStart = 0;
	var thetaEnd = 2 * Math.PI * visible;
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

function drawFood(visible) {
	arrayOfPointsForFood = [];
	var thetaStart = 0;
	var thetaEnd = 2 * Math.PI * visible;
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

function drawEnemy(visible) {
	arrayOfPointsForEnemy = [];
	var thetaStart = 0;
	var thetaEnd = 2 * Math.PI * visible;
	var thetaStep = (thetaEnd - thetaStart)/nEnemy;

	for (var i = 0; i < nEnemy; i++) {
		theta = thetaStart + i * thetaStep;
		var x = -.3 + Math.cos(theta)/6;
		var y = -.4 + Math.sin(theta)/6;
		var myPoint = vec2(x,y);
		arrayOfPointsForEnemy.push(myPoint);
	}

	bufferIdEnemy = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdEnemy);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(arrayOfPointsForEnemy), gl.STATIC_DRAW);
}

function drawEnemy2(visible) {
	arrayOfPointsForEnemy2 = [];
	var thetaStart = 0;
	var thetaEnd = 2 * Math.PI * visible;
	var thetaStep = (thetaEnd - thetaStart)/nEnemy2;

	for (var i = 0; i < nEnemy2; i++) {
		theta = thetaStart + i * thetaStep;
		var x = .3 + Math.cos(theta)/6;
		var y = .4 + Math.sin(theta)/6;
		var myPoint = vec2(x,y);
		arrayOfPointsForEnemy2.push(myPoint);
	}

	bufferIdEnemy2 = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdEnemy2);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(arrayOfPointsForEnemy2), gl.STATIC_DRAW);
}

function moveCircleKeys(event) {
	var theKeyCode = event.keyCode;
	if (theKeyCode == 65 && !gameOver) { // 'a'
		directionX = -stepScale;
		directionY = .0;
	}
	else if (theKeyCode == 68 && !gameOver) { // 'd'
		directionX = stepScale;
		directionY = .0;
	}
	else if (theKeyCode == 83 && !gameOver) { // 's'
		directionY = -stepScale;
		directionX = .0;
	}
	else if (theKeyCode == 87 && !gameOver) { // 'w'
		directionY = stepScale;
		directionX = .0;
	}
}

function updateScore() {
	if (score != 10){
		score += 10;
		document.getElementById('score').innerHTML = score;	
	} else{
		win();
	}
}

function foodCollision(){
	if (stepX >= randX - .1 && stepX <= randX + .1 && stepY >= randY - .1 && stepY <= randY + .1 && !gameOver){
		drawFood(1);
		drawCircle(1);
		updateScore();
	}
}

function enemyCollision(){
	if (stepX >= -.6 && stepX <= -.05 && stepY >= -.65 && stepY <= -.15 && !gameOver){
		drawCircle(0);
		score = "You Lose!";
		document.getElementById('score').innerHTML = score;
		gameOver = true;
	}
	
	if (stepX >= 0 && stepX <= .55 && stepY >= .15 && stepY <= .65){
		score = "You Lose!";
		document.getElementById('score').innerHTML = score;
		gameOver = true;
	}
}

function win() {
	gameOver = true;
	drawFood(0);
	drawCircle(0);
	drawEnemy(0);
	drawEnemy2(0);
	score = "You Win!";
	document.getElementById('score').innerHTML = score;
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
