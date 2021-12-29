# webpack 动态加载原理

1. 将动态加载的模块注册到`modules`中

```js
// 调用了  __webpack_require__.e
__webpack_require__
  .e("dynamic")
  .then(__webpack_require__.bind(null, "./src/dynamic.js"))
  .then((dynamic) => {
    dynamic();
  });
```

2. webpack_require.e 的实现

```js
// 主要作用:
// 创建一个 script 标签去动态加载个 chunk js
// 返回一个 Promise， 标示这个动态 chunk js 的加载状态
// 设置 installedChunks = [resolve, reject, promise]
// 这里 Promise 会在 动态 js 加载执行完毕后，才会变成 resolve 状态
__webpack_require__.e = function requireEnsure(chunkId) {
  var promises = [];
  // installedChunks 保存了所有 chunk 的加载状态
  var installedChunkData = installedChunks[chunkId];
  if (installedChunkData !== 0) {
    // 如果在 installedChunks 已存在，但是不为 0 ，表示正在加载中
    if (installedChunkData) {
      promises.push(installedChunkData[2]);
    } else {
      // 定义一个 Promise 标示加载状态
      // installedChunks = [resolve, reject, promise]
      var promise = new Promise(function (resolve, reject) {
        installedChunkData = installedChunks[chunkId] = [resolve, reject];
      });
      promises.push((installedChunkData[2] = promise));

      // 下面就是创建一个 script 去加载，省略...
      // start chunk loading
    }
  }
  return Promise.all(promises);
};
```

3. 调用全局的`jsonp`方法

```js
// 调用了一个全局的 jsonp 数组的 push
(window["jsonp"] = window["jsonp"] || []).push([
  ["dynamic"],
  {
    "./src/dynamic.js": function (
      module,
      __webpack_exports__,
      __webpack_require__
    ) {
      // 省略
    },
  },
]);
```

4. 将`chunk`注入到`modules`中

```js
var jsonpArray = (window["jsonp"] = window["jsonp"] || []);
var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
// 挟持了 push 方法，动态加载的 js，调用的是下面的 webpackJsonpCallback 方法
jsonpArray.push = webpackJsonpCallback;
jsonpArray = jsonpArray.slice();
for (var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
var parentJsonpFunction = oldJsonpFunction;

function webpackJsonpCallback(data) {
  var chunkIds = data[0];
  var moreModules = data[1];

  var moduleId,
    chunkId,
    i = 0,
    resolves = [];
  for (; i < chunkIds.length; i++) {
    chunkId = chunkIds[i];
    if (
      Object.prototype.hasOwnProperty.call(installedChunks, chunkId) &&
      installedChunks[chunkId]
    ) {
      // Promise 的 resolve
      resolves.push(installedChunks[chunkId][0]);
    }
    // 标示该 chunk 已经加载过了
    installedChunks[chunkId] = 0;
  }
  for (moduleId in moreModules) {
    if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
      // 将 chunk 注册到 modules 中
      modules[moduleId] = moreModules[moduleId];
    }
  }
  if (parentJsonpFunction) parentJsonpFunction(data);

  while (resolves.length) {
    // 执行 将 __webpack_require__.e 的 Promise 置为 resolve
    resolves.shift()();
  }
}
```

5. `webpack output.jsonpFunction`
   - `jsonp` 这个数组变量的名字 当你的应用存在多个 `webpack` 打包的 js 文件在运行时（例如微前端场景），如果这个数组变量名称一致，那么在动态加载 `chunk` 的时候，就会出现错乱
6. `webpack5`使用`output.chunkLoadingGlobal`代替`output.jsonpFunction`
