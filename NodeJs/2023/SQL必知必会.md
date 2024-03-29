# SQL 必知必会

[TOC]

## 1.了解 SQL

1. `SQL`语言分为 4 部分

   - `DDL`，英文叫做 `Data Definition Language`，也就是数据定义语言，它用来定义我们的数据库对象，包括数据库、数据表和列。通过使用 `DDL`，我们可以创建，删除和修改数据库和表结构。
   - `DML`，英文叫做 `Data Manipulation Language`，数据操作语言，我们用它操作和数据
     库相关的记录，比如增加、删除、修改数据表中的记录。
   - `DCL`，英文叫做 `Data Control Language`，数据控制语言，我们用它来定义访问权限和
     安全级别。
   - `DQL`，英文叫做 `Data Query Language`，数据查询语言，我们用它查询想要的记录，它
     是 SQL 语言的重中之重。在实际的业务中，我们绝大多数情况下都是在和查询打交道，
     因此学会编写正确且高效的查询语句，是学习的重点。

2. 常用的`DBMS`
   - Mysql: 关系型(Relational)
   - Microsoft SQL Server: 关系型
   - MongoDB: 文档型(Document)
   - Elasticsearch: 搜索引擎(Search Engine)
   - Redis: 键值型(Key-Value)
   - SQLite: 关系型(Relational)
   - Hive: 关系型
   - HBase: 列存储(Wide Column)
3. 键值型数据库
   - 查找速度快
   - 无法根据条件过滤
4. 文档型数据库

   - 管理文档，一个文档相当于一条记录<!-- pagebreak -->

5. 搜索引擎
   - 全文搜索的技术，核心原理是“倒排索引”
6. 列式数据库
   - Oracle、MySQL、SQL Server 等数据库都是采用的行式存储（Row-based）
   - 列式数据库是将数据按照列存储到数据库中，可以大量降低系统的 I/O，适合于分布式文件系统
   - 功能相对有限。
7. 图形数据库
   - 利用了图这种数据结构存储了实体（对象）之间的关系。最典型的例子就是社交网络中人与人的关系，数据模型主要是以节点和边（关系）来实现，特点在于能高效地解决复杂的关系问题。
8. SQL 执行过程

   - ![20230923012539-2023-09-23](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20230923012539-2023-09-23.png)
   - 语法检查：检查 SQL 拼写是否正确，如果不正确，`Oracle` 会报语法错误。
   - 语义检查：检查 SQL 中的访问对象是否存在。比如我们在写 `SELECT` 语句的时候，列名写错了，系统就会提示错误。语法检查和语义检查的作用是保证 `SQL` 语句没有错误。
   - 权限检查：看用户是否具备访问该数据的权限。
   - 共享池检查：共享池（Shared Pool）是一块内存池，最主要的作用是缓存 SQL 语句和该语句的执行计划。Oracle 通过检查共享池是否存在 SQL 语句的执行计划，来判断进行软解析，还是硬解析。那软解析和硬解析又该怎么理解呢？在共享池中，Oracle 首先对 SQL 语句进行 Hash 运算，然后根据 Hash 值在库缓存（Library Cache）中查找，如果存在 SQL 语句的执行计划，就直接拿来执行，直接进入“执行器”的环节，这就是软解析。如果没有找到 SQL 语句和执行计划，Oracle 就需要创建解析树进行解析，生成执行计划，进入“优化器”这个步骤，这就是硬解析。
   - 优化器：优化器中就是要进行硬解析，也就是决定怎么做，比如创建解析树，生成执行计划。
   - 执行器：当有了解析树和执行计划之后，就知道了 SQL 该怎么被执行，这样就可以在执行器中执行语句了。

9. 绑定变量就是在 SQL 语句中使用变量，通过不同的变量取值来改变 SQL 的执行结果。这样做的好处是能提升软解析的可能性，不足之处在于可能会导致生成的执行计划不够优化

```sql{.line-numbers}
-- 普通用法
select * from player where player_id = 10001;
```

```sql
-- 绑定变量的用法
-- 如果你在查询 player_id = 10001 之后，还会查询 10002、10003 之类的数据，那么每一次查询都会创建一个新的查询解析。而第二种方式使用了绑定变量，那么在第一次查询之后，在共享池中就会存在这类查询的执行计划，也就是软解析。

select * from player where player_id = :player_id;
```

10. MySQL 流程
    - ![20230923013729-2023-09-23](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20230923013729-2023-09-23.png)
    - 连接层：客户端和服务器端建立连接，客户端发送 SQL 至服务器端；
    - SQL 层：对 SQL 语句进行查询处理；
    - 存储引擎层：与数据库文件打交道，负责数据的存储和读取。
