
/**
 ***************************************
 * @[license]: any GPL you like!
 * @author: https://github.com/yobesispa
 *************************************** 
**/

'use strict';

var PAGE_MEMBERS = ["MediaBox","Resources","Contents","Rotate"];
var OUTLINE_ROOT = []; 

function __class(ctor,fn){
  fn(ctor.prototype);
  return ctor;
} 
  
function Page(master, raw) {
  this.master = master ? master : null;
  this.attached = false;
  this.raw = raw;
  this._anchor = null;
  this._bounds = null;
}

__class(
Page, function(cls) {
cls.attachTo = function(master) {
  master || fail("master wanted, not "+master);
  !this.attached || fail("page has been attached previously");
  var m = this.master;
  if (!m) { this.master = master }
  else {
    m === master || fail("page master must be the same as the master the page is attaching to");
  }
  this.attached = true;
  return this;
};

cls.getAnchor = function(makeIfNone) {
  var e = this._anchor;
  if (e){return e}
  if (!makeIfNone){return null}
  return this._anchor = new PageNumAnchor();
}; 

cls.bounds = function() {
  var e = this._bounds ;
  if (e){return e}

  var m = this.raw.get("MediaBox");
  m || fail("there is no MediaBox for the given page");
  
  var l = 0;
  e = [];
  while (l<m.length) { e.push(m[l++].asNumber()) }

  var err = chkBounds(e);
  if (err) { fail("bounds -- "+err); }
   
  return this._bounds = e;
}; 

cls.setBounds = function(bounds) {
  var err = chkBounds(bounds);
  if (err){fail("chk--"+err);}

  var l = 0, bcopy = [];
  while (l<bounds.length) {bcopy.push(bounds[l++]);}
  
  var e = this._bounds = bcopy;
  this.raw.put("MediaBox",e);
  return this;
}; 
  
cls.cloneFor = function(pdfWriter){
  return pdfWriter.makePageFromAnotherRaw(this.raw);
};
}); 

function PageNumAnchor() {
  this._value = -1;
}

__class(PageNumAnchor,function(cls) {

cls.resolveTo = function(n) {
  chkInt(n) || fail("integer wanted, not "+n);
  n >= 0 || fail("page number must be >= 0, not "+n);
  this._value = n;
  return this;
}; 

cls.value = function() {
  this.isResolved() || fail("unresolved");
  return this._value;
};

cls.clear = function() {
  var e = this._value;
  this._value = -1;
  return e;
};

cls.isResolved = function() {
  return this._value !== -1;
}; 
  
}); 

function PDFWriter() {
  this.docRaw = new PDFDocument();
  this._pages = [];
  this._outlineRoot = null;
  this._graftMap = this.docRaw.newGraftMap();
} 

