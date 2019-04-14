function Foo(name) {
  this.name = name;
}

Foo.prototype.myName = function() {
  console.log('1111')
  return this.name;
}

function Bar(name, label) {
  Foo.call(this, name);
  this.label = label;
}

// Bar.prototype = Object.create(Foo.prototype);
Bar.prototype = Foo.prototype

console.log(Bar.prototype)

var a = new Bar('xx', 'shaun');

console.log(a.name)
console.log(a.myName())