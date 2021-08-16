# 浏览器是如何支持 require 和 import 的

> https://segmentfault.com/a/1190000023078400

1. 浏览器默认是不支持`import`和`require`的
2. `babel`对`require`不会进行处理
3. `babel`通过`@babel/preset-env`将`import`转换成`commonjs`规范
4. `webpack`通过 babel-loader(`@babel/core`)将`commonjs`处理成支持浏览器环境的