__class(PDFWriter,function(cls) {

cls.pageCount = function() {
  return this._pages.length; 
};
  
cls.pageAt = function(n) {
  chkInt(n) || fail("want integer, not "+n);
  var len = this.pageCount();
  (0<=n && n<len)||fail("want n as 0 <= n < "+len+", not "+n);
  return this._pages[n];
};

cls.pushPage = function(pageUnchecked) {
  var page = this.assimilatePage(pageUnchecked)  ;
  page.attachTo(this);
  this._pages.push(page);
  var attachedPage = this.docRaw.addObject(page.raw);
  this.docRaw.insertPage(-1,attachedPage);
  return page;
}; 

cls.pan = function(n){
 return this.pageAt(n).getAnchor(true);
}; 

cls.insertPage = function(pageUnchecked,n) { 
  chkInt(n) || fail("want integer, not "+n);
  var len = this.pageCount();
  (0<=n && n <=/*sic*/ len)||fail("want n as 0 <= n <= "+len+", not "+n);
  
  var page = this.assimilatePage(pageUnchecked)  ;
  page.attachTo(this);
  this._pages.splice(n,0,page);
  var attachedPage = this.docRaw.addObject(page.raw);
  this.docRaw.insertPage(n,attachedPage);
  return page;
}; 

cls.makePageFromImageFileAndBounds = function(locf, bounds ) {
  var docRaw = this.docRaw;
  var resImage = new Image(locf); 
  var buf = new Buffer();
  
  var err = chkBounds(bounds );
  if (err) { fail("bounds must be a valid one -- "+e); }
  
  buf.write('q '+
    (bounds[2]-bounds[0])+' 0 0  '+
    (bounds[3]-bounds[1])+' 0 0  '+
    'cm  /CoverImage Do Q'
  ); 
  buf = docRaw.addRawStream(buf); 

  var res = docRaw.addObject({ 
    'XObject': {'CoverImage':docRaw.addImage(resImage)}
  });
  var p0 = docRaw.newDictionary();
  p0.put("MediaBox",bounds), p0.put("Resources",res);
  p0.put("Contents",buf), p0.put("Type",docRaw.newName("Page"));
  
  var page = new Page(this,p0);
  
  return page;
}; 

cls.makePageFromAnotherRaw = function(raw){
  var docRaw = this.docRaw, grafter = this._graftMap;
  var r = docRaw.newDictionary(), n = 0;
   
  while (n<PAGE_MEMBERS.length){
    var nm = PAGE_MEMBERS[n++];
    var value = raw.get(nm); 
    if (value) { r.put(nm, grafter.graftObject(value)) }
  }
  r.put("Type",docRaw.newName("Page"));
  
  return new Page(this,r);
}; 

cls.clone = function(page) { return page.cloneFor(this); };

cls.saveAs = function(nm){
  var m = nm.match(/^(.*)(\.pdf)$/i);
  var r = Math.random();
  var realName = "";
  if (m) { realName = m[1]+'-'+r+m[2]; }
  else { realName = nm+'-'+r+'.pdf';}
  this.unsafeSaveAs(realName);
  return realName;
};
  
cls.unsafeSaveAs = function(realName) {
  var l = 0, len = this.pageCount(), docRaw = this.docRaw;
  while (l<len) {
    var page = this.pageAt(l);
    var e = page.getAnchor();
    if (e) { e.resolveTo(l) }
    page.attached || fail("unexpected; !page.attached" );
    ++l;
  }
  var outlineRoot = this._outlineRoot;
  if (outlineRoot)  {
    var raw = outlineRoot.compileFor(this,null);
    docRaw.getTrailer().get("Root").put("Outlines",raw);
  } 
   
  docRaw.save(realName, ("compress"));
  return realName;
}; 

cls.createOutlineRoot = function(){
  return new OutlineEntry(this,OUTLINE_ROOT,null);
};

cls.assimilatePage = function(page) {
  var master = page.master;
  return (master && master !== this) ? this.clone(page) : page;
};

cls.pushAllFromIndexWithLen = function(source,start,len){
  var npage = source.pageCount(), h = start;
  (chkInt(len) && 0<=len && len<=npage) || fail("want a number >= 0 && <= "+npage+" -- not "+len);
  (chkInt(start) && 0<=start && start+len<=npage) ||  fail("want a number >= 0 && <= "+npage+"-"+len+" ("+(npage-len)+") -- not "+start);
  while (len>0) { this.pushPage(source.pageAt(h)); h++, --len }
  return (h-start)
}; 
  
cls.setOutlineRoot = function(outlineRoot) {
  var outline = outlineRoot ;
  var master = outline.master;
  if (!master) { outline.master = master; }
  else { outline.master === this || fail("outline must be a creation of the current pdf-writer"); }
  !outline.attached || fail("outline has been attached already");
  outline.attached = true;
  this._outlineRoot = outline
}; 

}); 
  
function PDFReadOnly(raw) {
  this._raw = raw;
  this._pages = [];
}

