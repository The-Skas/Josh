
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