11. 与 Oracle 不同的是，MySQL 的存储引擎采用了插件的形式

    1. InnoDB 存储引擎：它是 MySQL 5.5 版本之后默认的存储引擎，最大的特点是支持事务、行级锁定、外键约束等。
    2. MyISAM 存储引擎：在 MySQL 5.5 版本之前是默认的存储引擎，不支持事务，也不支持外键，最大的特点是速度快，占用资源少。
    3. Memory 存储引擎：使用系统内存作为存储介质，以便得到更快的响应速度。不过如果 mysqld 进程崩溃，则会导致所有的数据丢失，因此我们只有当数据是临时的情况下才使用 Memory 存储引擎。
    4. NDB 存储引擎：也叫做 NDB Cluster 存储引擎，主要用于 MySQL Cluster 分布式集群环境，类似于 Oracle 的 RAC 集群
    5. Archive 存储引擎：它有很好的压缩机制，用于文件归档，在请求写入时会进行压缩，所以也经常用来做仓库。

## 2.DDL 语法

1. 增删改分别对应`CREATE DROP ALTER`

```sql
CREATE DATABASE nba; // 创建一个名为 nba 的数据库
DROP DATABASE nba; // 删除一个名为 nba 的数据库
```

2. 数据类型中 int(11) 代表整数类型，显示长度为 11 位，括号中的参数 11 代表的是最大有效显示长度，与类型包含的数值范围大小无关
3. varchar(255)代表的是最大长度为 255 的可变字符串类型。NOT NULL 表明整个字段不能是空值，是一种数据约束。AUTO_INCREMENT 代表主键自动增长。

```sql
CREATE TABLE player (
 player_id int(11) NOT NULL AUTO_INCREMENT,
 player_name varchar(255) NOT NULL
);

```

```sql
DROP TABLE IF EXISTS `player`;
CREATE TABLE `player` (
 `player_id` int(11) NOT NULL AUTO_INCREMENT,
 `team_id` int(11) NOT NULL,
 `player_name` varchar(255) CHARACTER SET utf8 COLLATE
 `height` float(3, 2) NULL DEFAULT 0.00,
 PRIMARY KEY (`player_id`) USING BTREE,
 UNIQUE INDEX `player_name`(`player_name`) USING BTREE
-- 其中 player_name 字段的字符集是 utf8，排序规则是utf8_general_ci，代表对大小写不敏感，如果设置为utf8_bin，代表对大小写敏感
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_g
```

4. 修改表结构-添加字段

```sql
ALTER TABLE player ADD (age int(11));
```

5. 修改字段名

```sql
ALTER TABLE player RENAME COLUMN age to player_age
```

```sql
ALTER TABLE player MODIFY (player_age float(3,1));
```

6. 删除字段

```sql
ALTER TABLE player DROP COLUMN player_age;
```

7. 主键约束
   - 主键起的作用是唯一标识一条记录，不能重复，不能为空，即 UNIQUE+NOT NULL
   - 一个数据表的主键只能有一个，主键可以是一个字段，也可以由多个字段复合组成
8. 外键约束
   - 外键确保了表与表之间引用的完整性
   - 一个表中的外键对应另一张表的主键
   - 外键可以是重复的，也可以为空。比如 player_id 在 player 表中是主键，如果你想设置一个球员比分表即 player_score，就可以在 player_score 中设置 player_id 为外键，关联到 player 表中。
9. 唯一性约束。
   - 已经有了主键，还可以对其他字段进行唯一性约束
   - 在 player 表中给 player_name 设置唯一性约束，就表明任何两个球员的姓名不能相同
   - 唯一性约束相当于创建了一个约束和普通索引，目的是保证字段的正确性，而普通索引只是提升数据检索的速度，并不对字段的唯一性进行约束。
10. NOT NULL 约束。

    - 对字段定义了 NOT NULL，即表明该字段不应为空，必须有取值。

11. DEFAULT，表明了字段的默认值
12. CHECK 约束，用来检查特定字段取值范围的有效性，

```sql
CHECK(height>=0 AND height<3)。
```

13. 表的设计原则
    1. 数据表的个数越少越好
    2. 数据表中字段个数越少越好
    3. 联合主键字段个数越少越好
    4. 使用主键和外键越多越好

## 3.select

1. 查询

```sql
SELECT name FROM heros;
SELECT name, hp_max, ma_max FROM heros;
SELECT * FROM heros;
SELECT name as n, hp_max AS hm FROM heros;
-- 查询的列再增加1个Platfrom字段
SELECT "王者荣耀" as platform, name FROM heros;
```

2. 去除重复行

- `DISTINCT`需要放在所有列名的前面
- `DISTINCT`对后面所有列名的组合去重

```sql
SELECT DISTINCT attack_range FROM heros;
-- 会找出所有attack_range+name不重复的列
SELECT DISTINCT attack_range, name FROM heros;
```

3. 排序检索

- `ORDER BY`后面跟多个列名，会先按第一列排序，第一列值相同，再按第二列排序
- `ASC`(默认)代表递增排序，`DESC`代表递减排序
- 非选择的列同样可以放在`ORDER BY`后排序
- `ORDER BY`需要放在`SELECT`的最后 1 条语句

