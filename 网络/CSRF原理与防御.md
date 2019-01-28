## CSRF原理与防御
Cross Site Request Forgery(跨站请求伪造)
> https://xwjgo.github.io/2017/10/26/XSS%E5%92%8CCSRF/

> https://www.cnblogs.com/hyddd/archive/2009/04/09/1432744.html
### 1.CSRF发生原因
盗用浏览器中的cookie中的身份信息，发送恶意请求
### 2.示例
* 1.在网页中插入银行卡转账请求
```html
<img src=http://www.mybank.com/Transfer.php?toBankId=11&money=1000>
```
* 2.在网页中放置一个表单提交
```html
<!--注意：ajax受浏览器同源策略的影响，但是表单提交是不受这个限制的。-->
<body onload="steal()">
　　<iframe name="steal" display="none">
　　　　<form method="POST" name="transfer"　action="http://www.myBank.com/Transfer.php">
　　　　　　<input type="hidden" name="toBankId" value="11">
　　　　　　<input type="hidden" name="money" value="1000">
　　　　</form>
　　</iframe>
</body>
```
```js
function steal(){
    iframe = document.frames["steal"];
　　 iframe.document.Submit("transfer");
}
```
### 3.防御
* 1.检查HTTP Referer（用于表示请求来源于哪个地址）字段
    * 局限性: referer也可能被浏览器篡改
* 2.添加校验TOKEN
    * 其原理是服务器在响应请求时，生成一个csrf-token传递到前台，当前台发起请求时，需要带着这个csrf-token以便于服务器端进行校验。这样一来，由于csrf攻击网站无法获取到这个token，所以也无法通过服务器端的校验。
    * 当前台发起请求时，csrf-token可以通过url参数，或者post的请求体来携带，但是最安全的方式，还是将csrf-token添加到自定义HTTP请求头中（比如X-CSRF-TOKEN）。
* 3.验证码
    * 强制用户必须与应用进行交互，才能完成最终请求