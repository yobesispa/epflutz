
'use strict';

function say_err(e) { print('!'+e); }
function say_consumable(l) { print('*'+l); }
function say_output_complete() { print('-'); }

var HEX = "0123456789abcdef";
var NONE = [];

function TO_UNICODE_HEX(cn) {
  var n = cn.charCodeAt(0); 
  var a = HEX.charAt(n&0xf); n >>>= (4);
  var b = HEX.charAt(n&0xf); n >>>= (4);
  var c = HEX.charAt(n&0xf); n >>>= (4);
  var d = HEX.charAt(n&0xf); 
  return '\\u'+(d)+(c)+(b)+(a);
} 

function safeJSON(o) {
  return JSON.stringify(o).replace(/[\u0000-\u001f\u007f-\uffff]/g, TO_UNICODE_HEX);
} 

function serverLoop() {
  var fileNameAsJSON = null;
  while (true) {
    try {
      fileNameAsJSON = NONE;
      fileNameAsJSON = readline();
      var fileName = JSON.parse(fileNameAsJSON);
      if ((typeof fileName) !== (typeof "")) {
        say_err("fileName must be given as a JSON-encoded string of characters");
	continue;
      }
      var pdoc = new Document(fileName);
      var outlineAsObject = pdoc.loadOutline();
      say_consumable(safeJSON(outlineAsObject));
    }
    catch (_error) {
      if (fileNameAsJSON===NONE) {
        say_err("ERROR_READLINE_FAILURE: "+safeJSON(_error));
        say_output_complete();
        break;
      }
      else {
        say_err("ERROR: "+safeJSON(_error));
      }
    }
    say_output_complete();
  }
} 

serverLoop(); 
