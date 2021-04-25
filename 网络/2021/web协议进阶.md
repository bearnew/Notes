# web 协议进阶

## 一、OSI 模型（Open System Interconnection Reference Model）概念模型

1. 应用层
   - `Network process to application`
   - `DNS HTTP P2P SMTP Telnet FTP`
2. 表示层
   - `Data representation and encryption`
   - `Recognizing data`: `HTML DOC JPEG MP3 AVI SOCKETS`
3. 会话层
   - `interhost communication`
   - `Session establishment in TCP SIP RTP RPC-Named pipes`
4. 传输层
   - `End-to-end connections and reliablity`
   - `TCP UDP SCTP SSL TLS`
5. 网络层
   - `path determination and logic addressing`
   - `IP ARP IPsec ICMP IGMP OSPF`
6. 数据链路层
   - `physical addressing`
   - `802.11 MAC/LLC WALN `
7. 物理层
   - `Media, signal, and binary tranmission`
   - `RS-232 RJ45 V34 网卡等硬件`

## 二、chrome 网络面板

### 1.属性过滤

- 筛选多个属性，通过空格实现 AND 操作
- `domain`: 仅显示来自指定域的资源。你可以使用通配符字符(\*)纳入多个域
- `has-response-header`: 显示包含指定`HTTP`响应标头的资源
- `is`: 使用`is:running`可以查找`websocket`资源，`is:from-cache`可查找缓存读取的资源
- `large-than`: 显示大于指定大小的资源（以字节为单位）。将值设为 1000 等同于设置为 1k
- `method`: 显示通过指定`HTTP`方法类型检索的资源
- `mime-type`: 显示指定`MIME`类型的资源
- `mixed-content`: 显示所有混合内容资源(`mixed-content: all`)，或者仅显示当前显示的资源(`mixed-content: displayed`)
- `scheme`: 显示 http（`scheme:http`）或 https（`scheme:https`）检索的资源
- `set-cookie-domain`: 显示具有`set-cookie`标头并且`Domain`属性与指定值匹配的资源
- `set-cookie-name`: 显示具有`set-cookie`标头并且名称与指定值匹配的资源
- `set-cookie-value`: 显示具有`set-cookie`标头并且值与指定值匹配的资源
- `status-code`: 仅显示`HTTP`状态码与指定代码匹配的资源

## 2.在请求栏按住`shift`鼠标悬停到指定请求，请求的下游请求会被标记为红色，请求的上游请求会被标记为绿色

## 3.浏览器加载时间

1. 解析`HTML`结构
2. 加载外部脚本与样式表文件
3. 解析并执行脚本代码(部分脚本会阻塞页面的加载)
4. DOM 树构建完成（`DOMContentLoaded`事件）
5. 加载图片等外部文件
6. 页面加载完成(`load`事件)

## 4.请求时间详细分布（可点击 network 面板的 timing 进行查看）

1. `Queueing`: 浏览器在以下情况下对请求排队
   - 存在更高优先级的请求
   - 此源已打开六个 TCP 连接，达到限值，仅适用于`http1.0/http1.1`
   - 浏览器正在短暂分配磁盘缓存中的空间
2. `Stalled`: 请求可能会因`Queueing`中描述的任何原因而停止
3. `DNS Lookup`: 浏览器正在解析请求的 IP 地址
4. `Proxy Negotiation`: 浏览器正在与代理服务器协商请求
5. `Request send`: 正在发送请求
6. `ServiceWorker Preparation`: 浏览器正在启动`Service Worker`
7. `Request to ServiceWorker`: 正在将请求发送到`Service Worker`
8. `Waiting(TTFB)`: 浏览器正在等待响应第一个字节。TTFB（Time to First byte），此时间包括 1 次往返延迟时间及服务器准备响应所用的时间。
9. `Content Download`: 浏览器正在接收响应
10. `Receiving Push`: 浏览器正在通过`HTTP/2`服务器推送接收此响应的数据
11. `Reading Push`: 浏览器正在读取之前收到的本地数据

## 5.为什么要进行 URI 编码

