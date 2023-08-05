# NodeJs文件路径

```js
test/
    — nodejs/
        ∟ path.js
    — lib/
        ∟ common.js
```
- `Desktop` 中執行命令 `node test/nodejs/path.js`
```js
__dirname：     C:\Users\Dylanliu\Desktop\test\nodejs
__filename：    C:\Users\Dylanliu\Desktop\test\nodejs\path.js
process.cwd()： C:\Users\Dylanliu\Desktop
./：            C:\Users\Dylanliu\Desktop
```
- __dirname：     被执行的js所在文件夹的绝对路径
- __filename：    被执行js的绝对路径
- process.cwd()： 执行node命令的绝对文件夹绝对路径
- ./:             和 process.cwd() 一样

# 示例2
```js
  
process.cwd(); // /build/repository
__dirname; // /data/faas/runtime/node16/build/repository
__filenam; // /data/faas/runtime/node16/build/repository/bundle.js
```