```sql
SELECT name, hp_max FROM heros ORDER BY mp_max DESC;

SELECT name, hp_max FROM (SELECT name, hp_max FROM heros ORDER BY hp_max) WHERE ROWNUM <= 5;
```

4. 关键字的执行顺序

- `FROM` -> `WHERE` -> `GROUP BY` -> `HAVING` -> `SELECT的字段` -> `DISTINCT`

5. `SELECT`语句执行时，每个步骤都会产生虚拟表，将虚拟表作为下一个步骤输入
6. 比较运算符

|         含义         | 运算符  |
| :------------------: | :-----: |
|         等于         |    =    |
|        不等于        | <>或!=  |
|         小于         |    <    |
|   小于等于(大不于)   | <=或!>  |
|         大于         |    >    |
|   大于等于(不小于)   | >=或!<  |
|        不小于        |   !<    |
| 在指定的两个数值之间 | BETWEEN |
|        为空值        | IS NULL |

```sql
SELECT name, hp_max FROM heros WHERE hp_max BETWEEN 5399 AND 6811;
SELECT name, hp_max FROM heros WHERE hp_max IS NULL;
```

7. 逻辑运算符

|       含义       | 逻辑运算符 |
| :--------------: | :--------: |
|       并且       |    AND     |
|       或者       |     OR     |
| 在指定条件范围内 |     IN     |
|     非(否定)     |    NOT     |

```sql
SELECT name, role_main, role_assist, hp_max, mp_max
FROM heros
WHERE (role_main IN ('法师', '射手') OR role_assist IN ('法师', '射手'))
AND DATE(birthdate) NOT BETWEEN '2016-01-01' AND '2017-01-01'
ORDER BY (hp_max + mp_max) DESC
```

8. 使用通配符

- 使用`%`通配符匹配任意字符串出现的任意次数
- `_`通配符值代表 1 个字符
- 通配符会消耗数据库更长的时间，如果 LIKE 检索的字段进行了索引，则`LIKE`后面就不能以`%`开头，不如不能使用`LIKE '%太%'` 或`LIKE '%太'`会对全表扫描，使用`LIKE '太%'`同时检索的字段进行了索引，不会对全表扫描

```sql
SELECT name FROM heros WHERE name LIKE '% 太 %';

-- 查找英雄名除第一个字以外，包含`太`的英雄
SELECT name FROM heros WHERE name LIKE '_% 太 %';
```

-

## 4.sql 函数

1. 算术函数

| 函数名  |                                定义                                |
| :-----: | :----------------------------------------------------------------: |
|  ABS()  |                              取绝对值                              |
|  MOD()  |                                取余                                |
| ROUND() | 四舍五入为指定的小数位数，需要有两个参数，分别为字段名称、小数位数 |

```sql
-- 2
SELECT ABS(-2);
-- 2
SELECT MOD(101, 3);
-- 37.3
SELECT ROUND(37.25, 1);
```

2. 字符串函数

|    函数名     |                                              定义                                               |
| :-----------: | :---------------------------------------------------------------------------------------------: |
|   CONCAT()    |                                       将多个字符拼接起来                                        |
|   LENGTH()    |                  计算字段的长度，一个汉字算三个字符，一个数字或字母算一个字符                   |
| CHAR_LENGTH() |                          计算字段的长度，汉字、数字、字母都算一个字符                           |
|    LOWER()    |                                   将字符串中的字符转化为小写                                    |
|    UPPER()    |                                   将字符串中的字符转化为大写                                    |
|   REPLACE()   | 替换函数，有 3 个参数，分别为：要替换的表达式或字段名、想要查找的被替换字符串、替换成哪个字符串 |
|  SUBSTRING()  |  截取字符串，有 3 个参数，分别为：待截取的表达式或字段名、开始截取的位置、想要截取的字符串长度  |

```sql
-- abc123
SELECT CONCAT('abc', 123);
-- 6
SELECT LENGTH('你好');
-- 2
SELECT CHAR_LENGTH('你好');
-- abc
SELECT LOWER('ABC');
-- ABC
SELECT UPPER('abc');
-- f123d
SELECT REPLACE('fabcd', 'abc', 123);
-- fab
SELECT SUBSTRING('fabcd', 1,3);
```

3.日期函数

|       函数名        |               定义                |
| :-----------------: | :-------------------------------: |
|   CURRENT_DATE()    |           系统当前日期            |
|   CURRENT_TIME()    |   系统当前时间，没有具体的日期    |
| CURRENT_TIMESTAMP() | 系统当前时间，包括具体的日期+时间 |
|      EXTRACT()      |       抽取具体的年、月、日        |
|       DATE()        |        返回时间的日期部分         |
|       YEAR()        |        返回时间的年份部分         |
|       MONTH()       |        返回时间的月份部分         |
|        DAY()        |        返回时间的天数部分         |
|       HOUR()        |        返回时间的小时部分         |
|      MINUTE()       |        返回时间的分钟部分         |
|      SECOND()       |         返回时间的秒部分          |

