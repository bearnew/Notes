# HTTP2基础教程
## 1.HTTP进化史
1. HTTP/0.9
    * 相当简单的协议，只有一个get方法，没有首部
    * 目标是获取`HTML`(没有图片 只有文本)
2. HTTP/1.0
    * 首部
    * 响应码
    * 重定向
    * 错误
    * 条件请求
    * 内容编码（压缩）
    * 更多的请求方法
    * ...
3. HTTP/1.1
    * 缓存相关首部的扩展
    * OPTIONS方法
    * Upgrade首部
    * Range(范围)请求
    * 压缩和传输编码
    * 管道化
4. SPDY(speedy)
    * 多路复用
    * 帧和首部压缩
5. HTTP/2
## 2.HTTP/2快速入门
1. 启动并运行
    * 获取并安装一个支持http2的服务器
    * 下载并安装一张TLS证书，让浏览器和服务器通过http2连接
2. 获取证书
    1. 使用在线证书生成器
        * https://www.sslchecker.com/csr/self_signed
        * 将生成的证书和密钥分别保存到两个本地文件中，分别命名为`privkey.pem`和`cert.pem`
    2. 自签名证书
        * 使用`openssl`生成自签名证书
        ```js
        // 生成新的私钥privkey.pem和新的证书cert.pem
        openssl genrsa -out key.pem 2048
        openssl req -new -x509 -sha256 -key privkey.pem -out cert.pem -days 365 -subj "/CN=fake.example.org" 
        ```  
    3. Let's Encrypt(加密)
        1. 目标是让所有人能够容易、自动、免费的获取TLS证书
        2. 信念是让所有的web通信都经过加密和鉴权
        3. 推荐使用`Certbot`作为`encrypt`的客户端
            1. 下载`Certbot`客户端
                ```shell
                wget https://dl.eff.org/certbot-auto
                chmod a+x certbot-auto 
                ```
            2. 执行`certbot-auto`
                * 参数设置web服务器的文件目录和域名
                ```shell
                ./certbot-auto certonly --webroot -w <your web root> -d <your domain>
                ```
            3. 新制作的证书和私钥会被放到`/etc/letsencrypt/live/<your domain>`
                | 文件                                              | 描述                    |
                | :------------------------------------------------ | :---------------------- |
                | /etc/letsencrypt/live/<your domain>/privkey.pem   | 你的证书的私钥          |
                | /etc/letsencrypt/live/<your domain>/cert.pem      | 你的新证书              |
                | /etc/letsencrypt/live/<your domain>/chain.pem     | Let's Encrypt的CA证书链 |
                | /etc/letsencrypt/live/<your domain>/fullchain.pem | 包含证书和证书链的文件  |
3. 获取并运行HTTP/2服务器
    1. 使用`nghttp2`进行服务器管理
        1. 安装`nghttp2`
            ```shell
            sudo apt-get install nghttp2
            ```
        2. 启动`nghttp2`
            * webroot, 网站路径
            * port, 服务器要监听的端口号
            * key, 生成的私钥路径
            * cert, 生成的证书路径
            ```shell
             ./nghttpd -v -d <webroot> <port> <key> <cert>
            ```
            * example
            ```shell
            ./nghttpd -v -d /usr/local/www 8443 /etc/letsencrypt/live/yoursite.com/privkey.pem /etc/letsencrypt/live/yoursite.com/cert.pem
            ```