__class(PDFReadOnly,function(cls) {

cls.pageCount = function(){ return this._raw.countPages(); };

cls.pageAt = function(n) {
  chkInt(n) || fail("want integer, not "+n);
  var len = this.pageCount();
  (0<=n && n<len)||fail("want n as 0 <= n < "+len+", not "+n);

  var e = this._pages[n];
  if (e) { return e; }

  e = new Page(this, this._raw.findPage(n));
  return this._pages[n]=e;
}; 

PDFReadOnly.load = function(fileName){
  return new PDFReadOnly(new PDFDocument(fileName));
};
 
});

function OutlineEntry(master, name, to) {
  this.master = master;
  this.attached = false ; 

  name === OUTLINE_ROOT ||
  (typeof name) === (typeof "") ||
    fail("string wanted, not--"+name); 
   
  this.name = name;
  this.to = to;
  this._ch = [];
} 
  
__class(OutlineEntry,function(cls) {
  
/*
cls.make = function(name, to) {
  return new OutlineEntry(this,name,to);
};
/**/ 
  
cls.pushChild = function(ch) {
  ch.attachTo(this);
  var chl = this._ch;
  chl.push(ch);
   
  return this;
};

cls.pushChildren = function(chl){
  var len = chl.length;
  (chkInt(len) && len>=0) || fail("valid length, not "+len);
  var e = 0;
  while (e<len){this.pushChild(chl[e++])}
   
  return this;
}; 

cls.attachTo=function(master){
  master || fail("master wanted, not "+master);
  !this.attached || fail("page has been attached previously");
  var m = this.master;
  if (!m) { this.master = master }
  else {
    m === master || fail("page master must be the same as the master the page is attaching to");
  }
  this.attached = true;
  return this;
}; 
  
cls.compileFor = function(pdfWriter,rawParent) {
  var docRaw = pdfWriter.docRaw;
  var current = docRaw.newDictionary();
   
  if (rawParent !== null) {
    rawParent || fail("outer wanted, not "+rawParent);
    current.put("Parent",rawParent);
    current.put("Dest", this.to.compileFor(pdfWriter));
    var title = docRaw.newString(this.name);
    current.put("Title", title);
  } 
  else {
    this.master === pdfWriter || fail("root.master must be the pdf-writer");
    this.name === OUTLINE_ROOT || fail("root.name !== OUTLINE_ROOT" ) ;
    this.to === null || fail("root.to must be null");
    this._ch.length>0 || fail("root.children.length must be >0") ;
  }
   
  var currentAsRef = docRaw.addObject(current);
  var chl = this._ch, len = chl.length;
  if (len>0) {
    var latestCh = chl[0].compileFor(pdfWriter,currentAsRef);
    current.put("First", latestCh);
    var currentCh = latestCh, e=1 ;
    while (e<len){
      currentCh = chl[e].compileFor(pdfWriter,currentAsRef);
      latestCh.put("Next", (currentCh));
      currentCh.put("Prev", (latestCh));
      latestCh = currentCh;
      ++e;
    } 
    current.put("Last",currentCh);
  }
  
  return (currentAsRef);
}; 

OutlineEntry.make = function(name,pageNumFuture,xyz,ch) {
  if (xyz instanceof PageXYZ) {}
  else {
    var x = null, y = null, z = 0;
    if (xyz) {
      switch (xyz.length) {
      case 3:
        z = xyz[2]; if (z===null){z=0}; /* fall-through */
      case 2:
        y = xyz[1]; /* fall-through */
      case 1:
        x = xyz[0]; 
        break;
      default:
        if ('z' in xyz) {z=xyz.z; if (z===null){z=0} }
        if ('y' in xyz) {y=xyz.y;}
        if ('x' in xyz) {x=xyz.x;} 
      }
    }
    
    xyz = new PageXYZ(x,y,z);
  }
  
  var e = (new OutlineEntry(null,name,new OutlineTarget(pageNumFuture,xyz)));
  if (ch) { e.pushChildren(ch) }
  
  return e;
}; 
  
});

