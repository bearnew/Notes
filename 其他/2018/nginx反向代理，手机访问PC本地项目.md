## 1.手动代理
* ### PC下载filder,配置如下:
    <center>
        <img src="https://github.com/bear-new/picture/blob/master/mardown/2018-04-22/filder2.jpg?raw=true" width="100%" height="100%" />
        filder2
    </center>
* ### 手机与PC连接同一局域网，在手机wifi里面设置手动代理
    <center>
        <img src="https://github.com/bear-new/picture/blob/master/mardown/2018-04-22/proxy.jpg?raw=true" width="50%" height="50%" />
        proxy
    </center>
## 2.配置hosts
* ### 找到C:\Windows\System32\drivers\etc\hosts文件，新增一栏``` www.react.com ```:
    <center>
        <img src="https://github.com/bear-new/picture/blob/master/mardown/2018-04-22/hosts.jpg?raw=true" width="100%" height="80%" />
        proxy
    </center>    
## 3.nginx
* ### 下载nginx，安装后，找到nginx文件下的conf/nginx.conf,新增如下:
    <center>
        <img src="https://github.com/bear-new/picture/blob/master/mardown/2018-04-22/nginx.jpg?raw=true" width="100%" height="80%" />
        proxy
    </center>  
* ### 这样就把www.react.com代理到了localhost:9000
## 4.展示
* ### 打开项目，运行本地服务:
    <center>
        <img src="https://github.com/bear-new/picture/blob/master/mardown/2018-04-22/localServer.png?raw=true" width="100%" height="80%" />
        proxy
    </center> 
* ### 手机浏览器输入www.react.com,成功访问本地开发中的项目:
    <center>
        <img src="https://github.com/bear-new/picture/blob/master/mardown/2018-04-22/mobileShow.png?raw=true" width="50%" height="80%" />
        proxy
    </center>