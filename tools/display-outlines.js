
'use strict';

var name = scriptArgs[0];

function say_err(e) { print('!'+e); }
function say_title(l) { print('*'+l); }
function say_close() { print('-'); }

function showOutlines(fname) {
  var docRaw = new PDFDocument(fname);
  var trailer = docRaw.getTrailer();
  if (!trailer) {
    say_err('NO_TRAILER');
    return;
  }
  
  var root = trailer.get("Root");
  if (!root) {
    say_err('NO_ROOT');
    return;
  }
  
  var outlines = root.get("Outlines");
  if (!outlines) {
    return;
  }

  var visited = {};
  
  obj_enter(visited, outlines);
    consumeOutlines(outlines, "", visited) ;
  obj_exit(visited,outlines)
}

function consumeOutlines(master, levelStr, visited)  {  
  var titleRaw = master.get("Title");
  var titleStr = "";
  if (!titleRaw) { titleStr = "<<NO_TITLE>>"; } 
  else { titleStr = titleRaw.asString(); }
  var to = master.get("Dest"), num = null;;
  if (to) {
    var numRaw = to[0];
    if (numRaw) { num = numRaw.asNumber(); }
  }  
  
  if (!(num === 0||num)) { num = "[[Unknown]]"; }
  
  if (titleRaw) { say_title(levelStr+JSON.stringify(titleStr)+' -----> '+num); } 
  var ch = master.get("First"); 
  if (!ch){return}
  var last = master.get("Last");
  
  while (true) {
    obj_enter(visited, ch);
      consumeOutlines(ch,levelStr+"  ",visited) ;
    obj_exit(visited, ch);

    if (ch===last) {break}

    ch = ch.get("Next");
    if (!ch){break}
  }
} 

// TODO: CYCLIC REFERENCES MUST BE TAKEN CARE OF
function obj_enter(visited, obj) { return }
function obj_exit(visited, obj) { return; } 

showOutlines(name);
say_close(); 
  
