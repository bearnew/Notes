## 惰性函数

``` js
function lazy(type) {
    console.log('lazy function')

    if (type === 1) {
        console.log('1111')
        lazy = () => {
            console.log('one one one')
        }
    }

    if(type === 2) {
        console.log('2222')
        lazy = () => {
            console.log('two two two')
        }
    }

    return lazy(type);
}

lazy(2)
console.log('-------')
lazy(2)
```
__打印结果__:

lazy function

2222

two two two

```-------```

two two two

__优点__:
多次调用，判断条件只执行一次，提升代码效率

__缺点__:
不适用于判断条件可变的函数调用