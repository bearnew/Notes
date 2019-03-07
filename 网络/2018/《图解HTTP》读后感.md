# 图解HTTP读后感
## 一、了解web及网络基础
### 1.TCP/IP 的分层管理（分为4层）
#### 1.应用层
> 应用层决定了向用户提供应用服务时通信的活动。

> TCP/IP 协议族内预存了各类通用的应用服务
* FTP（File Transfer Protocol，文件传输协议）
* DNS（Domain Name System，域名系统）
* HTTP
#### 2.传输层
> 传输层对上层应用层，提供处于网络连接中的两台计算机之间的数据传输
* TCP（Transmission Control Protocol，传输控制协议）
* UDP（User Data Protocol，用户数据报协议）
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
1. IP地址指节点被分配到的地址
2. MAC地址指网卡所属的固定地址
3. IP间依赖MAC地址采用ARP协议通信
4. ARP是一种解析地址的协议，根据通信的IP地址可以反查出对应的MAC地址
#### 2.TCP（传输层）
1. tcp提供可靠的字节流服务
2. tcp将大块数据分割成以报文段为单位的数据包进行管理
3. tcp3次握手（保证通信的可靠性）

![three way handshaking](https://github.com/bearnew/picture/blob/master/mardown/2018-12-20%20http%E8%AF%BB%E5%90%8E%E6%84%9F/tcp_%20three_way_handshaking.png?raw=true)
#### 3.DNS（和HHTP一样属于应用层协议）
1. DNS提供域名到IP地址之间的解析服务
#### 4.各种协议与HTTP协议的关系

![communication](https://github.com/bearnew/picture/blob/master/mardown/2018-12-20%20http%E8%AF%BB%E5%90%8E%E6%84%9F/http_protocol.png?raw=true)

### 3.URI 和 URL
#### 1.URI
1. 由某个协议方案表示的资源的定位标识符
2. 协议方案指访问资源所使用的协议类型名称
3. 采用HTTP协议时，协议方案就是http
4. URI用字符串标识某一互联网资源
#### 2.URL
1. URL表示资源的地点, URL是URI的子集
## 二、简单的HTTP协议
### 1.HTTP协议用于客户端和服务器端通信
### 2.通过请求和响应达成通信
1. 请求报文的组成
    * 请求方法
    * 请求URL
    * 协议版本
    * 可选的请求首部字段
    * 内容实体
2. 响应报文的组成
    * 协议版本
    * 状态码
    * 解释状态码的原因短语
    * 可选的响应首部字段
    * 实体主体
### 3.HTTP无状态协议
### 4.HTTP通过URI（我们使用URL）定位互联上的资源
1. 对服务器本身发起请求，可以用*来代替请求URI。
2. 查询HTTP服务器端支持的HTTP方法的种类
```
OPTIONS * HTTP/1.1
```
#### 5.HTTP方法
1. GET: 获取资源
2. POST: 传输实体主体
3. PUT: 传输文件
    * 像FTP协议的文件上传一样
    * http/1.1的PUT方法自身不带验证机制，任何人都可以上传文件，存在安全性问题
    * 响应返回状态码204 No Content（比如： 该html已存在于服务器上）
4. HEAD: 获得报文首部
    * 和GET方法一样，不返回报文主体部分
    * 用于确认URL的有效性及资源更新的日期时间
    * 响应返回Index.html有关的响应首部
5. DELETE: 删除文件
    * 请求url删除指定资源
    * 响应返回状态码 204 No Content（比如 ：该 html 已从该服务器上删除）
6. OPTIONS: 询问支持的方法
    * OPTIONS方法用来查询针对请求URL指定的资源支持的方法

    | 请求 | OPTIONS * http/1.1<br/> Host: www.hackr.jp |
    | :--- | :---- |
    | 响应 | HTTP/1.1 200OK<br/>Allow:GET,POST,HEAD,OPTIONS(返回服务器支持的方法) |
7. TRACE: 追踪路径
    * 让web服务器端将之前的请求通信环回给客户端的方法
    * 容易引发XST（cross-site tracing, 跨站追踪）攻击
    * 在Max-Forwards首部字段中填入数值
    * 每经过一个服务器端就将该数字减1，减到0时，就停止继续传输
    * 最后接收到请求的服务器端则返回状态码200OK的响应

    | 请求 | TRACE / HTTP/1.1<br/> Host: hackr.jp<br/>Max-Forwards:2 |
    | :--- | :---- |
    | 响应 | HTTP/1.1 200OK<br/>Content-Type:message/http<br/>Content-Length: 1024<br/>TRACE / HTTP/1.1<br/>Host:hackr.jp<br/>Max-Forwards: 2(返回响应包含请求内容) |
8.CONNECT: 要求用隧道协议连接代理
    * 与代理服务器通信时建立隧道, 实现用隧道协议进行TCP通信
    * 主要用SSL（Secure Sockets Layer，安全套接层）和TLS（Transport Layer Security, 传输层安全）通信协议将通信内容加密后经网络隧道传输
    * CONNECT 代理服务器名:端口号 HTTP版本

    | 请求 | CONNECT proxy.hackr.jp:8080 HTTP/1.1 <br/> Host: proxy.hackr.jp |
    |:-----|:----|
    | 响应 | HTTP/1.1 200 OK（之后进入网络隧道）|

#### 6.使用方法下达命令

![http method](https://github.com/bearnew/picture/blob/master/mardown/2018-12-20%20http%E8%AF%BB%E5%90%8E%E6%84%9F/http_method.png?raw=true)

#### 7.持久连接
1. HTTP的初始版本，每进行一次HTTP通信，都要进行TCP的连接和断开
2. HTTP1.1提出了持久连接（HTTP keep-alive）,只要任意一端没提出断开连接，则保持TCP连接状态
3. 持久连接旨在建立1次TCP连接，进行多次请求和响应的交互
4. 持久连接的优点
    * 减少TCP连接断开的开销，减轻服务器负载
    * 节省了HTTP请求和响应的时间
#### 8.管线化
* 同时并行发送多个请求