```sql
-- 运行结果为 2019-04-03。
SELECT CURRENT_DATE()
-- 运行结果为 21:26:34
SELECT CURRENT_TIME()
-- 运行结果为 2019-04-03 21:26:34
SELECT CURRENT_TIMESTAMP()
-- 运行结果为 2019
SELECT EXTRACT(YEAR FROM '2019-04-03')
-- 运行结果为 2019-04-01
SELECT DATE('2019-04-01 12:00:05')
```

4. 转换函数

|   函数名   |                                               定义                                                |
| :--------: | :-----------------------------------------------------------------------------------------------: |
|   CAST()   | 数据类型转换，参数是一个表达式，表达式通过 AS 关键词分割了 2 个参数，分别是原始数据和目标数据类型 |
| COALESCE() |                                        返回第一个非空数值                                         |

```sql
-- 运行结果为 123.12。
SELECT CAST(123.123 AS DECIMAL(8,2))
-- 运行结果为 1
SELECT COALESCE(null,1,2)
```

5. sql 函数实际应用

```sql
-- ROUND(attack_growth,1)中的attack_growth代表想要处理的数据，
-- “1”代表四舍五入的位数，也就是我们这里需要精确到的位数。
SELECT name, ROUND(attack_growth, 1) FROM heros;

-- “最大生命值”对应的列数为hp_max
-- 运行结果为 9328
SELECT MAX(hp_max) FROM heros;

-- 筛选最大生命值的英雄列
SELECT CHAR_LENGTH(name), name, hp_max FROM heros WHERE hp_max=(SELECT MAX(hp_max) FROM heros);

-- 英雄的上线日期
SELECT name, EXTRACT(YEAR FROM birthdate) AS birthdate FROM heros WHERE birthdate is NOT NULL;

SELECT name, YEAR(birthdate) AS birthdate FROM heros WHERE birthdate is NOT NULL;

SELECT * FROM heros WHERE DATE(birthdate) > '2016-10-01';

-- 平均值
SELECT AVG(hp_max), AVG(mp_max), MAX(attack_max) FROM heros WHERE DATE(birthdate) > '2016-10-01';
```

6. 大小写问题
   1. MYSQL 在`Linux`下，数据库名、表名、变量名是严格区分大小写的，字段名是忽略大小写的
   2. MYSQL 在`Windows`下全部不区分大小写
7. 大小写规范
   1. 关键字和函数名称全部大写
   2. 数据库名、表名、字段名全部小写
   3. SQL 语句必须以分号结尾

## 5.子查询

1. 最大身高

```sql
SELECT max(height) FROM player;
```

2.球队平均身高

```sql
SELECT avg(height) FROM player AS b WHERE a.team_id = b.team_id;
```

3. `EXISTS`子查询

```sql
EXISTS (SELECT player_id FROM player_score WHERE player.player_id = player_score.player_id)
```

```sql
NOT EXISTS (SELECT player_id FROM player_score WHERE player.player_id = player_score.player_id)
```

4. 集合比较子查询

- IN：判断是否在集合中
- ANY：需要与比较操作符一起使用，与子查询返回的任何值做比较
- ALL：需要与比较操作符一起使用，与子查询返回的所有值做比较
- SOME：实际上是 ANY 的别名，作用相同，一般常使用 ANY

```sql
SELECT * FROM A WHERE cc IN (SELECT cc FROM B);
```

5. 子查询作为字段

```sql
SELECT team_name, (SELECT count(*) FROM player WHERE player-team_id=team.team_id) as player_num FROM player;
```

## 6.视图

1. 视图
   - 对`SELECT`的语句进行了封装
   - 视图作为一张虚拟表，帮我们封装了底层与数据表的接口。它相当于是一张表或多张表的数据结果集。
   - 小型项目的数据库可以不使用视图，但是在大型项目中，以及数据表比较复杂的情况下，视图的价值就凸显出来了，它可以帮助我们把经常查询的结果集放到虚拟表中，提升使用效率。理解和使用起来都非常方便。
2. 创建视图

```sql
CREATE VIEW player_above_avg_height AS SELECT player_id, height FROM player WHERE height > (SELECT AVG(height) from player)
```

```sql
-- 直接使用视图进行查询
SELECT * FROM player_above_avg_height
```

3. 删除视图

```sql
DROP VIEW player_above_avg_height;
```

4. 利用视图完成复杂的连接

```sql
-- 在身高等级表中的最低身高和最高身高的球员
CREATE VIEW player_height_grades AS SELECT p.player_name, p.height, h.height_level FROM player as p JOIN height_grades as h ON height BETWEEN h.height_lowest AND h.height_highest
```