## 3.web优化的动机与方式
1. web页面请求
    1. 把待请求URL放入队列中
    2. 解析URL中域名的IP地址
    3. 建立与目标主机的TCP连接
    4. 如果是HTTPS, 初始化并完成TLS握手
    5. 向页面对应的URL发送请求
    6. ![request](https://github.com/bearnew/picture/blob/master/mardown/2020/HTTP2%E5%9F%BA%E7%A1%80%E6%95%99%E7%A8%8B/request_http.PNG?raw=true) 
2. web页面资源响应
    1. 如果接收的是HTML, 解析它，并针对页面中的资源触发优先获取机制
    2. 如果页面上的关键资源已经接收到，则开始渲染页面
    3. 接收其他资源，继续解析渲染，直到结束
    4. ![response](https://github.com/bearnew/picture/blob/master/mardown/2020/HTTP2%E5%9F%BA%E7%A1%80%E6%95%99%E7%A8%8B/response_render.PNG?raw=true)
3. web的每一次点击，都会重复执行上面的流程，给网络带宽和设备资源带来压力, web性能优化的核心是加快甚至去掉其中的步骤
4. 关键性能指标
    * 延迟
        * 延迟是指IP数据包从1个网络端点到另1个网络端点所花费的时间
    * 带宽
        * 只要带宽没有饱和，2个网络端点之间的连接会一次处理尽可能多的数据量
    * DNS查询
        * 域名系统(DNS)把主机名称转换成IP地址
        * 一个域名只需要转换1次
    * 建立连接的时间(TCP 3次握手)
        * 客户端与服务器建立连接3次握手的时间
        * ![three shake hands](https://github.com/bearnew/picture/blob/master/mardown/2020/HTTP2%E5%9F%BA%E7%A1%80%E6%95%99%E7%A8%8B/three_shake_hands.PNG?raw=true)
    * TLS协商时间
        * 客户端发起HTTPS连接，需要进行传输层安全协议(TLS)协商
    * 首字节时间(TTFB)
        * 客户端从开始定位到web页面，至接收到主体页面响应的第一字节所耗费的时间
        * 包含了之前提到的各种耗时，还要加上服务器处理时间
        * TTFB是指从浏览器发起请求到收到第一字节之间的耗时
    * 内容下载时间(TTLB)
        * 请求资源最后字节的到达时间
    * 开始渲染时间
        * 客户端屏幕什么时候开始显示内容
        * 指标测量的是用户看到空白页面的时长
    * 文档加载完成时间
        * 页面加载完成的时间
5. HTTP/1的问题
    1. 队头阻塞
        * 现代浏览器针对单个域名开启6个连接，但每个连接仍会收到队头阻塞的影响
    2. 低效的TCP利用
        * TCP是最可靠的协议，但传输速度并不快
        * TCP拥塞窗口
            * 在接收方确认数据包之前，发送方可以发出的TCP包的数量
        * TCP慢启动
            * 用来探索当前连接对应拥塞窗口的合适大小
            * 新连接收到1个确认回复后，可以发送2个数据包，收到2个确认回复后，可以发送4个
                达到协议规定的发包数上限时，连接将进入拥塞避免阶段 
    3. 臃肿的消息首部
    4. 受限的优先级设置
        * 浏览器为了请求优先级高的资源，会推迟请求其他资源, 加重了资源的排队效应
    5. 第三方资源
6. web性能优化的最佳实践
    1. DNS查询优化
        1. 限制域名的数量
        2. 保证低限度的解析延迟，依赖外部供应商
        3. 在HTML中加入DNS预读取命令
            ```js
            <link rel="dns-prefetch" href="//ajax.googleapis.com">
            ``` 
    2. 优化TCP连接
        1. 使用`preconnect`指令，使连接在使用之前就建立好
            ```js
            <link rel="preconnect" href="//fonts.example.com" crossorigin>
            ```
            ```js
            // preload, 设定资源加载的高优先级
            <link rel="preload" href="image.png">
            ```
        2. 尽早终止并响应，借助CDN
        3. 实施最新的TLS最佳实践来优化HTTPS
    3. 避免重定向
        * 利用CDN代替客户端在云端实现重定向
        * 如果是同一域名的重定向，使用web服务器上的rewrite规则，避免重定向
    4. 客户端缓存
        * 可通过HTTP首部指定`cache control`以及`max-age`, 或者`expires`首部
    5. 网络缓存, 可用CDN实现
    6. 条件缓存（协商缓存）
        * `Last-Modified-Since`
        * `Etag`
    7. 压缩和代码极简化
    8. 避免阻塞CSS/JS
        1. css放到head标签中，并且需要放在任何js或者图片被请求和处理之前
        2. js执行顺序无关紧要，必须在onload事件触发前执行，可以设置`async`属性
            ```js
            <script async src="/js/myfile.js">
            ```
        3. js执行顺序很重要，并且接受脚本在dom加载完成后运行
            ```js
            <script defer src="/js/myjs.js">
            ```
    9. 图片优化
        1. https://tinypng.com/
            * 移除题材地理位置信息、时间戳、尺寸、像素信息
        2. 针对不同的用户设备、网络状况、预期的视觉质量，提供裁剪过的图片
7. 反模式
    >HTTP2对每个域名只会开启一个连接，以下的做法只适合HTTP/1.1，而不适合HTTP2
    1. 生成精灵图和资源合并/内联
        * HTTP2可以并行处理，图片不必合成一张图来减少请求
        * css js资源文件不必内嵌在HTML中，为了让资源文件使用缓存
    2. 域名拆分
        * 域名拆分是为了利用浏览器针对每个域名开启多个连接的能力来并行下载资源
        * 在HTTP2中继续使用该模式的话，需要确保这些域名共享同一张证书, 这样可以节省为单位域名连接建立的时间
        * HTTP2可以充分利用单个socket连接
    3. 禁用cookie的域名
        * HTTP/1的请求和响应首部从不会被压缩, 所以对图片之类不需要cookie的资源设置禁用cookie
        * HTTP2的首部被压缩，并且客户端和服务器都会保留首部历史，避免重复传输已知信息，所以HTTP2不必考虑禁用cookie 
## 4.HTTP/2迁移
1. 浏览器的支持情况
    * 浏览器80%以上都支持HTTP2
    * 不支持HTTP2的浏览器都会退回到HTTP1
2. 迁移到TLS
    1. 获取证书
        1. 创建证书签名请求（CSR）
        2. 验证身份和证书所有者
        3. 从证书颁发机构CA购买证书
    2. 保护私钥
        * 私钥的存放方式需要安全
    3. 为增加的服务器负载做准备
        * 保持TLS连接开启尽可能长的时间
        * 使用会话凭证
        * 使用内置加解密支持的芯片
    4. 紧跟潮流, 紧跟HTTPS最新、最伟大的变化
    5. 定期检测
        * 定期检测TLS的配置
3. 撤销针对HTTP/1.1的优化
    1. 资源合并
    2. 域名拆分
    3. 禁用cookie的域名
    4. 生成精灵图
4. 迁移的同时，要保证支持HTTP/1.1的旧版客户端
## 5.HTTP/2协议
1. HTTP/2分层
    1. HTTP/2分成2部分
        * 分帧层
            * HTTP2多路复用能力的核心技术
        * 数据层或http层
            * HTTP及其关联数据的部分 
    2. HTTP/2分层的好处
        * 二进制协议
            * HTTP2的分帧层是基于帧的二进制协议, 方便了机器解析
        * 首部压缩
            * 减少了传输中的冗余字节
        * 多路复用
            * 请求和响应交织到了一起
        * 加密传输 
2. 连接
    1. 客户端发送一个`connection preface`(连接前奏)
3.  