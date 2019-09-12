var svgNS = "http://www.w3.org/2000/svg";

var boxName = "Box";
var box = document.getElementById(boxName);

var boxContainerName = "BoxContainer";
var boxContainer = document.getElementById(boxContainerName);

var width = parseFloat(boxContainer.clientWidth);
var height = parseFloat(boxContainer.clientHeight);

var Path = [];
var dR = height*0.1;
var dt = 0.1

function makePath(){
  num = Math.max(width, height)/dR;
  Path = [];
  for (var t = 0; t < 2 * Math.PI * num; t+= dt){
    var r = t * dR/(2 * Math.PI);
    Path.push([r*Math.cos(t) + width*0.2,r*Math.sin(t)+height*0.2]);
  }
}

function drawPath(){
  pathstring = "M ";
  pathstring += Path[0][0].toString() + " " + Path[0][1].toString() + " ";
  for (var i = 1; i < Path.length; i++){
    pathstring += "L " + Path[i][0].toString() + " " + Path[i][1].toString() + " ";
  }
  var line = document.createElementNS(svgNS, "path");
  line.id = "line";
  line.setAttribute("d", pathstring);
  line.setAttribute("style","stroke: white; stroke-width:2");
  box.appendChild(line);
}


function updatePath(){
  var dUpdate = 0.001
  for (var i = 0; i < Path.length; i++){
    Path[i][0] *= 1.0 + dUpdate*(Math.random()- 0.5);
    Path[i][1] *= 1.0 + dUpdate*(Math.random()- 0.5);
  }
  pathstring = "M ";
  pathstring += Path[0][0].toString() + " " + Path[0][1].toString() + " ";
  for (var i = 1; i < Path.length; i++){
    pathstring += "L " + Path[i][0].toString() + " " + Path[i][1].toString() + " ";
  }
  var line = document.getElementById("line");
  line.setAttribute("d", pathstring);
}

function updateClient() {
  if ((width != parseFloat(boxContainer.clientWidth))||(height != parseFloat(boxContainer.clientHeight))){
    width = parseFloat(boxContainer.clientWidth);
    height = parseFloat(boxContainer.clientHeight);
  }
}

function Animate() {
  updateClient();
  updatePath();
  requestAnimationFrame(Animate);
}

function Initialize(nPoints) {
  makePath(nPoints);
  drawPath();
}

Initialize();
Animate();
