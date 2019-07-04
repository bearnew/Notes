## js thunk函数，将多参数替换成单参数版本

```js
// 正常版本的readFile（多参数版本）
fs.readFile(fileName, callback);

// Thunk版本的readFile（单参数版本）
var readFileThunk = Thunk(fileName);
readFileThunk(callback);

var Thunk = function (fileName){
    return function (callback){
        return fs.readFile(fileName, callback); 
    };
};
```
