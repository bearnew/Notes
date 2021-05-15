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

## 15.重定向

1. 为什么需要重定向
   1. 提交`Form`表单后需要显示内容页面
   2. 站点从`HTTP`迁移到了`https`
   3. 站点部分`uri`发生了变化，但搜索引擎或者流量入口只收录了老的`uri`
   4. 站点正在维护中，需要给用户显示不一样的内容
   5. 站点更换了新域名
2. 重定向的流程
   1. 收到重定向的响应码，读取响应头部`Location`头部新的`uri`,跳转访问该页面
3. 重定向响应码
   - **永久重定向:能被缓存**
     1. 301(http1.0): 重定向请求通常使用`GET`方法，不管原请求采用的什么方法，能被缓存
     2. 308(http1.1): 重定向请求必须使用原请求的方法和包体发起访问
   - **临时重定向:资源只是临时变更 URI，不能被缓存**
     1. 302(http1.0): 重定向请求通常会使用`get`方法，而不管原请求究竟采用的什么方法
     2. 303(HTTP1.1): 不表示资源的变迁，用新的 URI 的响应原请求的服务，重定向请求会使用 GET 方法，例如表单提交后向用户返回新的内容，不能被缓存
     3. 307(http1.1): 重定向请求必须使用原请求的方法和包体发起访问，如 HTTP 重定向到 HTTPS
   - **特殊重定向:**
     1. 300：响应式内容协商中，告知客户端有多种资源表述，要求客户端选择一种自认为合适的表述
     2. 304: 服务器验证过期缓存有效后，要求客户端使用该缓存
4. 重定向循环
   - 重定向循环时，`chrome`会提示：`ERR_TOO_MANY_REDIRECTS`

## 16.http tunnel 隧道

1. 通过 http 连接传输非 http 协议格式的消息，常用于穿越防火墙
2. 建立隧道后，传输的非 HTTP 消息，变成了双向传输

## 17.网络爬虫

1. 网络爬虫模拟人类使用浏览器浏览、操作页面的行为，对互联网的站点进行操作
2. 网络爬虫的类别
   1. SEO: 搜索引擎优化
      - 合法的优化：`sitemap title keywords https`
      - 非法的优化：利用`PageRank`算法漏洞，通过爬虫提升网页排名，搜索引擎使用验证码来防范
3. 模拟浏览器渲染引擎，对 JS 文件分析执行，发起`Ajax`请求，抓取数据
4. 爬虫常见的请求头部
   - `User-Agent`: 识别是哪类爬虫
   - `From`: 提供爬虫机器人管理者的邮箱地址
   - `Accept`: 告知服务器爬虫对哪些资源类型感兴趣
   - `Referer`: 从哪个路径跳转进来的
5. `robots.txt`告知爬虫哪些内容不应被爬取
   - `User-agent`: 允许哪些机器人
   - `Disallow`: 禁止访问特定目录
   - `Crawl-delay`: 访问间隔秒数
   - `Allow`: 抵消`Disallow`指令
   - `Sitemap`: 指出站点地图的 URI

## 18.消息与数据帧

1. Message 消息
   - 1 条消息由 1 个或多个帧组成，这些数据帧属于同一类型
   - 代理服务器可能合并、拆分消息的数据帧
2. Frame 数据帧
   - 持续帧
   - 文本帧、二进制帧
3. 非控制帧的消息分片：有序
   - FIN=1，表示消息结束
   - OP=0, 表示持续帧
   - OP=1, 表示文本帧
   - OP=2, 表示二进制帧
4. 客户端发送的帧必须基于掩码编码
5. 一旦发送或者接收到关闭帧，连接处于`CLOSING`状态
6. 一旦发送了关闭帧，且接收到了关闭帧，连接处于`CLOSED`状态
7. TCP 连接关闭后，`WebSocket`连接才完全关闭

## 19.掩码

