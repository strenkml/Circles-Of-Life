//Michael Farden
//CS452
//Lab 2

var theta, canvas, gl;
var myShaderProgram;

//Animation global variables
var coordinatesUniform;
var stepX, stepY;
var directionX, directionY;
var stepScale;

function init() {
	canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL is unavailable"); }
	gl.viewport(0, 0, 512, 512);
	gl.clearColor(0, 0, 0, 1);

	myShaderProgram = initShaders(gl,"vertex-shader", "fragment-shader-hexagon");
	gl.useProgram(myShaderProgram);

	theta = .0;
	rotateFlag = 0;
	stepX = .0; stepY = .0;
	directionX = .0; directionY = .0;
	stepScale = .01;

	coordinatesUniform = gl.getUniformLocation(myShaderProgram, "mouseCoordinates");
	gl.uniform2f(coordinatesUniform, .0, .0);

	setupHexagon();
	render();
}

function setupHexagon() {
	var arrayOfPointsForHexagon = [];

	var x,y;

	var thetaStart = 0;
	var thetaEnd = 2 * Math.PI;
	var thetaStep = (thetaEnd - thetaStart)/100;

	var myPoint;

	for (var i = 0; i < 100; i++) {
		theta = thetaStart + i * thetaStep;
		x = Math.cos(theta)/5;
		y = Math.sin(theta)/5;
		myPoint = vec2(x,y);
		arrayOfPointsForHexagon.push(myPoint);
	}

	var bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(arrayOfPointsForHexagon), gl.STATIC_DRAW);

	var myPosition = gl.getAttribLocation(myShaderProgram, "myPosition");
	gl.vertexAttribPointer(myPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(myPosition);
}

function moveHexagon(event) {
	var canvasX = event.clientX;
	var canvasY = event.clientY;

	stepX = 2 * canvasX / 512 - 1;
	stepY = -(2 * canvasY / 512 - 1);
	gl.uniform2f(coordinatesUniform, stepX, stepY);
}

function moveHexagonKeys(event) {
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
	var thetaUniform = gl.getUniformLocation(myShaderProgram, "theta");

	gl.uniform1f(thetaUniform, theta);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 100);
	gl.uniform2f(coordinatesUniform, stepX, stepY);
	stepX += directionX;
	stepY += directionY;
	requestAnimFrame(render);
}
