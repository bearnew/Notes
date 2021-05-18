# js 获取调用栈

1. `console.trace`
2. 使用`arguments.callee.caller`获取

```js
function test() {
  var stack = [],
    caller = arguments.callee.caller;

  while (caller) {
    stack.unshift(String(caller));
    caller = caller && caller.caller;
  }

  // 111111 null function a() {
  //     b();
  // },function b() {
  //     test();
  // }
  console.log("111111", caller, stack.join(","));
}

function b() {
  test();
}

function a() {
  b();
}

a();
```
