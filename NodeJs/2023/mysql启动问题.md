1. mysql 下载:

- https://downloads.mysql.com/archives/community/

2. 报错：

```js
./support-files/./mysql.server start
Starting MySQL
. ERROR! The server quit without updating PID file (/usr/local/mysql/data/bearnew-MacBookPro.local.pid).
```

3. 将/usr/local/mysql/data/下的所有文件修改权限

```shell
// 修改写权限
cd /usr/local/mysql/
// 第1步修改data的权限
sudo chmod 777 ./data
// 第2步修改data子目录文件夹和文件的权限
sudo chmod 777 ./data/*
sudo chmod 777 ./data/*/**

// 将文件和目录的所有权更改为'_mysql'用户和组
sudo chown -R _mysql ./data/*
sudo chown -R _mysql ./data/*/**

./mysql.server start
```
