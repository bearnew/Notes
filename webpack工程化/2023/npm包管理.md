# npm包实战总结

## 1.包版本号

- __major.minor.patch-[prerelease/beta]__
- __major__: 主版本号，break change的改动
- __minor__: 次版本号，新增feature
- __patch__: 补丁版本号，bug fix
- __prerelease__: rc版本，内测版本
- __beta__: beta版本，公测版本

## 2.package.json中的版本符号

- *: 主版本，破坏内容的大改版， *1.2.3 会匹配 x.x.x
- ^(default): 次版本，不破坏内容的新功能，^1.2.3 会匹配所有 1.x.x 的包
- ~: 补丁，不破坏内容的错误修复，~1.2.3 会匹配所有 1.2.x 版本

## 3.package-lock.json中的版本

1. npm包的依赖，正常情况会平铺
2. 存在冲突的时候会进行嵌套

## 4.devDependencies

1. 项目`my-project`中安装`npm`包`A`，npm包A中的`devDependencies`不会被安装

## 5.dependencies

1. npm包中的dependencies会被进行安装
2. 多个包存在相同的`dependencies`，npm会使用__依赖解析算法__来确定包版本
    1. 项目中存在该包的依赖，优先安装该版本到node_modules最外层目录(`semver`)
    2. 某个包依赖的是精准版本，优先安装该版本(`@babel/parser`)
    3. 多个包依赖同一范围的包，优先安装该版本

## 6.peerDependencies

3. `peerDependencies` 主要解决安装的`npm`包版本不一致问题
4. `npm7.0+`版本的才会自动安装`peerDependencies`
5. `npm7`之前的版本自动安装`peerDependencies`
    1. `npx npm-install-peers`，会自动安装项目`my-project`中的`peerDependencies`
    2. `npx install-peerdeps <packageA>`，会安装`packageA`中的所有`peerDependencies`
6. 将自动安装得`peerDependencies`的命令放到`npm install`的生命周期中即可
    - `preinstall`：在安装依赖项之前执行的脚本。
    - `install`：安装依赖项时执行的脚本。
    - `postinstall`(一般使用postinstall)：安装依赖项后执行的脚本。
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
