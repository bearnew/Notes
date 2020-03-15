class A {
    static test() {
        console.log(1);
    }
}

class B extends A {
    a() {
        console.log(2222)
    }
}

var b = new B();
b.a()
B.test();
