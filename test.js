var p = Promise.resolve( 21 );
// 分叉1（来自p）
p.then( function(msg){
return msg * 2;
} )
.then( function(msg){
console.log( msg ); // 42
} )
// 分叉2 （来自p）
p.then( function(msg){
console.log( msg ); // 21
}); 