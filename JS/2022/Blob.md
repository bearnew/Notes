# Blob

1. `Blob（Binary Large Object）`表示二进制类型的大对象。
2. 在数据库管理系统中，将二进制数据存储为一个单一个体的集合。`Blob` 通常是影像、声音或多媒体文件。
3. 在 `JavaScript` 中 `Blob` 类型的对象表示不可变的类似文件对象的原始数据。
4. `Blob` 表示的不一定是`JavaScript`原生格式的数据。`File` 接口基于`Blob`，继承了 `blob `的功能并将其扩展使其支持用户系统上的文件。
5. 要从其他非`blob`对象和数据构造一个 `Blob`，请使用 `Blob()` 构造函数。要创建一个 `blob` 数据的子集 `blob`，请使用 `slice()` 方法。
6. `example`

```js
let myBlobParts = ["<html><h2>Hello Semlinker</h2></html>"]; // an array consisting of a single DOMString
let myBlob = new Blob(myBlobParts, {
    type: "text/html",
    endings: "transparent",
}); // the blob

console.log(myBlob.size + " bytes size");
// Output: 37 bytes size
console.log(myBlob.type + " is the type");
// Output: text/html is the type
```
