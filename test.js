// ES7
// 方法装饰器
// target-Car, 装饰的类
// key-drive, 修改的属性的名称
// descriptor, 被修改的属性描述符
// {
//   value: drive,
//   enumerable: false,
//   configurable: true,
//   writable: true
// };
function autopilotDecorator(target, key, descriptor) {
    console.log(target, key, descriptor)
    const method = descriptor.value;

    descriptor.value = () => {
        method.apply(target);
        console.log('start auto drive');
    }

    return descriptor;
}

class Car {
    @autopilotDecorator
    drive() {
        console.log('normal drive');
    }
}

let car = new Car();
// normal drive
// start auto drive
car.drive();