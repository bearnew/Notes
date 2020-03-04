## if-modified-since
```js
const http=require('http');
const fs=require('fs');
const url=require('url');

// 连续两次访问:  http://localhost:8080/1.html    第一次是200  第二次是304
http.createServer((req, res)=>{
    let {pathname}=url.parse(req.url);

    //获取文件日期
    fs.stat(`www${pathname}`, (err, stat)=>{
        if(err){
            res.writeHeader(404);
            res.write('Not Found');
            res.end();
        }else{
            // 请求头中有if-modified-since -> 不是第一次请求，之前浏览器中缓存了该页面
            if(req.headers['if-modified-since']){
                let oDate=new Date(req.headers['if-modified-since']);
                let time_client=Math.floor(oDate.getTime()/1000);
                let time_server=Math.floor(stat.mtime.getTime()/1000);

                if(time_server>time_client){      // 服务器的文件时间 > 客户端手里的版本
                    sendFileToClient();
                }else{
                    res.writeHeader(304);
                    res.write('Not Modified');
                    res.end();
                }
            }
            // 请求头中没有if-modified-since -> 第一次请求 -> 直接返回要的文件
            else{
                sendFileToClient();
            }

            // 直接返回文件
            function sendFileToClient(){
                //发送
                let rs=fs.createReadStream(`www${pathname}`);

                res.setHeader('Last-Modified', stat.mtime.toGMTString());

                //输出
                rs.pipe(res);

                rs.on('error', function(err){
                    res.writeHeader(404);
                    res.write('Not Found');
                    res.end();
                });
            }
        }
    });
}).listen(8080);
```
## if-none-match
```js
const http = require("http");
const chalk = require("chalk");
const url = require("url");
const mime = require('mime');
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { promisify } = require("util");
 
 
const stat = promisify(fs.stat);
 
const server = http.createServer(async function (req, res) {
     const { pathname } = url.parse(req.url);
     const filename = path.join(process.cwd(), pathname);
     try {
        const status = await stat(filename);
        let etag;
        let data = fs.readFileSync(filename)
        etag = crypto.createHash("md5").update(data).digest("hex") //通过md5设置ETag字段
     
        if (req.headers["if-none-match"] ===  etag) {//匹配成功
        console.log(etag);
           res.writeHead(304);
           res.end();
            return ;
        }
        res.setHeader("Content-Type", mime.getType(filename));
        res.setHeader("ETag", etag); //通过md5设置ETag字段
        fs.createReadStream(filename).pipe(res);
     } catch (err) {
         console.log(err);//文件夹出现问题
     }
})
 
server.listen(8080, () => {
    console.log(`${chalk.red("服务器已经启动")}`);
});
server.on("close", () => {
    console.log(`${chalk.green("服务器已经关闭")}`);
})
```