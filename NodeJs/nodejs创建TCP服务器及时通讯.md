#### 效果如下:
![image](https://github.com/bear-new/picture/blob/master/mardown/2018-05-26/tcpSocket.PNG?raw=true)
#### 服务端
```js
var net = require('net');

var HOST = '127.0.0.1';
var PORT = 3000;

var server = net.createServer(function(sock) {

    // 连接client
    console.log('connect: ' + sock.remoteAddress + ':' + sock.remotePort);

    // data为client发送过来的数据
    sock.on('data', function(data) {
        // 打印client接收到的数据
        console.log(sock.remoteAddress + ':' + sock.remotePort + ': ' + data);
        // 发送数据给client
        sock.write('i\'m server, you said:' + data);
    });

    // 关闭连接
    sock.on('close', function(data) {
        console.log('close: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });

}).listen(PORT, HOST);


```

#### 客户端
```js
var net = require('net');
process.stdin.resume();

var HOST = '127.0.0.1';
var PORT = 3000;

var client = net.Socket();
client.connect(PORT, HOST, function() {
    console.log('connection TO: ' + HOST + ':' + PORT);
});

// 键盘输入，按下enter发送给服务端
process.stdin.on('data', function(data) {
    client.write(data);
});

// data是服务器发回的数据
client.on('data', function(data) {
    console.log('server: ' + data);

    // client输入stop,则关闭连接
    if (data.indexOf('stop') !== -1) {
        client.destroy();
    }
});

// 连接关闭
client.on('close', function() {
    console.log('Connection closed');
});


```
