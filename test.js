var myImage = (function () {
    // var imgNode = new Image();
    var imgNode = document.createElement("img");
    document.body.appendChild(imgNode);
    return {
        setSrc: function (src) {
            imgNode.src = src;
        }
    }
})();

// 代理模式
// var ProxyImage = (function () {
myImage.setSrc("http://img.lanrentuku.com/img/allimg/1212/5-121204193Q9-50.gif");
var img = new Image();
img.src = 'https://dimg04.c-ctrip.com/images/a10i1a0000018yc4e4CF6.jpg';
img.onload = function () {
    myImage.setSrc(this.src);
};
// return {
//     setSrc: function (src) {
// 占位图片loading


//     }
// }
// })();
// 调用方式

// ProxyImage.setSrc("https://dimg04.c-ctrip.com/images/a10i1a0000018yc4e4CF6.jpg"); // 真实要展示的图片