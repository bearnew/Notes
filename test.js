var sq = ASQ( function(done){
    setTimeout( function(){ 
        done( "Hello World" );
 }, 200 );
} ); 

ASQ( function(done){
    setTimeout( done, 100 );
} )
   // 将sq序列纳入这个序列
   .seq( sq )
   .val( function(msg){
    console.log( msg ); // Hello World
} ) 