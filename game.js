// Matthew Strenk
// 2-16-17
// Lab1: Javascript

var canvas,gl,myShaderProgram;
var theta, animation, mouseCoordLoc;
var x, y;
var moveX, moveY, moveValue;
var stepX, stepY;
var n = 300;

function drawDecagon(){
	theta = 0.0;
    animation = 0;
    stepX = .0; 
	stepY = .0;
    moveX = .01; 
	moveY = .0;
    moveValue = .01;
	
	canvas=document.getElementById("gl-canvas");
	gl=WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL is not avaliable"); }
	
	gl.viewport(0, 0, 512, 512);
	gl.clearColor(1.0, 0.5, 0.0, 1.0);
	
	
	var decagonArray=[];
	
	var thetaStart = 0;
	var thetaEnd = 2* Math.PI;
	var thetaStep = (thetaEnd - thetaStart)/n;
	
	var myPoint;
	
	for (var i=0; i<n; i++){
		shapeTheta = thetaStart + i * thetaStep;
		x = Math.cos( shapeTheta )/4;
		y = Math.sin( shapeTheta )/4;
		myPoint = vec2( x,y );
		decagonArray.push( myPoint );
	}
	
	var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    
    gl.bufferData( gl.ARRAY_BUFFER, flatten(decagonArray), gl.STATIC_DRAW  );
    
	myShaderProgram = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(myShaderProgram);
	
	
    var myPosition = gl.getAttribLocation( myShaderProgram, "myPosition" );
    gl.vertexAttribPointer( myPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPosition );
	
	render();
}
function render() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
	
	stepX += moveX;
	stepY += moveY;

	requestAnimFrame(render);
}

function keyAction(event){
	var keyCode = event.keyCode;
	if (keyCode == 87) {//Key: W
		moveX = .0;
		moveY = moveValue;
	} else if (keyCode == 65){//Key: A
		moveX = -moveValue;
		moveY = .0;
	} else if (keyCode == 83){//Key: S
		moveX = .0;
		moveY = -moveValue;
	} else if (keyCode == 68){
		moveX = moveValue;
		moveY = .0;
	}
}

function increaseMove(){
	moveValue += .005;
	if (moveX != 0) {
		if (moveX < 0){
			moveX = -moveValue;
		} else if (moveX > 0){
			moveX = moveValue;
		}
	} else if (moveY != 0){
		if (moveY < 0){
			moveY = -moveValue;
		} else if (moveY > 0){
			moveY = moveValue;
		}
	}
}