1. 客户端消息：MASK 为 1（包括控制帧），传递 32 位无法预测的，随机的`Masking-key`
2. 服务器端消息：MASK 为 0
3. 掩码的作用：防止恶意页面上的代码可以经过浏览器构造出合法的`get`请求，使得代理服务器可以识别出请求并缓存响应
4. 掩码强制浏览器执行以下方法
   - 生成随机的 32 位`frame-masking-key`，不能让 js 代码猜出（否则可以反向构造）
   - 对传输的包体按照`frame-masking-key`执行可对称解密的`XOR`异或操作，使代理服务器不识别

## 20.心跳帧

- 心跳帧可以插在数据帧中传输
  - ping 帧
    - opcode=9
    - 可以含有数据
  - pong 帧
    - opcode=A
    - 必须与 ping 帧数据相同

## 21.关闭会话的方式

1. 控制帧中的关闭帧：在 TCP 连接之上的双向关闭
   - 发送关闭帧后，不能再发送任何数据
   - 接收到关闭帧后，不再接收任何到达的数据
2. TCP 连接意外中断
3. 关闭帧的错误码
   - 1000: 正常关闭
   - 1001：表示浏览器页面跳转或者服务器将要关机
   - 1002：发现协议错误
   - 1003： 接收到不能处理的错误帧

## 22.HTTP2 核心概念

1. 连接`connection`: 1 个 TCP 连接，包含一个或者多个`stream`
2. 数据流`stream`：一个双向通讯数据流，包含 1 条或者多条`message`
3. 消息`message`: 对应 HTTP1 中的请求或者响应，包含 1 条或者多条`frame`
4. 数据`frame`: 最小单位，以二进制压缩格式存放在 HTTP1 中的内容，每一条 frame 都会有 1 个`streamId`

## 23.Stream ID 的作用：实现多路复用

1. 接收端的实现可据此并发组装消息
2. 同一 Stream 内的 frame 必须是有序的（无法并发）
3. `SETTINGS_MAX_CONCURRENT_STREAMS`控制着并发的`stream`数
4. `stream Id`由客户端建立的流必须是基数，由服务器建立的流必须是偶数
5. `stream Id`的约束
   1. 新建立的 id 必须大于曾经建立的状态为`opened`或者`reserved`的流 Id
   2. 在新建立的流上发送帧时，意味着将更小 ID 且为 idle 状态的流置为`closed`状态
   3. stream id 不能复用，长连接耗尽 id 应创建新连接
   4. stream id 为 0 的帧都是控制帧（协助数据传递，用于差错控制和流量控制）

## 24.服务器推送

1. 推送可以基于已经发送的请求，如客户端请求 html，主动推送 js 文件
2. 实现方式
   - 推送资源必须对应一个请求
   - 请求由服务器端`PUSH_PROMISE`帧发送
   - 响应在偶数 ID 的`STREAM`中发送
3. push 推送模式的禁用
   - `SETTINGS_ENABLE_PUSH（0x2）`
     - 1 表示启用推送功能
     - 0 表示禁用推送功能

## 25.流量控制

1. HTTP/1.1 中由 TCP 层拥塞控制进行流量控制
2. HTTP2 中的流控制既针对单个`stream`，也针对整个`TCP`连接
   - 客户端与服务端都具备流量控制的能力
   - 单向流控制：发送和接收独立设定流量控制
   - 以信用为基础：接收端设定上限，发送端应该遵循接收端发出的指令
   - 流量控制窗口（流或者连接）的初始值时 65535 字节
   - 只有 DATA 帧服从流量控制
   - 流量控制不能被禁用

## 26.gRPC 框架

1. 支持多语言编程，基于 HTTP2 通讯的中间件
2. RPC：remote procedure call，由 google 研发
3. gRPC 使用高校的二进制编码，速度更快，并且有更清晰的接口规范，以及对流的支持
4. gRPC 时 RPC 的一种
5. RPC 跨越了传输层和应用层，因分布式、微服务而兴起
6. 简单点来理解，就是比如有一个应用 1，通过网络调用了应用 2 的服务，而不用关心应用 2 的协议
7. RPC 的目的是实现服务可重用和系统间的相互调用