5. 利用视图对数据格式化

```sql
CREATE VIEW player_team AS SELECT CONCAT(player_name, '(' , team.team_name , ')')
```

```sql
SELECT * FROM player_team
```

```sql
CREATE VIEW game_player_score AS SELECT game_id, player_id, (shoot_hits-shoot_3_hits)*2
```

```sql
SELECT * FROM game_player_score
```

6. 视图的好处
   1. 安全性：针对不同用户开放不同数据查询权限
   2. 简单清晰：精简复杂的 SQL 语句，格式化数据

## 7.存储过程

1. 一旦存储过程被创建出来，使用它就像使用函数一样简单，我们直接通过调用存储过程名即可。
2. 创建 1 个存储过程

```sql
CREATE PROCEDURE `add_num`(IN nINT)
BEGIN
   DECLARE i INT;
   DECLARE sum INT;
   SET i = 1;
   SET sum = 0;
   WHILE i <= n DO
      SET sum = sum + i;
      SET i = i + 1;
   END WHILE;
   SELECT sum;
DELIMITER;
```

```sql
CALL add_sum(50);
```

```sql
CREATE PROCEDURE `get_hero_scores` (
   OUT max_max_hp FLOAT,
   OUT min_max_mp FLOAT,
   OUT avg_max_attack FLOAT,
   s VARCHAR(255)
)
BEGIN
   SELECT MAX(hp_max), MIN(mp_max), AVG(attack_max) FROM heros WHERE role_main = s;
END
```

```sql
CALL get_hero_scores(@max_max_hp, @min_max_mp, @avg_max_attack, '战士');
SELECT @max_max_hp, @min_max_mp, @avg_max_attack;
```

3. 存储过程流程图
   - ![20231024015345-2023-10-24](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231024015345-2023-10-24.png)
4.

## 8.事务处理

1. 事务的特性: `ACID`
   1. A: 原子性`Atomicity`。不可分割的进行数据处理的最小基本单位，
   2. C: 一致性`Consistency`。事务操作后，变成另一种一致状态
   3. I: 隔离性`Isolation`。事务隔离，对其他事务不可见，不受其他事务影响，保证事务的顺序执行
   4. D: 持久性`Durability`。事务提交之后，对数据的修改是持久性的，宕机后也可以通过日志恢复数据
2. 一致性
   - 事务中某个操作失败，系统自动撤销正在执行的事务，返回事务之前的状态
3. 持久性
   - 通过事务日志保证，日志包括回滚日志和重做日志
   - 对数据库修改时，首先将数据库变化信息记录到重做日志，再对数据库进行修改，即使数据库崩溃，数据库重启后找到重做日志，重新执行。
4. 事务的控制语句
   1. `START TRANSACTION` 或者 `BEGIN`，作用是显式开启一个事务。
   2. `COMMIT`：提交事务。当提交事务后，对数据库的修改是永久性的。
   3. `ROLLBACK` 或者 `ROLLBACK TO [SAVEPOINT]`，意为回滚事务。意思是撤销正在进行的所有没有提交的修改，或者将事务回滚到某个保存点。
   4. `SAVEPOINT`：在事务中创建保存点，方便后续针对保存点进行回滚。一个事务中可以存在多个保存点。
   5. `RELEASE SAVEPOINT`：删除某个保存点。
   6. `SET TRANSACTION`，设置事务的隔离级别。
5. mysql 是隐式事务，自动提交
6. Oracle 是显示事务，不自动提交，需要手写 COMMIT 命令
7. completion_type
   - completion=0，需要使用 START TRANSACTION 或者 BEGIN 来开启下一次事务
   - completion=1，会开启一个相同隔离级别的事务
   - completion=2，提交后自动与服务器断开
   ```sql
   CREATE TABLE test(name varchar(255), PRIMARY KEY (name)) ENGINE=InnoDB;
   SET @@completion_type = 1;
   BEGIN;
   INSERT INTO test SELECT '关羽';
   COMMIT;
   INSERT INTO test SELECT '张飞';
   INSERT INTO test SELECT '张飞';
   ROLLBACK;
   SELECT * FROM test;
   ```
8. ![20231024021126-2023-10-24](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231024021126-2023-10-24.png)
9. 事务处理的异常
   - 脏读：读到了其他事务还没有提交的数据。
   - 不可重复读：在同一个事务中，对某数据进行读取，发现两次读取的结果不同，也就是说没有读到相同的内容。这是因为有其他事务对这个数据同时进行了修改或删除
   - 幻读：事务 A 根据条件查询得到了 N 条数据，但此时事务 B 更改或者增加了 M 条符合事务 A 查询条件的数据，这样当事务 A 再次进行查询的时候发现会有 N+M 条数据，产生了幻读。
     - 另外一个事务在第一个事务要处理的目标数据范围之内新增了数据，然后先于第一个事务提交造成的问题。
     - 事务 A 开始更改表中所有数据的性别字段，当负责执行事务 A 的线程正在更改最后一条表数据时，此时事务 B 来了，正好向用户表中插入了一条「性别=男」的数据并提交了，然后事务 A 改完原本的最后一条数据后，当再次去查询用户表时，结果会发现表中依旧还存在一条「性别=男」的数据，似乎又跟产生了幻觉一样。
