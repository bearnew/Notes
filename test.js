var o = {
  a: 10,
  b:  {
      fn: function(){
          console.log(this.a); // undefined
          console.log(this);   // b对象
      }
  }
}
//调用
o.b.fn(); 