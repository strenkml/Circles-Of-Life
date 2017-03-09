var theta, canvas, gl;
var myShaderProgramCircle, myShaderProgramFood;
var n = 100;
var score = 0;

//Animation global variables
var coordinatesUniform;
var stepX, stepY;
var directionX, directionY;
var stepScale;

function init() {
	canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL is unavailable"); }
	gl.viewport(0, 0, 720, 720);
	gl.clearColor(0, 0, 0, 1);

	myShaderProgramCircle = initShaders(gl,"vertex-shader", "fragment-shader-circle");
	gl.useProgram(myShaderProgramCircle);
	drawCircle();

	//myShaderProgramFood = initShaders(gl,"vertex-shader", "fragment-shader-food");
	//gl.useProgram(myShaderProgramFood);

	theta = .0;
	rotateFlag = 0;
	stepX = .0; stepY = .0;
	directionX = .0; directionY = .0;
	stepScale = .01;

	coordinatesUniform = gl.getUniformLocation(myShaderProgramCircle, "mouseCoordinates");
	gl.uniform2f(coordinatesUniform, .0, .0);

	document.getElementById('score').innerHTML = score;


	render();
}

function drawCircle() {
	var arrayOfPointsForCircle = [];

	var x,y;

	var thetaStart = 0;
	var thetaEnd = 2 * Math.PI;
	var thetaStep = (thetaEnd - thetaStart)/n;

	var myPoint;

	for (var i = 0; i < n; i++) {
		theta = thetaStart + i * thetaStep;
		x = Math.cos(theta)/10;
		y = Math.sin(theta)/10;
		myPoint = vec2(x,y);
		arrayOfPointsForCircle.push(myPoint);
	}

	var bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(arrayOfPointsForCircle), gl.STATIC_DRAW);

	var myPosition = gl.getAttribLocation(myShaderProgramCircle, "myPosition");
	gl.vertexAttribPointer(myPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(myPosition);
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

function render() {
	var thetaUniform = gl.getUniformLocation(myShaderProgramCircle, "theta");

	gl.uniform1f(thetaUniform, theta);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
	gl.uniform2f(coordinatesUniform, stepX, stepY);
	stepX += directionX;
	stepY += directionY;
	requestAnimFrame(render);
}

function updateScore() {
	score += 10;
	document.getElementById('score').innerHTML = score;
}

function drawFood(){
	var arrayOfPointsForFood = [];

	var x,y;

	var thetaStart = 0;
	var thetaEnd = 2 * Math.PI;
	var thetaStep = (thetaEnd - thetaStart)/n;

	var myPoint;

	for (var i = 0; i < n; i++) {
		theta = thetaStart + i * thetaStep;
		x = Math.cos(theta)/10;
		y = Math.sin(theta)/10;
		myPoint = vec2(x,y);
		arrayOfPointsForFood.push(myPoint);
	}

	var bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(arrayOfPointsForFood), gl.STATIC_DRAW);

	var myPosition = gl.getAttribLocation(myShaderProgramFood, "myPosition");
	gl.vertexAttribPointer(myPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(myPosition);
}

function drawEnemy(){

}