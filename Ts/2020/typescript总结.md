# Typescript总结

## 1.可选属性和只读属性

```ts
interface Config {
    color?: string;
    readonly x: number;
}

let a: ReadonlyArray<number> = [1, 2, 3, 4];
let b = a as number[]; // 类型断言赋值回去
```

## 2.额外属性检查

```ts
interface SquareConfig {
    color?: string;
    [propName: string]: any; // 非color，可以设置任意类型的属性
}
```

## 3.函数类型

```ts
interface SearchFunc {
    (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(src: string, sub: string): boolean {
    let result = src.search(sub);
    return result > -1;
} 
```

## 4.索引类型

```ts
interface ReadonlyStringArray {
    readonly [index: number]: string;
}

let myArray: ReadonlyStringArray = ['Alice', 'Bob'];
myArray[2] = 'Mallory'; // error, 只读
```

## 5.类类型

```ts
// 实例接口
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date)
}

class Clock implements ClockInterface {
    currentTime: Date;

    constructor(h: number, m: number) {}

    setTime(d: Date) {
        this.currentTime = d;
    }
}
```

## 6.继承接口

```ts
interface Shape {
    color: string;
}

interface PenStroke {
    penWidth: number;
}

interface Square extends Shape, PenStroke {
    sideLength: number
}

let sqaure = {} as Square;
square.color = 'blue';
square.sideLength = 10;
square.penWidth = 5;
```

## 7.混合类型

```ts
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}

function getCounter(): Counter {
    let counter = (function (star: number) { }) as Counter;

    counter.interval = 123;
    counter.reset = function() {};

    return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

## 8.私有类型

```ts
// 默认是public
// private在派生类中可以访问
// protect在派生类中不能访问
class Person {
    protected name: string;
    constructor(name: string) {
        this.name = name;
    }
}

class Employee extends Person {
    private department: string;

    constructor(name: string, department: string) {
        super(name);
        this.department = department;
    }

    getElevatorPitch() {
        return `${this.name} work in ${this.department}`;
    }
}

let howard = new Employee(name: 'Howard', department: 'Sales');
console.log(howard.getElevatorPitch());
console.log(howrad.name); // error， 派生类无法使用protect属性
```

## 9.只读readonly属性

```ts
class Person {
    constructor(readonly name: string) {}
}

let john = new Person(name: 'John');
john.name = ''; // error, readonly只读
```

## 10.存取器

```ts
class Employee {
    private _fullName: string;
    get fullName(): string {
        return this._fullName;
    }
    set fullName(newName: string) {
        this._fullName = newName;
    }
}
```

## 11.静态属性

```ts
class Grid {
    static origin = {x: 0; y: 0;}

    calculateDistanceFromOrigin(point: { x: number; y: number }) {
        const xDist = point.x - Grid.origin.x;
        const yDist = point.y - Grid.origin.y;

        return Math.sqrt(xDist + yDist);
    }
}
```

## 12.抽象类

```ts
// 抽象类不允许被实例化的
// 抽象方法必须在子例中实现
abstract class Department {
    name: string

    constructor(name: string) {
        this.name = name;
    }

    printName(): void {
        console.log('Department name' + this.name);
    }

    abstract printMeeting(): void;
}

class AccountingDepartment extends Department {
    constructor() {
        super('Accounting ad Auditing')
    }

    printMeeting(): void {
        console.log('The Accounting Department meets each Monday at 10am')
    }

    generateReports(): void {
        console.log('generating....')
    }
}

let department: Department;
department = new AccountingDepartment();
department.printName();
department.printMeeting();
department.generateReports(); //error, 类型Department中没有generateReports方法
```

## 13.高级技巧

```ts
class Greeter {
    static standardGreeting = 'Hello, there';
    greeting: string;
    constructor(message?: string) {
        this.greeting = message;
    }
    greet() {
        if (this.greeting) {
            return 'hello' + this.greeting;
        } else {
            return Greeter.standardGreeting;
        }
    }
}

let greeter: Greeter;
greeter = new Greeter();
console.log(greeter.greet());

let greeterMaker: typeof Greeter = Greeter;
greeterMaker.standardGreeting = 'Hey there';

let greeter2: Greeter = new greeterMaker();
console.log(greeter2.greet());
``` 