- 传递数据中，如果存在用作分隔符的保留字符怎么办
- 对可能产生歧义性的数据编码
  - 不在`ASCII`码范围内的字符，先`UTF8`进行编码，再`US-ASCII`编码
  - `ASCII`码中不可显示的字符
    - 0 ～ 31 及 127(共 33 个)是控制字符或通信专用字符（其余为可显示字符），如控制符：LF（换行）、CR（回车）、FF（换页）、DEL（删除）、BS（退格)、BEL（响铃）等；通信专用字符：SOH（文头）、EOT（文尾）、ACK（确认）等；ASCII 值为 8、9、10 和 13 分别转换为退格、制表、换行和回车字符。它们并没有特定的图形显示，但会依不同的应用程序，而对文本显示有不同的影响
    - 32 ～ 126(共 95 个)是字符(32 是空格），其中 48 ～ 57 为 0 到 9 十个阿拉伯数字。
    - 65 ～ 90 为 26 个大写英文字母，97 ～ 122 号为 26 个小写英文字母，其余为一些标点符号、运算符号等。
  - `URI`中规定的保留字符
  - 不安全字符（传输环节中可能会被不正确处理），如空格、引号、尖括号

## 6.跨代理的长短连接

1. TCP 编程上看 HTTP 请求处理
   1. `server`创建新的套接字(socket)
   2. `server`将套接字绑定到端口 80 上
   3. `server`允许套接字进行连接(`listen`)
   4. `server`允许连接(`accept`)
   5. `client`获取`ip`地址和端口号
   6. `client`创建新的套接字(`socket`)
   7. `client`连接到服务器的 ip: port(connect)
   8. `server`通知应用程序有连接到来
   9. `client`连接成功
   10. `client`发送`http`请求(`write`)
   11. `server`开始读取请求(`read`)
   12. `client`等待`http`响应
   13. `server`处理`http`请求报文
   14. `server`回送`http`响应(`write`)
   15. `client`处理`http`响应
   16. `server`关闭连接，`client`关闭连接
2. `Connection`头部
   - `Keep-Alive`: 长连接
     - 客户端请求长连接`connection: keep-alive`
     - 服务端表示支持长连接`connection: keep-alive`
     - 客户端复用连接
     - `HTTP/1.1`默认支持长连接
       - 设置`connection: keep-alive`无意义
   - `Close`：短连接
   - 对代理服务器的要求
     - 不转发`connection`列出头部（例：在 connection 中列出了`cookie`，代理服务器转发则不转发`cookie`），该头部仅与当前连接相关
   -
3. `Proxy-Connection`, 处理中间的代理服务器不支持长连接的情况
   - 旧的代理服务器不理解该头部，退化为短连接
   - 新版本的代理服务器理解该头部
     - 与客户端建立长连接
     - 与服务器使用`connection`替代`proxy-connection`

## 7.代理服务器转发消息

1. HTTP 头部`X-Forwarded-For`用于传递 IP，`X-Forwarded-For: 115.204.33.1 1.1.1.1`
2. HTTP 头部`X-Real-IP`用于传递用户 IP，`X-Real-IP: 115.204.33.1`
3. Max-Forwards 头部，限制`Proxy`代理服务器的最大转发次数，仅对`TRACE/OPTIONS`方法有效
4. Via 头部，指明经过的代理服务器的名称和版本
5. Cache-Control: no-transform，禁止代理服务器修改响应包体

## 8.请求与响应的上下文

1. 请求上下文
   - User-Agent: 指明客户端的类型信息
   - Referer: 浏览器对来自某一页面的请求自动添加的头部
     - Referer 不会添加的场景：
       - 来源页面采用的协议为本地文件的`file`或者`data`URI
       - 当前页面采用的 http 协议，来源页面采用的 https 协议
     - 作用：服务器用于统计分析、缓存优化、防盗链等
   - From
     - 用于网络爬虫，告诉服务器如何通过邮件联系到爬虫的负责人
     - 例: From: webmaster@example
2. 响应的上下文
   - Server, 指明服务器上所用的软件信息，`Server: nginx`
   - Allow，允许哪些方法，`Allow: GET,HEAD,PUT`
   - Accept-Ranges: 告诉客户端服务器上该资源是否允许`range`请求

## 9.HTML form 表单

1. `action`: 提交时发起 http 请求的 url
2. `method`: 提交时发起 http 请求的 http 方法
   - GET：通过 URI，将表单数据以 URI 参数的方式提交
   - POST: 将表单数据放在请求包体中提交
3. `enctype`: 在 POST 方法下，对表单内容在请求包体中的编码方式
   - `application/x-www-form-urlencoded`: 数据被编码成以`&`分割的键-值对，同时以`=`分割键和值，字符以 URL 编码方式编码
   - `multipart/form-data`
     - `boundary`分隔符
     - 每部分表述皆有 http 头部描述子包体，例如`Content-Type`
     - `last boundary`结尾

## 10.多线程、断点续传、随机点播等场景

1. 下载文件的指定内容，下载完后拼装成统一的文件
2. `HTTP Range`
   - 允许服务端基于客户端的请求只发送响应包体的一部分给客户端，客户端自动将多个片段的包组合成完整的体积更大的包体
     - 支持断点续传
     - 支持多线程下载
     - 支持视频播放器实时拖动
   - 服务器通过`Accept-Range`头部表示是否支持`Range`请求
     - `Accept-Ranges = acceptable-ranges`
     - eg: `Accept-Ranges: bytes`表示支持, `Accept-Ranges: none`表示不支持
3. `Range`请求范围的单位
   - 基于字节，设包体总长度为 10000
     - 第 1 个 500 字节，`bytes=0-499`
     - 第 2 个 500 字节
       - bytes=500-999
       - bytes=500-600,601-999
       - bytes=500-700,601-999
     - 最后 1 个 500 字节
       - bytes=-500
       - bytes=9500-
     - 仅要第 1 个和最后 1 个字节：bytes=0-0,-1
   - 通过`Range`头部传递请求范围，如: Range: bytes=0-499
4. Range 条件请求
   1. `If-Range = entity-tag/HTTP-date`
      - 可以使用`Etag`或者`Last-Modified`
   2. 与`If-Unmodified-Since`或者`If-Match`头部共同使用
5. 服务器响应
   - `206 Partial Content`: 成功返回部分包体
   - `Content-Range`头部: 显示当前片段包体在完整包体中的位置
   - `416 Range Not Satisfiable`: 表示请求范围不满足实际资源大小
   - `200 OK`: 服务器不支持`Range`请求，返回完整的响应包体

## 11.同源策略的作用

1. 限制了同一个源加载的文档或脚本如何与来自另一个源的资源进行交互
2. 同源策略的作用
   1. 站点 B 取出了站点 A 的 cookie 与 token，与服务端进行交互，是不安全的
   2. 没有同源策略，站点 B 的脚本可以随意修改站点 A 的 DOM 结构

## 12.Cors

1. 简单请求的跨域访问
   - 请求中携带`origin`头部告知来自哪个域
   - 响应中携带`Access-Control-Allow-origin`头部表示允许哪些域
   - 浏览器放行
2. 复杂请求跨域访问
   1. 预检请求
      - 预检请求头部：`Access-Control-Request-Method`， `Access-Control-Request-Headers`
      - 预检请求响应：`Access-Control-Allow-Methods`，`Access-Control-Allow-Headers`，`Access-Control-Max-Age`
   2. 跨域访问资源：请求头部
      - 请求头部
        - `origin`: 一个页面的资源可能来自于多个域名，在`AJAX`等子请求中标明来源与某个域名下的脚本，以通过服务器的安全校验
        - `Access-Control-Request-Mehod`：在`preflight`预检请求(`OPTIONS`)中，告知服务器接下来的请求会使用哪些方法
        - `Access-Control-Request-Headers`: 在`preflight`预检请求(`OPTIONS`)中，告知服务器接下来的请求会传递哪些头部
      - 响应头部
        - `Access-Control-Allow-Methods`, 在`preflight`预请求的响应中告诉客户端后续请求允许使用的方法
        - `Access-Control-Allow-Headers`, 在`preflight`预检请求的响应中，告知客户端后续请求允许携带的头部
        - `Access-Control-Max-Age`，在`preflight`预检请求的响应中，告知客户端该响应的信息可以缓存多久
        - `Access-Control-Expose-Headers`，告知浏览器哪些响应头部可以供客户端使用，默认情况下只有`Cache-Control`，`Content-Language`，`Content-Type`，`Expires`,`Last-Modified`,`Pragma`可供使用
        - `Access-Control-Allow-Origin`,告知浏览器允许哪些域名访问当前资源，\*表示允许所有域。为避免缓存错乱，响应中需要携带`Vary:Origin`
        - `Access-Control-Allow-Credential`,告知浏览器是否可以将`Credentials`暴露给客户端使用，`Credentials`包含`cookies`,`authorization`类头部，`TLS`证书

## 13.条件请求

- ![http-condition](https://github.com/bearnew/picture/blob/master/markdown_v2/2021/web%E5%8D%8F%E8%AE%AE/http_condition.PNG?raw=true)

## 14. HTTP 缓存

1. 目标：减少时延；降低贷款消耗
2. 私有缓存
   - 仅供 1 个用户使用的缓存，通常存在于浏览器这样的客户端上
3. 共享缓存
   - 可以供多个用户的缓存，存在于网络中负责转发消息的代理服务器（对热点资源常使用共享缓存，以减轻源服务器的压力，并提升网络资源）
   - `Authentication`响应不可被代理服务器缓存
   - 正向代理
   - 反向代理
4. ![http-cache](https://github.com/bearnew/picture/blob/master/markdown_v2/2021/web%E5%8D%8F%E8%AE%AE/http_cache.png?raw=true)
5. 判断缓存是否过期的优先级
   - `s-maxage > max-age > Expires > 预估过期时间`
     - `Cache-Control: s-maxage=3600`，`s-maxage`同 max-age 作用一样，只在代理服务器中生效（比如 CDN 缓存）。比如当 s-maxage=60 时，在这 60 秒中，即使更新了 CDN 的内容，浏览器也不会进行请求。
     - `Cache-Control: max-age=86400`
     - `Expires: Fri,03 May 2019 03:15:20 GMT`
     - 预估过期时间：(DownloadTime - LastModified)\*10%
6. 什么样的 Http 可以被缓存
   - 请求方法可以被缓存理解（不只是 GET 方法，其他方法加上适当的头文件也可被缓存）
   - 响应码可以被缓存理解（404 206 也可以被缓存）
   - 响应与请求的头部没有指明`no-store`
   - 响应中至少包含以下头部 1 个或多个
     - `Expires max-age s-maxage public`
     - 当响应中没有明确指明过期时间的头部时，如果响应码非常明确，则也可以缓存
   - 如果缓存在代理服务器上
     - 不含有`private`
     - 不含有`Authorization`
7. 使用缓存作为当前请求响应的条件
   - 缓存中的响应`Vary`头部指定的头部必须与请求中的头部相匹配
     - 不同的客户端可能支持的压缩编码方式不同
     - 要求输出的内容不一样
     - 由服务器端添加，添加到响应头部用,在客户端缓存机制或者是缓存服务器在做缓存操作的时候，会使用到 Vary 头
   - 当前请求以及缓存中的响应都不包含`no-cache`头部
   - 缓存中的响应必须是以下之一
     - 新鲜的（时间上未过期）
     - 缓存中的响应头部明确告知可以使用过期的响应（`Cache-Control: max-stale=60`）
     - 使用条件请求去服务器端验证请求是否过期，得到 304 响应
8. 验证请求与响应
   - 验证请求
     - 若缓存中含有`Last-Modifiled`头部
       - `if-Unmodified-Since`, 如果文件被修改: 则不传输, 服务器返回: 412 Precondition failed (预处理错误)
       - `if-Modified-Since`
       - `if-Range`
     - 若缓存响应中含有`Etag`头部
       - `if-None-Match`
       - `if-Match`
       - `if-Range`
