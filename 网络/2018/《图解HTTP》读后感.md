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

        | 请求 | TRACE / HTTP/1.1<br/> Host: hackr.jp<br/>Max-Forwards:2                                                                                                |
        | :--- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
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

  | 指令 | 参数 | 说明 |
  |:---------|:---------|:-------|
  |no-cache   |无         |强制向原服务器再次验证|
  |no-store   |无         |不缓存请求或响应的任何内容|
  |max-age=[秒] |必需       |响应的最大Age值 |
  |max-stale(=[秒])|可省略    |接收已过期的响应 |
  |min-fresh=[秒]|必需      |期望在指定时间内的响应仍有效|
  |no-transform |无       |代理不可更改媒体类型 |
  |only-if-cached|无  |从缓存获取资源 |
  |cache-extension|-  |新指令标记（token）|

* 缓存响应指令
  | 指令 | 参数 | 说明 |
  |:-----------|:------------|:--------------------|
  |public     |无     |可向任意方提供响应的缓存   |
  |private    |可省略 |仅向特定用户返回响应   |
  |no-cache   |可省略 |缓存前必须先确认其有效性  |
  |no-store   |无     |不缓存或响应的任何内容 |
  |no-transform|无    |代理不可更改媒体类型   |
  |must-revalidate|无  |可缓存但必须向源服务器进行确认 |
  |proxy-revalidate|无  |要求中间缓存服务器对缓存的响应有效性在进行确认|
  |max-age=[秒] |必需 |响应的最大Age值|
  |s-maxage=[秒]|必需 |公共缓存服务器响应的最大Age值|
  |cache-extension|-  |新指令标记(token) |
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
10. 
