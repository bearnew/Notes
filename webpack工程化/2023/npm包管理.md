# npm 包实战总结

## 0.总结

- 最佳实践：将项目必须依赖放入 peerDependencies，非必要依赖使用尽可能小的版本放入 dependencies 中
- `peerDependencies` 主要解决的问题
  - 安装的 npm 包版本不一致，让开发者自己决定版本
  - 通过`externals`排除在打包库文件之外的依赖，`peerDependencies`告诉用户，你使用我的库，还需要具备 `vue、react、angular` 等环境

## 1.包版本号

- **major.minor.patch-[prerelease/beta]**
- **major**: 主版本号，break change 的改动
- **minor**: 次版本号，新增 feature
- **patch**: 补丁版本号，bug fix
- **prerelease**: rc 版本，内测版本
- **beta**: beta 版本，公测版本

## 2.package.json 中的版本符号

- *: 主版本，破坏内容的大改版， *1.2.3 会匹配 x.x.x
- ^(default): 次版本，不破坏内容的新功能，^1.2.3 会匹配所有 1.x.x 的包
  - 主版本号非 0，^1.2.3 会匹配所有 1.x.x 的包
  - 主版本号为 0，^0.40.0 会匹配所有 0.40.x 的包（eg. xx/webpack-config、@xx/component-web）
- ~: 补丁，不破坏内容的错误修复，~1.2.3 会匹配所有 1.2.x 版本
- > =: 高于该版本，>=1.2.3 会匹配所有 高于等于 1.2.3 版本

## 3.package-lock.json 中的版本

1. npm 包的依赖，正常情况会平铺
2. 存在冲突的时候会进行嵌套

## 4.devDependencies

1. 项目`my-project`中安装`npm`包`A`，npm 包 A 中的`devDependencies`不会被安装

## 5.dependencies

1. npm 包中的 dependencies 会被进行安装
2. 多个包存在相同的`dependencies`，npm 会使用**依赖解析算法**来确定包版本
   1. 项目中存在该包的依赖，优先安装该版本到 node_modules 最外层目录(`semver`)
   2. 某个包依赖的是精准版本，优先安装该版本(`@babel/parser`)
   3. 多个包依赖同一范围的包，优先安装该版本

## 6.peerDependencies

3. `peerDependencies` 主要解决安装的`npm`包版本不一致问题
4. `npm7.0+`版本的才会自动安装`peerDependencies`
5. `npm7`之前的版本自动安装`peerDependencies`
   1. `npx npm-install-peers`，会自动安装项目`my-project`中的`peerDependencies`
      - 在`npm`包的根目录执行，会将`npm`包的`peerDependencies`全部重新装到`npm`包的`node_modules`下
   2. `npx install-peerdeps <packageA>`，会安装`packageA`中的所有`peerDependencies`
6. 将自动安装得`peerDependencies`的命令放到`npm install`的生命周期中即可
   - `preinstall`：在安装依赖项之前执行的脚本。
   - `install`：安装依赖项时执行的脚本。
   - `postinstall`(一般使用 postinstall)：安装依赖项后执行的脚本。
   - `preuninstall`：在卸载依赖项之前执行的脚本。
   - `uninstall`：卸载依赖项时执行的脚本。
   - `postuninstall`：卸载依赖项后执行的脚本。

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

```js
"peerDependencies": {
    "react": ">=16.0.0"
}
```

## 7.resolutions

- 项目的子依赖（依赖的依赖）需要紧急安全更新，来不及等待直接依赖更新。
- 在 package.json 文件里添加 resolutions 字段，用于覆盖版本定义：

```js
"dependencies": {
    "qs": "^6.11.2",
},
"devdependencies": {
    "force-resolutions": "^1.0.11",
},
"resolutions": {
    "qs": "^6.11.2"
},
```

- 强制修改 package-lock.json 中的子依赖版本，但是依赖树还是不会变化

```js
"scripts": {
    "preinstall": "npx force-resolutions"
}
```

## 8.overrides

- 安装包的时候强制覆盖包版本，并且会修改`npm ls`依赖树

```js
"overrides": {
    "qs": "6.11.2"
},
```
