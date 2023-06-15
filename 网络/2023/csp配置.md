# CSP 配置

## 1.CSP 是什么?

1. 内容安全策略(CSP)是一种 web 应用技术用于帮助缓解大部分类型的内容注入攻击，包括 XSS 攻击和数据注入等，这些攻击可实现数据窃取、网站破坏和作为恶意软件分发版本等行为。该策略可让网站管理员指定客户端允许加载的各类可信任资源。
2. XSS 攻击

   1. 存储型 XSS 攻击
      1. ⾸先⿊客利⽤站点漏洞将⼀段恶意 JavaScript 代码提交到⽹站的数据库中；
      2. 然后⽤⼾向⽹站请求包含了恶意 JavaScript 脚本的⻚⾯；
      3. 当⽤⼾浏览该⻚⾯的时候，恶意脚本就会将⽤⼾的 Cookie 信息等数据上传到服务器。
      4. 喜马拉雅案例
         1. 将专辑名称设置为⼀段 JavaScript 并提交
         2. 喜⻢拉雅的服务器会保存该段 JavaScript 代码到数据库中
         3. ⽤⼾打开⿊客设置的专辑时，这段代码就会在⽤⼾的⻚⾯⾥执⾏，这样就可以获取⽤⼾的 Cookie 等数据信息
         4. ⿊客拿到了⽤⼾ Cookie 信息之后，就可以利⽤ Cookie 信息在其他机器上登录该⽤⼾的账号进行恶意操作
   2. 反射型 XSS 攻击
      1. 恶意 JavaScript 脚本属于⽤⼾发送给⽹站请求中的⼀部分，随后⽹站⼜把恶意 JavaScript 脚本返回给⽤⼾。
      2. 黑客通过 QQ 群或者邮箱向用户发送一些恶意链接`http://localhost:3000/?xss=<script>alert('你被xss攻击了')</script>`
      3. 用户点击链接，服务器会将链接的参数返回给用户的 html 中
   3. 基于 DOM 的 XSS 攻击
      1. ⿊客通过各种⼿段将恶意脚本注⼊⽤⼾的⻚⾯中，⽐如通过⽹络劫持在⻚⾯传输过程中修改 HTML ⻚⾯的内容
      2. 有通过 WiFi 路由器劫持的，有通过本地恶意软件来劫持的
      3. 在 Web 资源传输过程或者在⽤⼾使⽤⻚⾯的过程中修改 Web ⻚⾯的数据

3. 开启`CSP`
   1. 通过 <meta> 标签来开启 CSP 的配置; <meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src https://*;">
   2. 通过返回 `Content-Security-Policy` 这个 `HTTP Header` 即可，这个 `Header` 对应的值就是我们 `web` 内容来源的规则;

## 2.Nginx配置
```js
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' aimg.kwcdn.com  data:; font-src 'self'; connect-src 'self'";
server {
    listen 27852;
    server_name disney.testdev.ltd disney.temu.team;
    root  /var/www/html;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' aimg.kwcdn.com  data:; font-src 'self'; connect-src 'self'";
}
```