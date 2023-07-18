# webpack 联邦模块

> https://mp.weixin.qq.com/s/8vfTp-FZbYNk2k8gCIGc8w

## 1.怎么使用联邦模块

1. `Domain`
2. `Widget`
3. `Hybrid`(同时使用`Domain`和`Widget`)

## 2.实战配置

```js
const remoteVersion = pkg.version;
const shared = require('./shared');

new ModuleFederationPlugin({
    name: '__remoteEntry',
    filename: `assets/js/__remoteEntry/${remoteVersion}.js`,
    exposes: {
        './index': './lib/index',
    },
    shared
}),
```

```js
// shared.js
module.exports = [
  "react",
  "react-dom",
  "mobx",
  "mobx-react",
  "react-i18next",
  "i18next",
].reduce((obj, key) => {
  obj[key] = {
    shareKey: key,
    singleton: true,
    import: false,
    // eager: true,
    version: pkgLock.dependencies[key].version,
    requiredVersion: pkg.dependencies[key],
  };
  return obj;
}, {});
```

## 3.shared

1. 使用 版本号完全相同 的依赖才能被复用
2. `lodash`添加`shared`后，并且版本号相同，则只会使用宿主页面的`lodash`，版本号不同则对加载多份