10. 事务隔离级别

- 读未提交：也就是允许读到未提交的数据，这种情况下查询是不会使用锁的，可能会产生脏读、不可重复读、幻读等情况。
- 读已提交：可以避免脏读的产生，属于 RDBMS 中常见的默认隔离级别（比如说 Oracle 和 SQL Server），但如果想要避免不可重复读或者幻读，就需要我们在 SQL 查询的时候编写带加锁的 SQL 语句（我会在进阶篇里讲加锁）。
- 可重复读：保证一个事务在相同查询条件下两次查询得到的数据结果是一致的，可以避免不可重复读和脏读，但无法避免幻读。MySQL 默认的隔离级别就是可重复读。
- 可串行化：将事务进行串行化，也就是在一个队列中按照顺序执行，可串行化是最高级别的隔离等级，可以解决事务读取中所有可能出现的异常情况，但是它牺牲了系统的并发性。

|                            | 脏读 | 不可重复读 | 幻读 |
| :------------------------- | :--- | :--------- | :--- |
| 读未提交(READ UNCOMMITTED) | 允许 | 允许       | 允许 |
| 读已提交(READ COMMITTED)   | 禁止 | 允许       | 允许 |
| 可重复读(REPEATABLE READ)  | 禁止 | 禁止       | 允许 |
| 可串行化(SERIALIZABLE)     | 禁止 | 禁止       | 禁止 |

11. 实现-锁: 阻止其他事务对数据进行操作

- RU: 事务读取的时候不加锁
- RC: 事务读取时加行级共享锁(读到才加锁)，一旦读完，立刻释放
- RR: 事务读取时加行级共享锁，直到事务结束才释放
- SE: 事务读取时加表级共享锁，直到事务结束才释放

12. 实现-MVCC：生成数据快照，并用这个快照提供一致性读取，也成为了多版本的数据控制
13. 参考：https://juejin.cn/post/7152765784299667487?searchId=2023102502393545400F3CE1AB327AB227

## 9.游标

1. 游标
   - 从数据结果集中每次提取一条数据记录进行操作
   - 临时数据库对象，指向存储在数据库表中的数据行指针

```sql
SELECT id, name, hp_max FROM heros WHERE hp_max > 8500;
```

```sql
-- 定义游标
DECLARE cursor_name CURSOR FOR SELECT hp_max FROM heros;
```

```sql
-- 打开游标
OPEN cursor_name;
```

```sql
-- 从游标中获取数据
FETCH cursor_name INTO var_name...
```

```sql
-- 关闭游标
CLOSE cursor_name;
```

```sql
-- 释放游标
DEALLOCATE PREPARE;
```

2. 流程图

- ![20231105011335-2023-11-05](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231105011335-2023-11-05.png)

## 10.查询优化、通配符、存储过程

1. 插叙效率
   - SELECT COUNT(\*) = SELECT COUNT(1) > SELECT COUNT(具体字段)
2. 加上`LIMIT 1`，查找后，就不会继续扫描全表
3. 通配符
   - (\_)匹配任意一个字符
   - (%)匹配大于等于 0 个任意字符

```sql
-- 无法匹配 太乙真人
-- 可以匹配东皇太一
-- 可以匹配 太乙真人太太
SELECT name FROM heros WHERE name LIKE '_% 太 %';
```

4. FileSort 排序一般在内存中，占用 CPU 多，Index 排序更快

## 11.数据库调优

1. 调优目标：响应更快、吞吐量更大
2. 数据库监控
   1. 用户的反馈
   2. 日志分析
   3. 服务器资源使用监控
   4. 数据库内部状况监控
3. 数据库调优维度
   1. 选择适合的 DBMS
      1. 采用 SQL Server，单表存储上亿数据，无需分库分表
      2. 事务处理的选择 InnoDB，非事务处理选择 MyISAM
      3. NoSQL 阵营包括键值型数据库、文档型数据库、搜索引擎、列式存储和图形数据库的各自特点
   2. 优化表的设计
      1. 表结构遵循第三范式，让数据结构更加清晰规范、减少冗余字段
      2. 分析查询应用比较多，采用反范式进行优化，反范式采用空间换时间，增加冗余字段提高查询效率
      3. 表字段数据类型的选择。字段有限采用数值 > 长度固定的 CHAR 类型 > 长度不固定的 VARCHAR 类型
   3. 优化逻辑查询
      1. 小表驱动大表
      2. WHERE 子句中使用函数
   4. 优化物理查询
      1. 数据重复度高，就不需要创建索引
      2. WHERE 子句对索引字段进行了表达式计算，会造成索引失效
      3. 要注意联合索引对索引使用的影响。我们在创建联合索引的时候会对多个字段创建索引，这时索引的顺序就很重要了。比如我们对字段 x, y, z 创建了索引，那么顺序是(x,y,z) 还是 (z,y,x)，在执行的时候就会存在差别。
      4. 要注意多个索引对索引使用的影响。索引不是越多越好，因为每个索引都需要存储空间，索引多也就意味着需要更多的存储空间。此外，过多的索引也会导致优化器在进行评估的时候增加了筛选出索引的计算时间，影响评估的效率。
   5. 使用 Redis 或 Memcached 作为缓存
      - Redis 支持持久化
      - Memcached 内存存储，适合响应时间短，吞吐量大的场景
