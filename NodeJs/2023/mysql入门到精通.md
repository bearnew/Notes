# mysql 入门到精通

> https://www.sjkjc.com/mysql/int/

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

## 二、SQL 通用语法

1. SQL 语句可以单行或多行书写，以分号结尾
2. SQL 语句可以使用空格、缩进来增强语句的可读性
3. MYSQL 数据库的 SQL 语句不区分大小写，关键字建议使用大写
4. 注释
   1. 单行注释：--注释内容 或 #注释内容(MYSQL 特有)
   2. 多行注释： /_ 注释内容 _/
5. SQL 分类
   |分类|全称|说明|
   |:---|:----|:----|
   |DDL|Data Definition Language|数据定义语言，用来定义数据库对象（数据库，表，字段）|
   |DML|Data Manipulation Language|数据操作语言，用来对数据库表中的数据进行增删改|
   |DQL|Data Query Language|数据查询语言，用来查询数据库中表的记录|
   |DCL|Data Control Language|数据控制语言，用来创建数据库用户、控制数据库的访问权限|

## 三、DDL 语句

1. DDL-数据库操作-查询

```sql
/** 查询所有数据库 */
SHOW DATABASES;
/* 查询当前数据库 */
SELECT DATABASE();
```

2. DDL-数据库操作-创建

```sql
/**
   []中的内容为可选，字符集如：UTF8
*/
CREATE DATABASE [IF NOT EXISTS] 数据库名 [DEFAULT CHARSET 字符集][COLLATE 排序规则];
```

3. DDL-数据库操作-删除

```sql
DROP DATABASE [IF EXISTS] 数据库名;
```

4. DDL-数据库操作-使用

```sql
USE 数据库名;
```

6.
