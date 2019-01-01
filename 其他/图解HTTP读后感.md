## 图解HTTP读后感
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


