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