function setName(obj) {
    obj.name = 'bear_new';
    obj = new Object();   // 此时给obj重新赋值新变量，将obj变成了局部对象，即使修改，原始的引用仍然保持未变，并且局部对象会在函数执行完后立即被销毁
    obj.name = 'Greg';
}

var person = new Object();
setName(person);    // 函数内的参数obj变化，函数外部的person也会发生改变，obj和person引用同一对象，指向的对象在堆内存中只有一个，而且是全局对象
alert(person.name);    // 'bear_new'