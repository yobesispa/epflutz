
/**
 ***************************************
 * @[license]: any GPL you like!
 * @author: https://github.com/yobesispa
 *************************************** 
**/

// APPEND A COVER IMAGE TO A PDF
// USAGE: 
//   cd to the current directory, and run the command below:
//   mutool run recipe-raw-eith-toc.js <path to the pdf you want to append the cover to >  <path to the image> 

'use strict';
'use strict';

var pdf_lib = require('../../epflutz');
  
var PDFReadOnly = pdf_lib.PDFReadOnly
,   PDFWriter = pdf_lib.PDFWriter
; 

var SAVE_PATH = 'raw-with-cover.pdf';
var sourceCoverLocation = scriptArgs[1] || '../master-cover.jpg';

var sourcePDF = PDFReadOnly.load(scriptArgs[0] || '../raw.pdf');
var pw = new PDFWriter();

var pcount = sourcePDF.pageCount();
var e = 0;
while (e<pcount) {
  var sourcePage = sourcePDF.pageAt(e);  
  pw.pushPage(pw.clone(sourcePage));
  ++e;
}

var pageCover = pw.makePageFromImageFileAndBounds(
  sourceCoverLocation,
  pw.pageAt(0).bounds());

pw.insertPage(pageCover,0);

pw.unsafeSaveAs(SAVE_PATH); 

print('\n--saved{'+SAVE_PATH+'}\n');
