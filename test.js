function Foo() {
    this.x = 'x';
}

Foo.prototype.y = 'y';

var f = new Foo();
console.log(f)
