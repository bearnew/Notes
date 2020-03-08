#### 根据坐标获取dom元素
```js
var element = document.elementFromPoint(x, y);
```
#### select点击事件不弹出option
```js
$('select').on('focus',function(event){
    $(this).hide();
    setTimeout(function(self){
        self.show();
    }, 0, $(this));
});
$('select').on('click', function(){
	alert('123')
})
```
#### 基础考察
```js
function A() {

}
function B(a) {
    this.a = a;
}
function C(a) {
    if(a) {
    	this.a = a;
    }
}

A.prototype.a = 1;
B.prototype.a = 1;
C.prototype.a = 1;

console.log(new A());   // A {}
console.log(new B());   // B {a: undefined}
console.log(new C(2));  // C {a: 2}
```

```js
var a = 1;
function b() {
    var a = 2;
    function c() {
    console.log(a);
    }

    return c;
}

b()(); // 2
```
#### 自执行函数
```js
(function () { /* Code */ } ()) // 推荐使用
(function () { /* Code */ })()
```
#### 当前时间转换成时间戳
```js
var stringTime = "2014-07-10 10:21:12";
var timestamp2 = Date.parse(new Date(stringTime));
```
#### link和@import区别**
* link是html标签，@import是css标签
* link除了调用css，还可以申明页面链接属性，声明目录，rss等
> 1. rel声明链接对象的作用或者类型
> 2. href引用css的文件路径
> 3. media应用的设备，screen说明应用到屏幕上
> 4. title是css的名称
* link,可以用javascript进行样式选择

#### 常见行内元素和块级元素**
* 块级元素
> address dir div  p table dl dt dd form h1-h6 menu ol ul li pre 
* 行内元素
> a b abbr big br cite em font i img input lable select span strong sub sup textarea u 

#### jQuery.extend(object),jQuery.fn.extend(object)**
```
jQuery.extend({
    min: function(a,b) {return a < b ? a : b},
    max: function(a,b) {return a > b ? a : b}
})

jQuery.min(2,4); // 2
jQuery.max(4,6); // 6
```
```
var settings = { validate: false, limit: 5, name: "foo" }; 
var options = { validate: true, name: "bar" }; 
jQuery.extend(settings, options); 

结果：settings == { validate: true, limit: 5, name: "bar" }
```

```
$.fn.extend({          
    alertWhileClick:function() {            
          $(this).click(function(){                 
                 alert($(this).val());           
           });           
     }       
});       
$("#input1").alertWhileClick(); // 页面上为：
```
#### 深拷贝**
> 对象通过遍历属性进行深拷贝
```
var deepCopy = function (source) {
    var result = {}
    for (var key in source) {
        result[key] = typeof source[key] === 'object' ? deepCopy(source[key]) : source[key];
    }
    return result;
}
```
> 数组通过slice进行深拷贝
```
var arr = ["One","Two","Three"];

var arrtoo = arr.slice(0);
arrtoo[1] = "set Map";
document.writeln("数组的原始值：" + arr + "<br />");//Export:数组的原始值：One,Two,Three
document.writeln("数组的新值：" + arrtoo + "<br />");//Export:数组的新值：One,set Map,Three
```
#### js正则解析html**
```
document.body.innerHTML.match(/(<img.*?>)/mg).map((item)=> item.replace(/(?=.*?)\/?>$/, '')+'>')
```
##### ios解码url
```js
var imgUrl = decodeURIComponent(self.getParam().qrImgUrl);
```
##### js 调起手机百度浏览器
> http://lbsyun.baidu.com/index.php?title=uri/api/web
```js
var latitude = '';
var longitude = '';

function getLocation(){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position){
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    window.location.href = 'http://api.map.baidu.com/direction?origin=latlng:'+latitude+','+longitude+'|name:我的位置&destination=latlng:'+s[1]+','+s[0]+'|name:'+content+'&mode=driving&coord_type=wgs84&region='+title+'&output=html&src=yourCompanyName|yourAppName';
    return false;
}

getLocation();
```