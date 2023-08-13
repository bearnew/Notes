1. 报错：

```js
./support-files/./mysql.server start
Starting MySQL
. ERROR! The server quit without updating PID file (/usr/local/mysql/data/bearnew-MacBookPro.local.pid).
```

2. 将/usr/local/mysql/data/下的所有文件修改权限

```js
// 修改写权限
sudo chmod 777 ./data/*
// 将文件和目录的所有权更改为'_mysql'用户和组
sudo chown -R _mysql ./data/*
```