function OutlineTarget(futurePageNum, futurePageXYZ) {
  futurePageNum || fail("want pageNum");
  this.futurePageNum = futurePageNum;
  this.futurePageXYZ = futurePageXYZ || null;
}

__class(OutlineTarget,function(cls) {

cls.compileFor = function(pdfWriter) {
  var pageNum = this.futurePageNum.value(pdfWriter);
  var len = pdfWriter.pageCount();
  (chkInt(pageNum) && 0<=pageNum && pageNum<len) || fail("valid page number, not "+pageNum);
  var pageXYZ=null; 
  var e = this.futurePageXYZ;
  if (e) { pageXYZ = e.xyzFor(pageNum, pdfWriter); }

  return OutlineTarget.compileTarget(pdfWriter, pageNum, pageXYZ);
};

OutlineTarget.compileTarget = function(pdfWriter,num,xyz){
  var docRaw = pdfWriter.docRaw, len = pdfWriter.pageCount() ;
  (chkInt(num) && 0<=num && (num<(len))) || fail("valid page number, not "+pageNum);
  var arr = [];
  
  arr.push(num);
  arr.push(docRaw.newName('XYZ'));
  if (xyz!==null) {
    chkNum(xyz.x) || xyz.x === null || fail("valid x, not ["+xyz.x+"]");
    chkNum(xyz.y) || xyz.y === null ||fail("valid y, not ["+xyz.y+"]");
    chkNum(xyz.z) || xyz.z === null || fail("valid z, not ["+xyz.z+"]");
    arr.push(xyz.x), arr.push(xyz.y), arr.push(xyz.z);
  }
  else {
    arr.push(null), arr.push(null), arr.push(0);
  }
  
  
  return docRaw.addObject(arr);
};  
  
}); 


function PageXYZ(x,y,z) {
  x === null || chkNum(x) || fail("xyz.x -- number wanted, not "+x);
  y === null || chkNum(y) || fail("xyz.y -- number wanted, not "+y);
  if (z === null) {z=0}
  else {chkNum(z) || fail("xyz.z -- number wanted, not "+z);}

  this.x = x;
  this.y = y;
  this.z = z;
}

__class(PageXYZ,function(cls){
cls.xyzFor=function(pageNum,pdfWriter) {
  var r = pdfWriter.pageAt(pageNum);
  var bounds = r.bounds();
  return {
    x: this.x===null?this.x:/*bounds[2]-*/this.x,
    y: this.y===null?this.y:bounds[3]-this.y,
    z: this.z
  };
}; 
  
}); 
   
function chkNum(n) { 
  if (n===0){return true} 
  return (0<=n||n<0) && n===+n;
} 

function chkInt(n) {
  if (n !== +n) {return false}
  if (n<=0 || n>=0) {}
  else {return false}
  
  return (n===(n|0));
} 

function chkBounds(arr) {
  if (!arr) { return "bounds must be an array, not "+arr; }
  var len = arr.length;
  if (len !== 4) { return "bounds length must be 4, not "+len; }
  var l = 0;
  while (l<len) {
    var e = arr[l];
    if (!chkNum(e)){return "bounds["+l+"] must be a number -- "+(e);}
    ++l;
  }
   
  return 0;
} 

function fail(e) {
  throw new Error(e);
} 

var _exports = null;
try { _exports = exports; }
catch (_E) {}

if (_exports !== null) {
_exports.PDFWriter = PDFWriter;
_exports.PDFReadOnly = PDFReadOnly;
_exports.OutlineEntry = OutlineEntry;
_exports.OutlineTarget = OutlineTarget;
_exports.chkInt = chkInt;
_exports.PageXYZ = PageXYZ;
_exports.fail = fail; 
  
}  
