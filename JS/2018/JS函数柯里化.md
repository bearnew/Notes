## JS柯里化（实现函数不定参数）

### 常规写法
> 利用valueof toString类型转换
```js
function curry1(a) {
    var args = Array.prototype.slice.call(arguments);

    var fn = function(b) {
        args = args.concat(Array.prototype.slice.call(arguments));
        return fn;
    }

    fn.toString = fn.valueOf = function() {
        return args.reduce((a, b) => a + b);
    }

    return fn;
}
const test1 = curry1(2)(3)(4, 5);
console.log('test1', test1) // test1 ƒ 14
console.log(typeof test1) // function

```


### 高阶函数写法
```js
function curry2(fn) {
    var sum = 0;

    return function() {
        if (arguments.length !== 0) {
            var args = Array.prototype.slice.call(arguments);
            sum += fn(args);
            return arguments.callee;
        } else {
            return sum;
        }
    }
}

const sum = (arr) =>  arr.reduce((a, b) => a + b)

const test2 = curry2(sum)(2)(3)(4)()
console.log('test2', test2) // test2 9
console.log(typeof test2) // number

```

所以，我选高阶函数。。。
