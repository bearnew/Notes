function test() {
  var a = 0;
  while (1) {
      switch (a) {
          case 0:
              console.log(this);
              break;
      }
  }
}
test();