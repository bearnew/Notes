# mysql 入门到精通

## 一、数据库概念

1. sql 语句为所有的关系型数据库提供统一的标准
2. 服务启动/停止 mysql
   - command + r
   - services.msc 启动服务
   - 找到 mysql80，右键启动/停止服务
3. 命令启动/停止 mysql
   1. 管理员身份启动`cmd`
   2. 启动`net start mysql80`
   3. 停止`net stop mysql80`
4. mysql 连接
   1. 开始菜单中 mysql 提供的 mysql 客户端命令行工具，输入密码
   2. 控制台输入
      1. 添加环境变量
      ```js
      // 路径
      // C:\Program Files\MySQL\MySQL Server 8.0\bin
      // 电脑-属性-高级系统设置-环境变量-系统环境变量
      ```
      2.
      ```shell
      mysql -h 127.0.0.1 -p 3306 -u root -p
      ```
5. mysql 数据模型-关系型数据库
   - 建立在关系模型基础上，由多张相互连接的二维表组成的数据库
   - ![20230806010634-2023-08-06](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20230806010634-2023-08-06.png)
   - ![20230806010900-2023-08-06](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20230806010900-2023-08-06.png)
6.
7.
