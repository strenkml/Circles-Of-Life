const var width = 512;

function init(){
  var canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl){
    alert("WebGL is not available!");
  }//end if

  gl.viewport(0,0,width,width);
  gl.clearColor(0,1,1,1);

  gl.enable(gl.DEPTH_TEST);

  myShaderProgram = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(myShaderProgram);
}//end function init
