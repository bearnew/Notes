## pnpm
1. pnpm init创建1个项目
2. workspaces，安装项目的时候就会创建软链
    - `npm`和`yarn`在`package.json`中配置`workspaces`
    - `pnpm`在`pnpm-workspace.yaml`中配置
## lerna
1. Monorepo的方式来管理多个包
2. Lerna提供了一些命令行工具，例如创建、删除、添加依赖、执行脚本等，以及一些管理包的功能，例如自动版本升级、自动生成Changelog等
```js
lerna --help
```
```js
lerna init：初始化lerna项目。

lerna create <package-name>：创建新的包。

lerna add <package>[@version] [--dev] [--exact]：为指定包添加依赖项。

lerna bootstrap：安装所有包的依赖关系并链接相互依赖的包。

lerna clean：删除各个包下的node_modules目录。

lerna run <script>：在所有包中运行npm脚本。

lerna ls：列出所有包的名称和当前版本。

lerna changed：列出最近改变的包。

lerna diff [package?] [from] [to]：比较两个版本之间的差异。

lerna exec <command>：在每个包中执行任意命令。

lerna import <path-to-external-repository>：将现有的包导入到lerna仓库中。

lerna publish：发布更新的包到npm。
```
## changeset
1. 管理版本号：Changeset可以自动为每个包生成下一个版本号，并且将其写入到每个包的package.json文件中。这样可以避免手动修改版本号所带来的风险。

2. 生成Changelog：Changeset可以将各个包的变化记录在一起，并且生成Changelog文件。这有助于向用户展示项目的更新内容，提高用户体验。

3. 管理依赖关系：Changeset可以根据每个包的变化，自动更新其它依赖该包的包的依赖关系。这有助于保持整个项目的稳定性和一致性。
```js
// 确定changset文件
npx changeset
// 提交更改

// 生成changelog
npx changeset version
```

## 软链和硬链
1. 软链接`soft link`文件存放的是路径名的指向
- 硬盘存储有1个inode号，唯一标识，软链的inode号不同
- `ls -i`查看`inode`号，软链的`inode`号是不同
- 解决幽灵依赖问题，项目中引用幽灵依赖，如果package.json中的主包移除，会报错
- 本地包调试开发
- `npm link`也是软链
```js
ll node_modules/@myPackage
```
2. 硬链`symbolic link`
- 硬盘存储有1个inode号，唯一标识，存储文件在磁盘中的信息，硬链的inode号相同，修改内容影响全局
- 性能比软链更好，软链需要解析路径，硬链直接指向物理地址
- 直接依赖使用软链，子依赖使用硬链，子依赖是变化的，硬链避免相互之间影响
- 稳定性比软链更好，源文件被删除，软链失效，硬链删除了其中1个文件，其他文件依然有效
- 
- `stat -s node_modules/.pnpm/react@16.14.0`查看`st_nlink=3`
