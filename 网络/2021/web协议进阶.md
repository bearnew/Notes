# web协议进阶
## 一、OSI模型（Open System Interconnection Reference Model）概念模型
1. 应用层
    * `Network process to application`
    * `DNS HTTP P2P SMTP Telnet FTP`
2. 表示层
    * `Data representation and encryption`
    * `Recognizing data`: `HTML DOC JPEG MP3 AVI SOCKETS`
3. 会话层
    * `interhost communication`
    * `Session establishment in TCP SIP RTP RPC-Named pipes`
4. 传输层
    * `End-to-end connections and reliablity`
    * `TCP UDP SCTP SSL TLS`
5. 网络层
    * `path determination and logic addressing`
    * `IP ARP IPsec ICMP IGMP OSPF`
6. 数据链路层
    * `physical addressing`
    * `802.11 MAC/LLC WALN `
7. 物理层
    * `Media, signal, and binary tranmission`
    * `RS-232 RJ45 V34 网卡等硬件`
## 二、chrome网络面板
### 1.属性过滤
* 筛选多个属性，通过空格实现AND操作
* `domain`: 仅显示来自指定域的资源。你可以使用通配符字符(*)纳入多个域
* `has-response-header`: 显示包含指定`HTTP`响应标头的资源
* `is`: 使用`is:running`可以查找`websocket`资源，`is:from-cache`可查找缓存读取的资源
* `large-than`: 显示大于指定大小的资源（以字节为单位）。将值设为1000等同于设置为1k
* `method`: 显示通过指定`HTTP`方法类型检索的资源
* `mime-type`: 显示指定`MIME`类型的资源
* `mixed-content`: 显示所有混合内容资源(`mixed-content: all`)，或者仅显示当前显示的资源(`mixed-content: displayed`)
* `scheme`: 显示http（`scheme:http`）或https（`scheme:https`）检索的资源
* `set-cookie-domain`: 显示具有`set-cookie`标头并且`Domain`属性与指定值匹配的资源
* `set-cookie-name`: 显示具有`set-cookie`标头并且名称与指定值匹配的资源
* `set-cookie-value`: 显示具有`set-cookie`标头并且值与指定值匹配的资源
* `status-code`: 仅显示`HTTP`状态码与指定代码匹配的资源
## 2.在请求栏按住`shift`鼠标悬停到指定请求，请求的下游请求会被标记为红色，请求的上游请求会被标记为绿色
## 3.浏览器加载时间
1. 解析`HTML`结构
2. 加载外部脚本与样式表文件
3. 解析并执行脚本代码(部分脚本会阻塞页面的加载)
4. DOM树构建完成（`DOMContentLoaded`事件）
5. 加载图片等外部文件
6. 页面加载完成(`load`事件)
## 4.请求时间详细分布（可点击network面板的timing进行查看）
1. `Queueing`: 浏览器在以下情况下对请求排队
    * 存在更高优先级的请求
    * 此源已打开六个TCP连接，达到限值，仅适用于`http1.0/http1.1`
    * 浏览器正在短暂分配磁盘缓存中的空间
2. `Stalled`: 请求可能会因`Queueing`中描述的任何原因而停止
3. `DNS Lookup`: 浏览器正在解析请求的IP地址
4. `Proxy Negotiation`: 浏览器正在与代理服务器协商请求
5. `Request send`: 正在发送请求
6. `ServiceWorker Preparation`: 浏览器正在启动`Service Worker`
7. `Request to ServiceWorker`: 正在将请求发送到`Service Worker`
8. `Waiting(TTFB)`: 浏览器正在等待响应第一个字节。TTFB（Time to First byte），此时间包括1次往返延迟时间及服务器准备响应所用的时间。
9. `Content Download`: 浏览器正在接收响应
10. `Receiving Push`: 浏览器正在通过`HTTP/2`服务器推送接收此响应的数据
11. `Reading Push`: 浏览器正在读取之前收到的本地数据
## 5.为什么要进行URI编码
* 传递数据中，如果存在用作分隔符的保留字符怎么办
* 对可能产生歧义性的数据编码
    * 不在`ASCII`码范围内的字符，先`UTF8`进行编码，再`US-ASCII`编码
    * `ASCII`码中不可显示的字符
        * 0～31及127(共33个)是控制字符或通信专用字符（其余为可显示字符），如控制符：LF（换行）、CR（回车）、FF（换页）、DEL（删除）、BS（退格)、BEL（响铃）等；通信专用字符：SOH（文头）、EOT（文尾）、ACK（确认）等；ASCII值为8、9、10 和13 分别转换为退格、制表、换行和回车字符。它们并没有特定的图形显示，但会依不同的应用程序，而对文本显示有不同的影响
        * 32～126(共95个)是字符(32是空格），其中48～57为0到9十个阿拉伯数字。
        * 65～90为26个大写英文字母，97～122号为26个小写英文字母，其余为一些标点符号、运算符号等。
    * `URI`中规定的保留字符
    * 不安全字符（传输环节中可能会被不正确处理），如空格、引号、尖括号
