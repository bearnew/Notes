function test(a, b = 1) {
    arguments[0] = 20;
    console.log(a);            // 123
  }
  console.log(test.length);    // 1
  
  test(123); // 123