## chrome本地跨域解决方案
> https://wdd.js.org/origin-null-is-not-allowed.html

* 1.给chrome快捷方式中增加-allow-file-access-from-files,重启
    注意在-allow-file-access-from-file的前面需要一个空格
* 2.服务端响应修改Access-Control-Allow-Origin:*
    ```js
    var express = require('express');
    var app = express();
    //设置跨域访问
    app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        next();
    });
    ```
* 3.搭建静态http服务器
    * 1.http-server(使用最简单，star最多)
    ```js
    cnpm i http-server -g
    http-server -p 9000
    ```
    * 2.serve
    * 3.webpack-dev-server
    * 4.anywhere
    * 5.puer