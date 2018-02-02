#### MongoDB的基本功能
> 特点
* 使用BSON存储数据
* 支持相对丰富的查询操作
* 支持索引
* 副本集
* 分片
* 无模式
* 部署简单方便

#### 启动mongodb
```js
MongoDB/bin/mongod --dbpath MongoDB/data/db
```
#### mongodb服务器上守护进程
> 创建一个conf配置文件,然后运行命令:
```js
./bin/mongod --config mydb.conf
```
```js
复制代码
# mongodb.conf

# Where to store the data.
dbpath=/var/lib/mongodb

#where to log
logpath=/var/log/mongodb/mongodb.log

logappend=true

bind_ip = 127.0.0.1
#port = 27017

# Enable journaling, http://www.mongodb.org/display/DOCS/Journaling
journal=true

# Enables periodic logging of CPU utilization and I/O wait
#cpu = true

# Turn on/off security.  Off is currently the default
#noauth = true
#auth = true

# Verbose logging output.
#verbose = true

# Inspect all client data for validity on receipt (useful for
# developing drivers)
#objcheck = true

# Enable db quota management
#quota = true

# Set oplogging level where n is
#   0=off (default)
#   1=W
#   2=R
#   3=both
#   7=W+some reads
#oplog = 0

# Diagnostic/debugging option
#nocursors = true

# Ignore query hints
#nohints = true

# Disable the HTTP interface (Defaults to localhost:27018).
#nohttpinterface = true

# Turns off server-side scripting.  This will result in greatly limited
# functionality
#noscripting = true

# Turns off table scans.  Any query that would do a table scan fails.
#notablescan = true

# Disable data file preallocation.
#noprealloc = true

# Specify .ns file size for new databases.
# nssize = <size>

# Accout token for Mongo monitoring server.
#mms-token = <token>

# Server name for Mongo monitoring server.
#mms-name = <server-name>

# Ping interval for Mongo monitoring server.
#mms-interval = <seconds>

# Replication Options

# in replicated mongo databases, specify here whether this is a slave or master
#slave = true
#source = master.example.com
# Slave only: specify a single database to replicate
#only = master.example.com
# or
#master = true
#source = slave.example.com

# Address of a server to pair with.
#pairwith = <server:port>
# Address of arbiter server.
#arbiter = <server:port>
# Automatically resync if slave data is stale
#autoresync
# Custom size for replication operation log.
#oplogSize = <MB>
# Size limit for in-memory storage of op ids.
#opIdMem = <bytes>

# SSL options
# Enable SSL on normal ports
#sslOnNormalPorts = true
# SSL Key file and password
#sslPEMKeyFile = /etc/ssl/mongodb.pem
#sslPEMKeyPassword = pass
复制代码
```
#### 本地数据库导入到服务器Mongodb中
1. 备份本地数据库
> git切换到mongodb/data,输入：
```js
../bin/mongodump -h 127.0.0.1:27017 -d databaseName -o ../data/backup
```
2. git打包数据库
```js
tar zcvf backup.tar.gz backup
```
3. 上传到服务器
```js
scp -P 3999 /D/MongoDB/data/backup.tar.gz root@120.78.177.221:/usr/local/mongodb/data
```
***
剩余步骤在服务器操作
4. ssh登陆服务器后，解压数据库
```js
cd /usr/local/mongodb/data
tar xvf backup.tar.gz
```
5. 将数据导入到服务器的mongodb中(需要先启动Mongodb)
```js
mongorestore --host 127.0.0.1:27017 -d databaseName ../data/backup
```
