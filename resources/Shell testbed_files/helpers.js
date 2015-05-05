
// Strings:
// 
// Repeats a string.
// 
// eg: alert( "string to repeat\n".repeat( 4 ) );
// 
String.prototype.repeat = function( num )
{
    return new Array( num + 1 ).join( this );
}


Array.prototype.repeat= function(what, L){
	 while(L) {
	 	this.push(what);
	 	L--;
	 }
 	return this;
}


Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

