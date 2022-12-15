
'use strict';

var pdf_lib = require('../../epflutz');
  
var PDFReadOnly = pdf_lib.PDFReadOnly
,   PDFWriter = pdf_lib.PDFWriter
,   chkInt = pdf_lib.chkInt
,   fail = pdf_lib.fail 
; 

var SAVE_PATH = 'one-to-many';

var sourcePDF = PDFReadOnly.load(scriptArgs[0] || '../raw.pdf');

var MAX_PAGE_PLUS_1=sourcePDF.pageCount();

var ranges = []; // ||  0-. 7-. 13-. 23-. 29-. 51-. 74-. 89-. 106-. 135-. 169-. 184-. 193-. 204-. 220-. 238-. 

var e = 1;
while (e<scriptArgs.length) {
  var rn = parseRange(scriptArgs[e], MAX_PAGE_PLUS_1);
  var err = pushRange(ranges, rn);
  if (err) { fail("range "+scriptArgs[e]+" -- "+err); }
  ++e;
} 

if (ranges.length>0) {
  var last = ranges[ranges.length-1];
  if (last.tail===-1) {
    last.tail = MAX_PAGE_PLUS_1 - 1;
  }
}
   
e = 0;
while (e<ranges.length) {
  var rn = ranges[e];
  var len = rangeLength(rn);
  if (len>0) {
    var pw = new PDFWriter();
    pw.pushAllFromIndexWithLen(sourcePDF, rn.head, len);
    pw.unsafeSaveAs(SAVE_PATH+'_'+rangeToStr(rn));
  }
  ++e;
} 

function parseRange(str) {
  var m = null;
  var start = -1, last = -1;
  if (str.match(/^(?:[1-9][0-9]*|0)*$/)) {
    start = +str;
    last = start;
  }
  else if (m = str.match(/^([1-9][0-9]*|0)-\.$/)) {
    start = +m[1];
    last = -1;
  }
  else if (m = str.match(/^([1-9][0-9]*|0)-([1-9][0-9]*|0)$/)) {
    start = +m[1];
    last = +m[2];
    if (last<start) { fail("invalid range: "+str+" (last < start)"); }
  }
  else if (m = str.match(/\.-([1-9][0-9]*|0)$/ ) ) {
    start = -1;
    last = (+m[1]);
  }
  else {
    fail("invalid range: "+str+" (examples of valid ranges: 1 1-5 1-. .-5)")
  }
    
  return {head:start,tail:last};
}

function pushRange(ll, range) {
  if (range.head === -1) {
    if (range.tail > 0) {}
    else { return ("range.tail must be >=0 when range.start is 'auto'"); } 
    if (ll.length === 0) { range. head = 0 }
    else {
      var prevTail = ll[ll.length-1].tail;
      if (prevTail >= 0) {}
      else { return ("prevTail must be >=0 -- "+prevTail); }
      var start = prevTail+1;
      if (start<range.tail){}
      else {
        return ("calculated head ["+start+"] must be less than tail ["+
	  range.tail+"]");
      } 
      ranges.head=start;
    }
  }
  else if (ll.length>0) {
    var last = ll[ll.length-1];
    if (last.tail===-1){
      if (last. head>=0){} 
      else { return ("range.start must be >=0"); } 
      var ltail = range. head-1;
      if (last. head<=ltail) {}
      else { return ("auto tail must be >= head" ); }
      last.tail = ltail;
    }
  }
  ll.push(range);
  return null
} 

function rangeLength(rn) {
  var rhead = rn.head;
  (chkInt(rhead) && rhead>=0) || fail("range "+rangeToStr(rn));
  var rtail = rn.tail;
  (chkInt(rtail) && rtail>=rhead) || fail("range "+rangeToStr(rn));
  return (rtail-rhead)+1;
}
  
function rangeToStr(rn){
  return rn && (rn.head+"-"+rn.tail)
} 
