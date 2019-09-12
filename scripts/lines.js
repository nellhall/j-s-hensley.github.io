var svgNS = "http://www.w3.org/2000/svg";

const foreground = "#82c5d6";

const visibleDots = false;
const radius = "2.5";
const strokewidth = "0";
const track = false;
const mouseIndex = -1;

// this variable labels whether any touch events are detected;
// if it is true, it suppresses all mouseenters

var delta = 16;
var a_scale = 0.3**2;
var min_dist = 1;

var boxName = "Box";
var box = document.getElementById(boxName);

var boxContainerName = "BoxContainer";
var boxContainer = document.getElementById(boxContainerName);

var width = parseFloat(boxContainer.clientWidth);
var height = parseFloat(boxContainer.clientHeight);


var Lines = {}

function getPointAcc(x,y){
  var mult_factor = 4.0;
  var a_x = (1/(x + min_dist)**2 - 1/(width - x + min_dist)**2)*a_scale;
  var a_y = (1/(y + min_dist)**2 - mult_factor/(height - y + min_dist)**2)*a_scale;
  return [a_x, a_y]
}


function getAcc(lineName){
  // Get acceleration from box
  var line = Lines[lineName];
  var length = ((line.x1 - line.x2)**2 + (line.y1 - line.y2)**2)**0.5;
  var acc1 = getPointAcc(line.x1, line.y1);
  var acc2 = getPointAcc(line.x2, line.y2);
  var acc_x = (acc1[0] + acc2[0])*Math.abs(line.x1 - line.x2)/length;
  var acc_y = (acc1[1] + acc2[1])*Math.abs(line.y1 - line.y2)/length;
  return [acc_x,acc_y];
}

function updateLine(lineName){
  var line = Lines[lineName];
  var acc = getAcc(lineName)
  line.a_x = acc[0];
  line.a_y = acc[1];
  line.v_x = 0.96*(line.v_x + delta*line.a_x);
  line.v_y = 0.96*(line.v_y + delta*line.a_y);
  var delta_x = delta*line.v_x;
  var delta_y = delta*line.v_y;
  line.x1 = line.x1 + delta_x
  line.x2 = line.x2 + delta_x
  line.y1 = line.y1 + delta_y
  line.y2 = line.y2 + delta_y
  var object = document.getElementById(lineName);
  object.setAttribute("x1", line.x1);
  object.setAttribute("y1", line.y1);
  object.setAttribute("x2", line.x2);
  object.setAttribute("y2", line.y2);
}


function updateAllLines(){
  for (var k in Lines){
    if (k == mouseIndex) {continue;}
    updateLine(k);
  }
}

function updateClient() {
  if ((width != parseFloat(boxContainer.clientWidth))||(height != parseFloat(boxContainer.clientHeight))){
    width = parseFloat(boxContainer.clientWidth);
    height = parseFloat(boxContainer.clientHeight);
    voronoi.extent([[0,0],[width,height]]);
  }
}

function Animate() {
  updateClient();
  updateAllLines();
  requestAnimationFrame(Animate);
}

function addLine(x1,y1,x2,y2, color){
  var keys = Object.keys(Lines);
  var id = 0;
  if (keys.length){
    id = Math.max(...keys) + 1;
  }
  Lines[id] = {
    x1: x1,
    y1: y1,
    x2: x2,
    y2: y2,
    v_x:0,
    v_y:0,
    a_x:0,
    a_y:0,
    color: color,
  };
  var line = document.createElementNS(svgNS, "line");
  console.log(line);
  line.id = id;
  line.setAttribute("x1", x1);
  line.setAttribute("x2", x2);
  line.setAttribute("y1", y1);
  line.setAttribute("y2", y2);
  line.setAttribute("style","stroke:" + color + ";stroke-width:2")
  box.appendChild(line);
}

function Initialize(nPoints) {
  colors = ["white", "orange", "aqua", "fuchsia"]
  for(var i = 0; i < nPoints/2; i++){
    var x1 = Math.random()*width/2.0 + 10;
    var x2 = width - Math.random()*width/2.0 - 10;
    var y = Math.random()*(height - 100) + 10;
    var color = colors[Math.floor(Math.random()*colors.length)];
    addLine(x1, y, x2, y,color);
  }
  for(var i = 0; i < nPoints/2; i++){
    var y1 = Math.random()*(height - 40)/2.0 + 10;
    var y2 = height - 10 - Math.random()*(height - 40)/2.0;
    var x = Math.random()*(width - 20) + 10;
    var color = colors[Math.floor(Math.random()*colors.length)];
    addLine(x, y1, x, y2,color);
  }
}

Initialize(10);
Animate();