4. ![20231108112048-2023-11-08](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231108112048-2023-11-08.png)

## 12.范式设计

1. 范式：数据表的设计结构需要满足的某种设计标准的级别
2. 范式设计越高阶，冗余度就越低
3. 超键：包括球员编号或者身份证号的任意组合，比如（球员编号）（球员编号，姓名）（身份证号，年龄）等。
4. 候选键：候选键就是（球员编号）或者（身份证号）
5. 主键：也就是从候选键中选择一个，比如（球员编号）
6. 外键：外键就是球员表中的球队编号。
7. ![20231109014334-2023-11-09](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231109014334-2023-11-09.png)
8. 反范式：用空间来换时间

## 13.索引

1. 索引相当于目录，快速定位与查找
2. 不应该创建索引的场景
   1. 数据行数少，如不到 1000 行
   2. 数据重复度大，如性别，100 万数据创建性别索引后，先访问 50 万次索引，再访问 50 万次数据表，开销很大
3. 索引的价值是帮助快速定位，定位的数据太多，就失去了使用价值
4. 索引的种类
   1. 普通索引：用于提高查询效率
   2. 唯一索引：在普通索引基础上增加数据唯一性约束，一张表可以有多个唯一索引
   3. 主键索引：在唯一索引的基础上增加不为空的约束，一张表最多一个主键索引
   4. 全文索引：如 ES（ElasticSearch）、Solr 全文搜索引擎
5. 主键索引只能有 1 个：数据存储在文件中，只能按照一种顺序进行存储
6. 索引的物理实现方式
   1. 聚集索引
   2. 非聚集索引
7. 聚集索引的叶子节点存储的就是我们的数据记录，非聚集索引的叶子节点存储的是数据位置。非聚集索引不会影响数据表的物理存储顺序。
8. 一个表只能有一个聚集索引，因为只能有一种排序存储的方式，但可以有多个非聚集索引，也就是多个索引目录提供数据检索。
9. 使用聚集索引的时候，数据的查询效率高，但如果对数据进行插入，删除，更新等操作，效率会比非聚集索引低。
10. 按字段个数划分
    1. 单个索引
    2. 联合索引：最左匹配原则，如刚才举例的 (x, y, z)，如果查询条件是 WHERE x=1 AND y=2 AND z=3，就可以匹配上联合索引；如果查询条件是 WHERE y=2，就无法匹配上联合索引。
11. ![20231113012803-2023-11-13](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231113012803-2023-11-13.png)

## 14.B+树索引

1. 使用二叉树作为索引的实现结构，会让树很高，增加硬盘的 I/O 次数，影响数据查询时间
2. 把 1 个节点的 2 个子节点，改成 M 个子节点，就变成了 B 树(Balance Tree)，平衡的多路搜索树
3. 文件系统和数据库系统的索引结构经常采用 B 树来实现
4. 3 阶的 B 树
   - ![20231113014215-2023-11-13](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231113014215-2023-11-13.png)
