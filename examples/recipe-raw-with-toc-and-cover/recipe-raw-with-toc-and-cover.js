
/**
 ***************************************
 * @[license]: any GPL you like!
 * @author: https://github.com/yobesispa
 *************************************** 
**/

// APPEND A COVER IMAGE AND A TABLE OF CONTENTS (AN "OUTLINE") TO A PDF
// USAGE: 
//   cd to the current directory, and run the command below:
//   mutool run recipe-raw-with-toc-and-cover.js <path to the pdf you want to append the cover and outline to >  <path to the image> 

'use strict';

var pdf_lib = require('../../epflutz');
  
var PDFReadOnly = pdf_lib.PDFReadOnly
,   PDFWriter = pdf_lib.PDFWriter
,   OutlineEntry = pdf_lib.OutlineEntry
; 

var SAVE_PATH = 'raw-with-toc-and-cover.pdf'; 
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
  
function _o(name,yFromTop,pageNum,ch) {
  return OutlineEntry.make(
    name,
    pw.pageAt(pageNum).getAnchor(true),
    [null,yFromTop,0], ch);
} 

var OUTLINE = [
  _o("Contents",null,6),
  _o("Preface",null,12),
  _o("On the Structure of Mathematics",null,18,[
    _o("Equivalence Problems",252.44918823242188,18),
    _o("The Study of Functions",146.17718505859375,20),
    _o("Equivalence Problems in Physics",387.2691955566406,20)
  ]),
  _o("Brief Summaries of Topics",null,22,[
    _o("0.1 Linear Algebra",161.20721435546875,22),
    _o("0.2 Real Analysis",341.79217529296875,22),
    _o("0.3 Differentiating Vector-Valued Functions",431.7201843261719,22),
    _o("0.4 Point Set Topology",573.4610595703125,22),
    _o("0.5 Classical Stokes\u2019 Theorems",114.67718505859375,23),
    _o("0.6 Differential Forms and Stokes\u2019 Theorem",254.6541748046875,23),
    _o("0.7 Curvature for Curves and Surfaces",446.4351806640625,23),
    _o("0.8 Geometry",547.5592041015625,23),
    _o("0.9 Countability and the Axiom of Choice",128.1231689453125,24),
    _o("0.10 Elementary Number Theory",229.7421875,24),
    _o("0.11 Algebra",331.3611755371094,24),
    _o("0.12 Algebraic Number Theory",484.7931823730469,24),
    _o("0.13 Complex Analysis",573.4610595703125,24),
    _o("0.14 Analytic Number Theory",573.4610595703125,25),
    _o("0.15 Lebesgue Integration",53.2520751953125,26),
    _o("0.16 Fourier Analysis",142.9461669921875,26),
    _o("0.17 Differential Equations",245.58218383789062,26),
    _o("0.18 Combinatorics and Probability Theory",400.0221862792969,26),
    _o("0.19 Algorithms",53.2520751953125,27),
    _o("0.20 Category Theory",177.98321533203125,27)
  ]),
  _o("Chapter 1: Linear Algebra",null,28,[
    _o("1.1 Introduction",255.50918579101562,28),
    _o("1.2 The Basic Vector Space Rn",556.59521484375,28),
    _o("1.3 Vector Spaces and Linear Transformations",118.3670654296875,31),
    _o("1.4 Bases, Dimension, and Linear Transformations as Matrices",250.17218017578125,33),
    _o("1.5 The Determinant",53.2520751953125,36),
    _o("1.6 The Key Theorem of Linear Algebra",280.6101989746094,39),
    _o("1.7 Similar Matrices",341.5581970214844,40),
    _o("1.8 Eigenvalues and Eigenvectors",157.95819091796875,42),
    _o("1.9 Dual Vector Spaces",573.4610595703125,46),
    _o("1.10 Books",573.4610595703125,47),
    _o("Exercises",284.21917724609375,48)
  ]),
  _o("Chapter 2: \u03f5 and \u03b4 Real Analysis",null,50,[
    _o("2.1 Limits",460.75421142578125,50),
    _o("2.2 Continuity",60.57818603515625,52),
    _o("2.3 Differentiation",291.40118408203125,53),
    _o("2.4 Integration",405.836181640625,55),
    _o("2.5 The Fundamental Theorem of Calculus",479.15020751953125,58),
    _o("2.6 Pointwise Convergence of Functions",53.2520751953125,62),
    _o("2.7 Uniform Convergence",461.033203125,63),
    _o("2.8 The Weierstrass M-Test",53.2520751953125,66),
    _o("2.9 Weierstrass\u2019 Example",369.85418701171875,67),
    _o("2.10 Books",469.8440856933594,70),
    _o("Exercises",128.7982177734375,71)
  ]),
  _o("Chapter 3: Calculus for Vector-Valued Functions",null,73,[
    _o("3.1 Vector-Valued Functions",242.1531982421875,73),
    _o("3.2 Limits and Continuity of Vector-Valued Functions",395.79217529296875,74),
    _o("3.3 Differentiation and Jacobians",482.7951965332031,75),
    _o("3.4 The Inverse Function Theorem",134.36920166015625,79),
    _o("3.5 The Implicit Function Theorem",261.4311828613281,81),
    _o("3.6 Books",495.7461853027344,85),
    _o("Exercises",58.670166015625,86)
  ]),
  _o("Chapter 4: Point Set Topology",null,88,[
    _o("4.1 Basic Definitions",385.1091003417969,88),
    _o("4.2 The Standard Topology on Rn",531.4671630859375,90),
    _o("4.3 Metric Spaces",449.4772033691406,97),
    _o("4.4 Bases for Topologies",405.0981750488281,98),
    _o("4.5 Zariski Topology of Commutative Rings",547.5592041015625,99),
    _o("4.6 Books",405.0892028808594,102),
    _o("Exercises",258.18218994140625,103)
  ]),
  _o("Chapter 5: Classical Stokes\u2019 Theorems",null,105,[
    _o("5.1 Preliminaries about Vector Calculus",53.2520751953125,106,[
      _o("5.1.1 Vector Fields",154.26922607421875,106),
      _o("5.1.2 Manifolds and Boundaries",594.9541015625,107),
      _o("5.1.3 Path Integrals",351.0722351074219,111),
      _o("5.1.4 Surface Integrals",341.8922424316406,115),
      _o("5.1.5 The Gradient",163.395263671875,117),
      _o("5.1.6 The Divergence",422.45123291015625,117),
      _o("5.1.7 The Curl",191.38525390625,118),
      _o("5.1.8 Orientability",54.4862060546875,119)
    ]),
    _o("5.2 The Divergence Theorem and Stokes\u2019 Theorem",449.0901794433594,119),
    _o("5.3 A Physical Interpretation of the Divergence Theorem",534.59912109375,121),
    _o("5.4 A Physical Interpretation of Stokes\u2019 Theorem",53.2520751953125,123),
    _o("5.5 Sketch of a Proof of the Divergence Theorem",144.2691650390625,124),
    _o("5.6 Sketch of a Proof of Stokes\u2019 Theorem",53.2520751953125,129),
    _o("5.7 Books",188.95416259765625,132),
    _o("Exercises",342.91717529296875,132)
  ]),
  _o("Chapter 6: Differential Forms and Stokes\u2019 Theorem",null,134,[
    _o("6.1 Volumes of Parallelepipeds",463.69720458984375,134),
    _o("6.2 Differential Forms and the Exterior Derivative",168.2271728515625,138,[
      _o("6.2.1 Elementary k-Forms",326.376220703125,138),
      _o("6.2.2 The Vector Space of k-Forms",270.24322509765625,141),
      _o("6.2.3 Rules for Manipulating k-Forms",252.15322875976562,142),
      _o("6.2.4 Differential k-Forms and the Exterior Derivative",118.8812255859375,145)
    ]),
    _o("6.3 Differential Forms and Vector Fields",249.5601806640625,147),
    _o("6.4 Manifolds",404.7471923828125,149),
    _o("6.5 Tangent Spaces and Orientations",202.36419677734375,155,[
      _o("6.5.1 Tangent Spaces for Implicit and Parametric Manifolds",330.9481506347656,155),
      _o("6.5.2 Tangent Spaces for Abstract Manifolds",440.40625,156),
      _o("6.5.3 Orientation of a Vector Space",556.1012573242188,157),
      _o("6.5.4 Orientation of a Manifold and Its Boundary",530.19921875,158)
    ]),
    _o("6.6 Integration on Manifolds",53.2520751953125,160),
    _o("6.7 Stokes\u2019 Theorem",347.05718994140625,162),
    _o("6.8 Books",170.378173828125,165),
    _o("Exercises",415.1331787109375,165)
  ]),
  _o("Chapter 7: Curvature for Curves and Surfaces",null,168,[
    _o("7.1 Plane Curves",441.7371826171875,168),
    _o("7.2 Space Curves",106.63116455078125,171),
    _o("7.3 Surfaces",332.51318359375,175),
    _o("7.4 The Gauss\u2013Bonnet Theorem",53.2520751953125,180),
    _o("7.5 Books",53.2520751953125,181),
    _o("Exercises",323.9091796875,181)
  ]),
  _o("Chapter 8: Geometry",null,183,[
    _o("8.1 Euclidean Geometry",528.128173828125,183),
    _o("8.2 Hyperbolic Geometry",357.1371765136719,185),
    _o("8.3 Elliptic Geometry",53.2520751953125,188),
    _o("8.4 Curvature",241.94619750976562,189),
    _o("8.5 Books",183.31121826171875,190),
    _o("Exercises",415.1152038574219,190)
  ]),
  _o("Chapter 9: Countability and the Axiom of Choice",null,192,[
    _o("9.1 Countability",345.6171875,192),
    _o("9.2 Naive Set Theory and Paradoxes",327.3831787109375,196),
    _o("9.3 The Axiom of Choice",169.919189453125,198),
    _o("9.4 Non-measurable Sets",53.2520751953125,199),
    _o("9.5 G\u00f6del and Independence Proofs",560.5101928710938,200),
    _o("9.6 Books",366.2361755371094,201),
    _o("Exercises",58.670166015625,202)
  ]),
  _o("Chapter 10: Elementary Number Theory",null,203,[
    _o("10.1 Types of Numbers",60.57818603515625,204),
    _o("10.2 Prime Numbers",434.04217529296875,206),
    _o("10.3 The Division Algorithm and the Euclidean Algorithm",318.8871765136719,208),
    _o("10.4 Modular Arithmetic",127.91619873046875,210),
    _o("10.5 Diophantine Equations",573.4610595703125,210),
    _o("10.6 Pythagorean Triples",120.7520751953125,212),
    _o("10.7 Continued Fractions",192.0860595703125,214),
    _o("10.8 Books",184.9132080078125,217),
    _o("Exercises",336.023193359375,218)
  ]),
  _o("Chapter 11: Algebra",null,219,[
    _o("11.1 Groups",416.09619140625,219),
    _o("11.2 Representation Theory",164.07818603515625,225),
    _o("11.3 Rings",291.1941833496094,227),
    _o("11.4 Fields and Galois Theory",212.6331787109375,229),
    _o("11.5 Books",350.69317626953125,234),
    _o("Exercises",219.4552001953125,235)
  ]),
  _o("Chapter 12: Algebraic Number Theory",null,237,[
    _o("12.1 Algebraic Number Fields",246.09518432617188,237),
    _o("12.2 Algebraic Integers",429.04718017578125,238),
    _o("12.3 Units",294.8302001953125,240),
    _o("12.4 Primes and Problems with Unique Factorization",286.1360778808594,241),
    _o("12.5 Books",223.54119873046875,242),
    _o("Exercises",442.3941955566406,242)
  ]),
  _o("Chapter 13: Complex Analysis",null,243,[
    _o("13.1 Analyticity as a Limit",446.4441833496094,244),
    _o("13.2 Cauchy\u2013Riemann Equations",383.732177734375,246),
    _o("13.3 Integral Representations of Functions",53.2520751953125,251),
    _o("13.4 Analytic Functions as Power Series",53.2520751953125,259),
    _o("13.5 Conformal Maps",477.5391845703125,262),
    _o("13.6 The Riemann Mapping Theorem",381.5091857910156,265),
    _o("13.7 Several Complex Variables: Hartog\u2019s Theorem",217.9342041015625,267),
    _o("13.8 Books",560.5101928710938,268),
    _o("Exercises",320.6871032714844,269)
  ]),
  _o("Chapter 14: Analytic Number Theory",null,272,[
    _o("14.1 The Riemann Zeta Function",356.75018310546875,272),
    _o("14.2 Riemann\u2019s Insight",495.7461853027344,274),
    _o("14.3 The Gamma Function",263.41119384765625,275),
    _o("14.4 The Functional Equation: A Hidden Symmetry",377.3421936035156,276),
    _o("14.5 Linking \u03c0(x) with the Zeros of \u03b6(s)",315.8631896972656,277),
    _o("14.6 Books",297.59320068359375,280),
    _o("Exercises",188.05319213867188,281)
  ]),
  _o("Chapter 15: Lebesgue Integration",null,282,[
    _o("15.1 Lebesgue Measure",426.9141845703125,282),
    _o("15.2 The Cantor Set",274.5531921386719,285),
    _o("15.3 Lebesgue Integration",345.5451965332031,287),
    _o("15.4 Convergence Theorems",177.13720703125,290),
    _o("15.5 Books",573.4610595703125,291),
    _o("Exercises",154.7000732421875,292)
  ]),
  _o("Chapter 16: Fourier Analysis",null,293,[
    _o("16.1 Waves, Periodic Functions and Trigonometry",241.5592041015625,293),
    _o("16.2 Fourier Series",304.76617431640625,294),
    _o("16.3 Convergence Issues",257.0391845703125,300),
    _o("16.4 Fourier Integrals and Transforms",465.72216796875,302),
    _o("16.5 Solving Differential Equations",466.8201904296875,305),
    _o("16.6 Books",53.2520751953125,308),
    _o("Exercises",272.1051940917969,308)
  ]),
  _o("Chapter 17: Differential Equations",null,309,[
    _o("17.1 Basics",228.05020141601562,309),
    _o("17.2 Ordinary Differential Equations",482.7951965332031,310),
    _o("17.3 The Laplacian",53.2520751953125,314,[
      _o("17.3.1 Mean Value Principle",81.4322509765625,314),
      _o("17.3.2 Separation of Variables",404.68524169921875,315),
      _o("17.3.3 Applications to Complex Analysis",54.4862060546875,318)
    ]),
    _o("17.4 The Heat Equation",433.6551818847656,318),
    _o("17.5 The Wave Equation",180.8720703125,321,[
      _o("17.5.1 Derivation",209.04324340820312,321),
      _o("17.5.2 Change of Variables",54.4862060546875,325)
    ]),
    _o("17.6 The Failure of Solutions: Integrability Conditions",145.3941650390625,327),
    _o("17.7 Lewy\u2019s Example",328.67919921875,329),
    _o("17.8 Books",144.2691650390625,330),
    _o("Exercises",297.69219970703125,330)
  ]),
  _o("Chapter 18: Combinatorics and Probability Theory",null,331,[
    _o("18.1 Counting",388.25018310546875,331),
    _o("18.2 Basic Probability Theory",223.30718994140625,333),
    _o("18.3 Independence",399.0141906738281,335),
    _o("18.4 Expected Values and Variance",449.0632019042969,336),
    _o("18.5 Central Limit Theorem",573.4610595703125,339),
    _o("18.6 Stirling\u2019s Approximation for n!",403.9461975097656,346),
    _o("18.7 Books",573.4610595703125,351),
    _o("Exercises",258.3081970214844,352)
  ]),
  _o("Chapter 19: Algorithms",null,354,[
    _o("19.1 Algorithms and Complexity",560.5101928710938,354),
    _o("19.2 Graphs: Euler and Hamiltonian Circuits",407.0691833496094,355),
    _o("19.3 Sorting and Trees",391.3101806640625,359),
    _o("19.4 P=NP?",118.43017578125,363),
    _o("19.5 Numerical Analysis: Newton\u2019s Method",114.34417724609375,364),
    _o("19.6 Books",157.7152099609375,370),
    _o("Exercises",480.17620849609375,370)
  ]),
  _o("Chapter 20: Category Theory",null,372,[
    _o("20.1 The Basic Definitions",241.55020141601562,372),
    _o("20.2 Examples",53.2520751953125,374),
    _o("20.3 Functors",275.4621887207031,374,[
      _o("20.3.1 Link with Equivalence Problems",303.63323974609375,374),
      _o("20.3.2 Definition of Functor",180.21624755859375,375),
      _o("20.3.3 Examples of Functors",357.3452453613281,376)
    ]),
    _o("20.4 Natural Transformations",118.3670654296875,377),
    _o("20.5 Adjoints",305.7742004394531,379),
    _o("20.6 \u201cThere Exists\u201d and \u201cFor All\u201d as Adjoints",53.2520751953125,383),
    _o("20.7 Yoneda Lemma",521.6480712890625,384),
    _o("20.8 Arrow, Arrows, Arrows Everywhere",556.91015625,389),
    _o("20.9 Books",288.5301818847656,390),
    _o("Exercises",58.670166015625,391)
  ]),
  _o("Appendix: Equivalence Relations",null,392,[
    _o("Exercises",58.670166015625,393)
  ]),
  _o("Bibliography",null,394),
  _o("Index",null,402)
]; 

var outlineRoot = pw.createOutlineRoot();
outlineRoot.pushChildren(OUTLINE); 

pw.setOutlineRoot(outlineRoot); 


var pageCover = pw.makePageFromImageFileAndBounds(
  sourceCoverLocation,
  pw.pageAt(0).bounds()); 

pw.insertPage(pageCover,0);


pw.unsafeSaveAs(SAVE_PATH); 

print('\n--saved{'+SAVE_PATH+'}\n');
    
