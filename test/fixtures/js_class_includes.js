Class.include("a.b.c");
Class.include('d.e.f'); // Single quotes


Class.include(
  "a.b.c", // Double quotes
  "d.e.f",
//"SKIP.THIS.CLASS",    // Commented out
  "g.h.i", /* Block comment*/
/*
  Block comment out 
  'SKIP.THIS.CLASS', //
  // "SKIP.THIS.CLASS"
*/  
  "j.k.l",
  /* double block */
  /* double block */ 
  "m.n.o",
  /**
   * Doc comments
   */
  "p.q.r", /* "SKIP.THIS.CLASS", */ "s.t.u",
  "v.w.x"
);

Class
  .include ( 'x.y.z' ) ;

Class.include(
  "d.e.f"
);


/*
 * Do not include these:
 */

doNotInclude();
Class.Inlcude("do.not.include");
