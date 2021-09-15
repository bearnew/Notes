var Obj = {
  toString() {
    return new Object();
  },
  valueOf() {
    return new Object();
  },
};

// Uncaught TypeError: Cannot convert object to primitive value
console.log(Obj + 3);
