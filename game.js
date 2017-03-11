var theta, canvas, gl;
var myShaderProgramCircle, myShaderProgramFood;
var bufferIdCircle, bufferIdFood;
var arrayOfPointsForCircle, arrayOfPointsForFood;
var score = 0;

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

	myShaderProgramFood = initShaders(gl,"vertex-shader2", "fragment-shader-food"); 
	drawFood();
	
	myShaderProgramCircle = initShaders(gl,"vertex-shader", "fragment-shader-circle");
	drawCircle();

	theta = .0;
	stepX = .0; stepY = .0;
	directionX = .0; directionY = .0;
	stepScale = .01;

	coordinatesUniform = gl.getUniformLocation(myShaderProgramCircle, "mouseCoordinates");
	gl.uniform2f(coordinatesUniform, .0, .0);

	document.getElementById('score').innerHTML = score;

	render();
}

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	
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
	
	requestAnimFrame(render);
}

function drawCircle() {
	arrayOfPointsForCircle = [];
	var thetaStart = 0;
	var thetaEnd = 2 * Math.PI;
	var thetaStep = (thetaEnd - thetaStart)/100;

	for (var i = 0; i < 100; i++) {
		theta = thetaStart + i * thetaStep;
		var x = Math.cos(theta)/10;
		var y = Math.sin(theta)/10;
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

	for (var i = 0; i < 100; i++) {
		theta = thetaStart + i * thetaStep;
		var x = Math.cos(theta)/30;
		var y = Math.sin(theta)/30;
		var myPoint = vec2(x,y);
		arrayOfPointsForFood.push(myPoint);
	}

	bufferIdFood = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdFood);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(arrayOfPointsForFood), gl.STATIC_DRAW);
}

function moveCircle(event) {
	var canvasX = event.clientX;
	var canvasY = event.clientY;

	stepX = 2 * canvasX / 512 - 1;
	stepY = -(2 * canvasY / 512 - 1);
	gl.uniform2f(coordinatesUniform, stepX, stepY);
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
}
