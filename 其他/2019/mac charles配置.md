## mac charles配置
1. 关闭mac上的网络代理
2. Proxy => 勾选macOS proxy
3. Proxy => Proxy settings => 设置port
4. 手机连接与mac同一网段的ip，并设置手动代理到mac的ip和上方设置的port
5. Proxy => SSL proxy settings => SSL Proxying => add *:443
6. Help => Install charles root certificate（安装完成后，需要电脑信任证书）
7. Help => Install charles root certificate for a mobile device or remote browser（安装完成后，需要手机信任证书，手机证书命名为Charles）
8. Tools => Map local settings => add 需要mock的url和response
9. Android 7.0之后安装的charles用户证书，仍然不被系统信任，安装成用户证书
