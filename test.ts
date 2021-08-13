function Book1(name) {
  this.name = name;
  return 1;
}
console.log(new Book1("Life")); // 打印 Book1 {name: "Life"}
function Book2(name) {
  this.name = name;
  return [];
}
console.log(new Book2("Life")); // 打印 []
