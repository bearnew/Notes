// 箭头函数
setTimeout(() => {
  MyObj.showName();
}, 1000);
// 或者function函数
setTimeout(function () {
  MyObj.showName();
}, 1000);
// 使用bind
setTimeout(MyObj.showName.bind(MyObj), 1000);
