## 1.手动代理
* ### PC下载filder,配置如下:
    ![filder2](https://github.com/bear-new/picture/blob/master/mardown/2018-04-22/filder2.jpg?raw=true =200*200)
* ### 手机与PC连接同一局域网，在手机wifi里面设置手动代理
    ![proxy](https://github.com/bear-new/picture/blob/master/mardown/2018-04-22/proxy.jpg?raw=true)
## 2.配置hosts
* ### 找到C:\Windows\System32\drivers\etc\hosts文件，新增一栏www.react.com:
    ![hosts](https://github.com/bear-new/picture/blob/master/mardown/2018-04-22/hosts.jpg?raw=true)
## 3.nginx
* ### 下载nginx，安装后，找到nginx文件下的conf/nginx.conf,新增如下:
    ![nginx](https://github.com/bear-new/picture/blob/master/mardown/2018-04-22/nginx.jpg?raw=true)
* ### 这样就把www.react.com代理到了localhost:9000
## 4.展示
* ### 打开项目，运行本地服务:
    ![server](https://github.com/bear-new/picture/blob/master/mardown/2018-04-22/localServer.png?raw=true)
* ### 手机浏览器输入www.react.com,成功访问本地开发中的项目:
    ![show](https://github.com/bear-new/picture/blob/master/mardown/2018-04-22/mobileShow.png?raw=true)