# peerDependencies

1. `Node`只会在`MyProject/node_modules`目录下查找模块，不会在`packageA`的`node_modules`下再查找`packageB`
2. `packageA`的`peerDependencies`中存在`packageB`，则`MyProject`中可直接引用`packageB`

```js
// packageA的package.json
{
    "peerDependencies": {
        "PackageB": "1.0.0"
    }
}

// MyProject安装packageA后，目录结构如下
|-node_modules
    |-PackageA
    |-PackageB
```

3. peerDependencies 主要解决安装的`npm`包版本不一致问题
4. `npm7.0+`版本的才会自动安装`peerDependencies`