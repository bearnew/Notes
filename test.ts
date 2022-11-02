let uncertain: any = 'Hello world'!;
uncertain = 5;
uncertain = { hello: () => 'Hello world!' };

// any不会做任何类型检测
const uncertain1: any = 'Hello world!';
uncertain1.hello();


let uncertain2: unknown = 'Hello'!;
uncertain2 = 12;
uncertain2 = { hello: () => 'Hello!' };

// 只能将unknown类型变量赋值给unknown和any
let notSure: unknown = uncertain2;
let notSure2: any = uncertain;


function getDog() {
    return '22'
}

// unknown会进行类型推断
const dog: unknown = getDog();
dog.hello(); // Object is of type 'unknown'

const dog1: any = getDog();
dog1.hello();


const getDogName = () => {
    let x: unknown;
    return x;
};

// 类型收缩-typeof
const dogName = getDogName();
if (typeof dogName === 'string') {
    console.log(dogName.toLowerCase());
}

// 类型收缩-instanceof
class Dog {
    name: string
};

const getAnimal = () => {
    return {
        name: 'animal'
    }
}

const dog2 = getAnimal();
 
if (dog instanceof Dog) {
    console.log(dog.name.toLowerCase());
}