function *foo() {
    console.log( "inside *foo():", yield "B" );
    console.log( "inside *foo():", yield "C" );
    return "D";
}
function *bar() { 
    console.log( "inside *bar():", yield "A" );
    // yield委托！
    console.log( "inside *bar():", yield *foo() );
    console.log( "inside *bar():", yield "E" );
    return "F";
}

var it = bar();
console.log( "outside:", it.next().value );
// outside: A
console.log( "outside:", it.next( 1 ).value );
// inside *bar(): 1
// outside: B
console.log( "outside:", it.next( 2 ).value );
// inside *foo(): 2
// outside: C
console.log( "outside:", it.next( 3 ).value );
// inside *foo(): 3
// inside *bar(): D
// outside: E
console.log( "outside:", it.next( 4 ).value );
// inside *bar(): 4
// outside: F 