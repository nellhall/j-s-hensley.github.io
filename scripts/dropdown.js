function dropper(element){
  var parent = element.parentNode;
  var children = parent.children;
  for (var i = 0; i < children.length; i++){
    var child = children[i]
    if (child.classList[0] == "dropArrow"){
      child.classList.toggle('rotated');
    }
    if (child.classList[0] == "dropContent"){
      child.classList.toggle('visible');
    }
  }
}
