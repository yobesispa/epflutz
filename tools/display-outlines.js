
'use strict';

var name = scriptArgs[0];

function say_err(e) { print('!'+e); }
function say_title(l) { print('*'+l); }
function say_close() { print('-'); }

var HEX = "0123456789abcdef";

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
  
  var err = obj_enter(visited, outlines);
  if (err) {
    say_err("obj_enter: "+err);

    // TODO: or maybe resume? there might be other outline elements that are "safe" by obj_enter standards
    return;
  } 
   
  consumeOutlines(outlines, "", visited) ;
  obj_exit(visited,outlines)
}

function TO_UNICODE_HEX(cn) {
  var n = cn.charCodeAt(0); 
  var a = HEX.charAt(n&0xf); n >>>= (4);
  var b = HEX.charAt(n&0xf); n >>>= (4);
  var c = HEX.charAt(n&0xf); n >>>= (4);
  var d = HEX.charAt(n&0xf); 
  return '\\u'+(d)+(c)+(b)+(a);
} 

function safeJSON(str) {
  return JSON.stringify(str).replace(/[\u0000-\u001f\u007f-\uffff]/g, TO_UNICODE_HEX);
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
  
  if (titleRaw) {
    say_title(
      "["+
      safeJSON(levelStr+titleStr.replace(/^\s+|\s+$/g,""))+
      ","+
      JSON.stringify(num)+
      "]"
    );
  } 
  var ch = master.get("First"); 
  if (!ch){return}
  var last = master.get("Last");
  
  while (true) {
    var err = obj_enter(visited, ch);
    if (err) { say_err("obj_enter: "+err); return; } 
      consumeOutlines(ch,levelStr+"  ",visited) ;
    obj_exit(visited, ch);

    if (ch===last) {break}

    ch = ch.get("Next");
    if (!ch){break}
  }
} 

function obj_enter(visited, obj) { 
  if (!obj || !obj.isIndirect || !obj.isIndirect()) {
    return "outline element must be a pdf ref-obj, not "+obj;
  }
  var num = obj.asIndirect();
  if (visited[num]) { 
    return "already visited ref-obj #R("+num+")";
  }
  visited[num]=true;
  return (null);
} 

// every outline elements must be visited only once, so exit semantics (including push-pop equality check) is unnecessary
function obj_exit(visited, obj) {
  return; 
} 

showOutlines(name);
say_close(); 
  
