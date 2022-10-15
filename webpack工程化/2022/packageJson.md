# package.json

1. 版本号`major.minor.patch`
    - ~: 补丁，不破坏内容的错误修复，~1.2.3 会匹配所有 1.2.x 版本
    - ^: 次版本，不破坏内容的新功能，^1.2.3 会匹配所有 1.x.x 的包
    - *: 主版本，破坏内容的大改版， *1.2.3 会匹配 x.x.x
2. package-lock 的更新逻辑

-   手动升级 A 的时候，会对依赖的 B 更新成 1.x.x 的最新版本

```js
// package lock-test
{ "name": "lock-test", "dependencies": { "A": "^1.0.0" }}
// package A
{ "name": "A", "version": "1.0.0", "dependencies": { "B": "^1.0.0" }}
// package B
{ "name": "B", "version": "1.0.0", "dependencies": { "C": "^1.0.0" }}
// package C
{ "name": "C", "version": "1.0.0" }
```

```js
// package-lock.json
{
    "name": "lock-test",
    "version": "1.0.0",
    "dependencies": {
        "A": { "version": "1.0.0" },
        "B": { "version": "1.0.0" },
        "C": { "version": "1.0.0" }
    }
}
```

3. 版本冲突，`package-lock`会变成嵌套的形式

```js
{ "dependencies": { "A": "^1.1.0", "B": "^2.0.0" }}
```

```js
{
    "name": "lock-test",
    "version": "1.0.0",
    "dependencies": {
        "A": {
            "version": "1.1.0",
            "dependencies": {
                "B": { "version": "1.1.0" }
            }
        },
        "B": { "version": "2.0.0" },
        "C": { "version": "1.0.0" }
    }
}
```

4. `package-lock.json` 可能被意外更改的原因
    1. `package.json` 文件修改
    2. 挪动了包的位置
    3. `registry` 的影响