5. 在 3 阶的 B 树中的查找步骤
   1. 我们与根节点的关键字 (17，35）进行比较，9 小于 17 那么得到指针 P1；
   2. 按照指针 P1 找到磁盘块 2，关键字为（8，12），因为 9 在 8 和 12 之间，所以我们得到指针 P2；
   3. 按照指针 P2 找到磁盘块 6，关键字为（9，10），然后我们找到了关键字 9
6. B 树相比于平衡二叉树来说磁盘 I/O 操作要少，在数据查询中比平衡二叉树效率要高。
7. B+树
   1. K 个孩子节点就有 K 个关键字
   2. 非叶子节点仅用于索引，不保存数据记录
   3. 每一层父节点的关键字都会出现在下一层的子节点的关键字中
   4. B+ 树的中间节点并不直接存储数据，B+ 树查询效率更稳定。因为 B+ 树每次只有访问到叶子节点才能找到对应的数据，而在 B 树中，非叶子节点也会存储数据，这样就会造成查询效率不稳定的情况
   5. B+ 树的查询效率更高，查询所需要的磁盘 I/O 也会更少
8. B+树
   1. ![20231113015058-2023-11-13](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231113015058-2023-11-13.png)
9. B+树的查找
   1. 与根节点的关键字 (1，18，35) 进行比较，16 在 1 和 18 之间，得到指针 P1（指向磁盘块 2）
   2. 找到磁盘块 2，关键字为（1，8，14），因为 16 大于 14，所以得到指针 P3（指向磁盘块 7）
   3. 找到磁盘块 7，关键字为（14，16，17），然后我们找到了关键字 16，所以可以找到关键字 16 所对应的数据。
10. ![20231113015241-2023-11-13](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231113015241-2023-11-13.png)

## 15.Hash 索引

1. Hash 是 1 个散列函数
2. Hash 算法: MD5、SHA1、SHA2、SHA3
3. hash 算法：相同的输入永远可以得到相同的输出
4. Hash 值的字节数可以是 4 8 16 20 位
5. Hash 索引与 B+树的区别
   1. Hash 索引是无序的，无法进行范围查找，B+树是有序链表，可以范围查找
   2. Hash 索引不支持联合索引的最左原则，是将索引值合并后再一起计算 Hash 值
   3. Hash 索引不支持 ORDER BY 排序
   4. Hash 索引无法进行 LIKE 模糊查询
6. Hash 索引应用场景
   1. Redis
   2. `Mysql`的`Memory`存储引擎
   3. Mysql 的 InnoDB 的自适应 Hash 索引，当某个索引值使用非常频繁，会再创建一个 Hash 索引

## 16.索引的使用原则

1. 创建索引的场景
   1. 字段的数值有唯一性限制，如用户名，可以直接创建唯一性索引或者主键索引
   2. 频繁作为 WHERE 查询条件的字段，尤其在数据表大的情况
   3. 需要经常 GROUP BY 分组查询 和 ORDER BY 数据排序
      ```sql
      SELECT user_id, count(*) as num FROM product_comment GROUP BY user_id ORDER BY comment_text LIMIT 100;
      ```
   4. UPDATE DELETE 的 WHERE 条件列，一般也需要创建索引
      ```sql
      UPDATE product_comment SET product_id = 10002 WHERE comment_text = '462ee7ac6e791292';
      ```
      ```sql
      DELETE FROM product_comment WHERE comment_text = '462eed7ac6e791292a79';
      ```
   5. `DISTINCT`字段需要创建索引
      ```sql
      SELECT DISTINCT(user_id) FROM `product_comment`
      ```
   6. 多表 JOIN 连接操作时，创建索引
      1. 连接表的数量不超过 3 张，每增加一张表就增加了一次嵌套循环
      2. 对 `WHERE` 条件创建索引
      3. 对用于连接的字段创建索引
2. 多个单列索引在多条件查询时只会生效一个索引
3. 不需要创建索引的场景
   1. `WHERE`条件中用不到的字段
   2. 表记录太少
   3. 字段中有大量重复数据，如性别
   4. 频繁更新的字段
4. 索引失效
   1. 索引进行了表达式计算
   2. 对索引使用了函数
   3. 在`WHERE`子句中，在 `OR` 前的条件列进行了索引，在 `OR` 后的条件列没有进行索引，那么索引会失效
      - 有条件列没有进行索引，就会全表扫描
   4. 使用`LIKE`进行模糊查询，后面不能是%
      - 使用`LIKE '%太%'` 或`LIKE '%太'`会对全表扫描，使用`LIKE '太%'`同时检索的字段进行了索引，不会对全表扫描
   5. 索引列与 NULL 或者 NOT NULL 进行判断的时候也会失效
      - 索引不存储空值，字段设置为 NOT NULL 约束，将 INT 类型默认值设为 0，字符类型的默认值设为空字符串''
   6. 联合索引最左原则，否则失效
5. ![20231115015856-2023-11-15](https://raw.githubusercontent.com/bearnew/picture/master/picGo/20231115015856-2023-11-15.png)

## 17.从数据页的角度理解 B+树查询

1. 在数据库中，不论读一行，还是读多行，都是将这些行所在的页进行加载。也就是说，数据库管理存储空间的基本单位是页（Page）。
2. 表空间 -> 段 -> 区 -> 页 -> 行
3. B+树的检索方式
   - 首先是从 B+ 树的根开始，逐层检索，直到找到叶子节点，也就是找到对应的数据页为止
   - 将数据页加载到内存中，页目录中的槽（slot）采用二分查找的方式先找到一个粗略的记录分组
   - 然后再在分组中通过链表遍历的方式查找记录。
4. 普通索引和唯一索引在查询效率上有什么不同？
   - 唯一索引就是在普通索引上增加了约束性，也就是关键字唯一，找到了关键字就停止检索。
   - 普通索引的字段上进行查找也就是在内存中多几次“判断下一条记录”的操作，消耗的时间是可以忽略不计的
