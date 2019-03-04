### XHR的用法
#### 创建XHR对象
```js
function createXHR () {
    var xmlhttp;
    if (window.XMLHttpRequest)
      {// code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp=new XMLHttpRequest();
      }
    else
      {// code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
      }
}

```
#### open()方法 (启动一个请求以备发送)
> 参数：请求的类型（"get", "post"）,请求的URL, 是否异步发送请求的布尔值
* xhr.open("get", "example.php", false);
#### send(null)
> 接收一个参数，即要作为请求主体发送的数据，调用send()之后，请求就会被分派到服务器，这次请求是同步的，js代码会等到服务器响应之后再继续执行，收到响应后，响应的数据会自动填充XHR对象的属性
* responseText: 作为响应主体被返回的文本
* responseXML: 如果响应的内容类型是text/html或application/xml，这个属性中将保存包含着响应数据的XML DOM文档
* status: 响应的HTTP状态
* statusText: HTTP状态的说明
#### XHR对象的readyState属性
* 0：未初始化，尚未调用open()方法
* 1：启动，已经调用open方法，但尚未调用send()方法
* 2: 发送，已经调用send()方法，但尚未收到响应
* 3：接收，已经接收到部分响应数据
* 4：完成，已经接收到全部响应数据，并且已经在客户端使用

> readyState属性的值变化会触发一次readystatechange事件，调用open()方法之前指定onreadystatechange事件处理程序才能确保跨浏览器兼容性
``` js
var xhr = createXHR();
xhr.onreadystatechange = function() {
    if (xhr.readyState == 4){
        if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 ){
            alert(xhr.responseText)
        }else{
            alert("Request was unsuccessful:" + xhr.status);
        }
    }
};
xhr.open("get", "example.txt", true);
xhr.send(null);
```
##### 在接收到响应之前还可以调用abort()方法来取消异步请求
* xhr.abort();
##### HTTP头部信息
* Accept：浏览器能够处理的内容类型
* Accept-Charset: 浏览器能够显示的字符集
* Accept-Encoding: 浏览器能够处理的压缩编码
* Accept-Language: 浏览器当前设置的语言
* Connection: 浏览器与服务器之间连接的类型
* Cookie: 当前页面设置的任何Cookie
* Host: 发出请求的页面所在的域
* Referer: 发出请求的页面的URL
* User-Agent: 浏览器的用户代理字符串
##### setRequestHeader()设置自定义的请求头部信息，接收两个参数，头部字段的名称，头部字段的值
```js
var xhr = createXHR();
xhr.onreadystatechange = function() {
    if(xhr.readyState == 4){
        if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
            alert(xhr.responseText)
        }else{
            alert("Request was unsuccessful:" + xhr.status)
        }
    }
}
xhr.open("get", "example.php", true);
xhr.setRequestHeader("MyHeader", "MyValue");
xhr.send(null);
```
##### FormData
var form = document.getElementById("user-info");
xhr.send(new FormData(form));