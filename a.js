exports.a = "原始值-a模块内变量";
var b = require("./b");
console.log("a模块引用b模块：", b);
exports.a = "修改值-a模块内变量";
