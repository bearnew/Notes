function foo() {
  var temp_object = new Object();
  temp_object.x = 1;
  temp_object.y = 2;
  temp_object.array = new Array(200000);
  /** * 使用temp_object */
  return function () {
    console.log(temp_object.x);
  };
}
