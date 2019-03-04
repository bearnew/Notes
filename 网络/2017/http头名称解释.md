### 请求头
* Accept: text/html,image/*(浏览器可以接收的类型)
* Accept-Charset: ISO-8859-1(浏览器可以接收的编码类型)
* Accept-Encoding: gzip,compress(浏览器可以接收压缩编码类型)
* Accept-Language: en-us,zh-cn(浏览器可以接收的语言和国家类型)
* Host: www.it315.org:80(浏览器请求的主机和端口)
* If-Modified-Since: Tue, 11 Jul 2000 18:23:51 GMT(某个页面缓存时间)
* Referer: http://www.it315.org/index.jsp(请求来自于哪个页面)
* User-Agent: Mozilla/4.0 (compatible; MSIE 5.5; Windows NT 5.0)(浏览器相关信息)
* Cookie：(浏览器暂存服务器发送的信息)
* Connection: close(1.0)/Keep-Alive(1.1)(HTTP请求的版本的特点)
* Date: Tue, 11 Jul 2000 18:23:51 GMT(请求网站的时间)

### 响应头
* Location: http://www.it315.org/index.jsp(控制浏览器显示哪个页面)
* Server:apache tomcat(服务器的类型)
* Content-Encoding: gzip(服务器发送的压缩编码方式)
* Content-Length: 80(服务器发送显示的字节码长度)
* Content-Language: zh-cn(服务器发送内容的语言和国家名)
* Content-Type: image/jpeg; charset=UTF-8(服务器发送内容的类型和编码类型)
* Last-Modified: Tue, 11 Jul 2000 18:23:51 GMT(服务器最后一次修改的时间)
* Refresh: 1;url=http://www.it315.org(控制浏览器1秒钟后转发URL所指向的页面)
* Content-Disposition: attachment; * *filename=aaa.jpg(服务器控制浏览器发下载方式打开文件)
* Transfer-Encoding: chunked(服务器分块传递数据到客户端） 
* Set-Cookie:SS=Q0=5Lb_nQ; path=/search(服务器发送Cookie相关的信息)
* Expires: -1(服务器控制浏览器不要缓存网页，默认是缓存)
* Cache-Control: no-cache(服务器控制浏览器不要缓存网页)
* Pragma: no-cache(服务器控制浏览器不要缓存网页)  
* Connection: close/Keep-Alive(HTTP请求的版本的特点)  
* Date: Tue, 11 Jul 2000 18:23:51 GMT(响应网站的时间)
* 

### http
> 超文本传输协议，详细的规定了万维网服务器与客户端之间的通信规则。
