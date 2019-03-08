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

阅读至 44 页 2.8 章节
