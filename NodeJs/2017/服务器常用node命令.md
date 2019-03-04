#### node linux环境
> 守护进程
```
nohup node test.js &
```
> 杀死进程
```
ps -aux | grep node
kill pid
```
> forever守护进程
```
npm install forever -g
forever start ./bin/www
```