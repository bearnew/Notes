#### git基于远端分支创建本地分支
```
git checkout -b 本地分支名x origin/远程分支名x
```
```
git fetch origin 远程分支名x:本地分支名x
```
#### git合并commit
查看提交历史
```
git log 
```
查看最近4次commit
```
git rebase -i HEAD~4
```
> 将pick更改为squash,将这个commit合并到它的上一个commit

> :wq退出，将commit message修改成新的commit message

> :wq退出，git log发现两个commit已经合并
#### git删除分支
删除远程分支
```
git push origin --delete 3-feature-Holmes
git branch -r -d origin/3-feature-Holmes
```
删除本地分支
```
git branch -D 3-feature-Holmes
```
#### git merge master上更新的代码
```
git fetch origin
git reset --hard origin/master
```
#### git 撤销commit到工作区
```
git reflog
git reset --soft [commit_id]
git reset HEAD *
```
#### git 重新提交commit
```
git cherry-pick <commit id>
```

#### Git: fatal: The remote end hung up unexpectedly 解决方法
```
git config --global http.postBuffer 524288000
 
# some comments below report having to double the value:
git config --global http.postBuffer 1048576000
```
#### 在项目目录执行 git config --local user.name "shaun"，来设置真实姓名
#### git subtree用法
* 在项目中添加web library到 src/lib目录：

```git subtree add --prefix src/lib git@code.aliyun.com:yunduo/winged-library-web.git develop --squash```
 
* 在项目中拉取web library的更新到 src/lib目录:

```git subtree pull --prefix src/lib git@code.aliyun.com:yunduo/winged-library-web.git develop --squash```
 
* 在项目中将web library的更新推送到中央仓库:

```git subtree push --prefix src/lib git@code.aliyun.com:yunduo/winged-library-web.git develop --squash```