## 27.http2 问题

1. TCP 以及 TCP+TLS 建链握手过多问题，导致握手时间过长问题
2. 多路复用与 TCP 的队头阻塞问题
   - 资源的有序到达，前面 1 个报文丢失，导致并发的流需要等待丢失的报文重新发送
3. TCP 是由操作系统内核实现的，更新缓慢

## 28.QUIC 协议

1. QUIC 协议在 HTTP2 和 UDP 之间

## 29.HTTP3

1. HTTP3 的连接迁移
   - 允许客户端更换 IP 地址、端口后，仍然可以复用前连接
2. 解决了队头阻塞问题的 HTTP3
   - UDP 报文：先天没有队列概念
3. 1RTT 完全握手
4. 0RTT 恢复握手
5. RTT(Round-Trip Time)：往返时延。是指数据从网络一端传到另一端所需的时间。

## 30.负载均衡的作用

1. HTTP 协议转换
   - `request line`起始行
     - `URL`重写（包括`query`参数转换）
     - `method`变换
     - `http version`版本变换
   - `header`头部
     - header 名字、值作转换
     - 负载均衡对`header`做隐藏、新增、修改
   - `body`包体
     - 通过算法转换，如压缩算法
     - 按固定协议对内容进行转换
2. WAF 防火墙（`Web Application Firewall`）
   - `request line`请求行
     - 检查 URL 以及`query`参数是否合法（如 SQL 注入）
     - `method`方法是否合法（如阻止`TRACE`方法）
     - `http version`版本是否合法（如不接收`HTTP/1.0`请求）
   - `header`头部
     - 检查`header`项是否符合应用场景要求
   - `body`包体
     - 对于`FORM`表单等通用格式做过滤
3. 负载均衡算法
   - 用反向代理，提高多台服务器的可伸缩性
   - 流量请求的时候，选择负载最低的服务器
4. 缓存功能

## 31.TLS

1. TLS 的作用
   - 身份验证
   - 保密性
   - 完整性
2. SSL/TLS 在 7 层模型的表示层中，在 4 层模型的应用层中
3. TLS 协议
   - `Record`记录协议
     - 对称加密
   - `Handshake`握手协议
     - 验证通信双方的身份
     - 交换加解密的安全套件
     - 协商加密参数
4. TLS 安全密码套件解读
   - `密钥交换算法_身份验证算法_对称加密算法、强度、工作模式_签名 hash 算法`

## 32.对称加密

1. 对称加密基于 XOR 异或运算
2. 异或运算只需要遍历一遍，执行速度非常快
3. Block cipher 分组加密：将明文分成多个等长的`Block`模块，对每个模块分别加密
4. 目的：当最后一个明文 block 模块长度不足时，需要填充
5. 填充方法：位填充、字节填充
6. CBC 模式：
   - 每个明文块先与前一个密文块进行异或后，再进行加密
   - 问题：加密过程串行化
7. CTR 模式：
   - 通过递增一个加密计算器以产生连续的密钥流
   - 问题：不能提供密文消息完整性校验

## 33.握手优化

1. `session`缓存：以服务器生成的`session ID`为依据,`sessiong id`存放在内存中，占用了内存，针对不同的服务器，负载均衡可能将请求发送到了无`session id`的服务器。
2. `session ticket`，客户端保存握手记录，发送给服务端验证
3. TLS3.0
   - 建立连接时，客户端将密码套件以及客户端密钥发送给服务端，节省了一次 RTT
   - 会话恢复时，客户端带上`PSK`扩展，服务端从`ticket`中算出`psk`,直接使用它来解密，从而实现了`0RTT`会话恢复的过程
4. 上面 3 种方案都面临重放攻击，中间人在路由器或者代理服务器将密钥保存下来，在发送给服务器，因此，上诉三种方案都需要设置合理的过期时间
