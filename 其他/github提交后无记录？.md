##### github提交后无记录？

##### 原因
commit的用户名和邮箱非github注册的邮箱

> eg. 我的就变成了公司邮箱

![git log](https://github.com/bear-new/picture/blob/master/mardown/2018-07-28%20revert-gihub-commit/git_clone.PNG?raw=true)

##### 解决方案
###### 1.修正用户名和邮箱
* OLD_EMAIL为 git log看到的邮箱
* CORRECT_NAME为 github用户名
* CORRECT_EMAIL为 github注册邮箱
```
#!/bin/sh
git filter-branch --env-filter '
OLD_EMAIL="x**@Ctrip.com"
CORRECT_NAME="bear-new"
CORRECT_EMAIL="651***513@qq.com"
if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
then
 export GIT_COMMITTER_NAME="$CORRECT_NAME"
 export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
then
 export GIT_AUTHOR_NAME="$CORRECT_NAME"
 export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags

```
如果报错```Cannot create a new backup```
需要移除原始backup
```
git update-ref -d refs/original/refs/heads/master
```
![base](https://github.com/bear-new/picture/blob/master/mardown/2018-07-28%20revert-gihub-commit/edit_name_email.PNG?raw=true)
###### 2.重新提交
```
//成功后push修改
git push --force --tags origin 'refs/heads/*'

git pull origin master --allow-unrelated-histories
```
![push](https://github.com/bear-new/picture/blob/master/mardown/2018-07-28%20revert-gihub-commit/git_push.PNG?raw=true)

##### 结局
> 修改前

![pre](https://github.com/bear-new/picture/blob/master/mardown/2018-07-28%20revert-gihub-commit/fix_pre.png?raw=true)

> 修改后

![after](https://github.com/bear-new/picture/blob/master/mardown/2018-07-28%20revert-gihub-commit/fix_after.png?raw=true)

hah，多了5个用公司电脑提交的commit，心情很好。

参考链接: https://www.jianshu.com/p/e6b5e960aa56