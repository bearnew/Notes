#### git 基于远端分支创建本地分支

```
git checkout -b 本地分支名x origin/远程分支名x
```

```
git fetch origin 远程分支名x:本地分支名x
```

#### git 合并 commit

查看提交历史

```
git log
```

查看最近 4 次 commit

```js
// 改变了当前分支的branch out节点
// rebase过程会出现多次解决同一个地方的冲突，可以使用squash解决
git rebase -i HEAD~4
```

> 将 pick 更改为 squash,将这个 commit 合并到它的上一个 commit

> :wq 退出，将 commit message 修改成新的 commit message

> :wq 退出，git log 发现两个 commit 已经合并

#### git 删除分支

删除远程分支

```
git push origin --delete 3-feature-Holmes
git branch -r -d origin/3-feature-Holmes
```

删除本地分支

```
git branch -D 3-feature-Holmes
```

#### git merge master 上更新的代码

```
git fetch origin
git reset --hard origin/master
```

#### git 撤销 commit 到工作区

```
git reflog
git reset --soft [commit_id]
git reset HEAD *
```

#### git 将在其他分支上的 commit 修改，移植到当前的分支

```js
// 将其他分支的commit移植到当前分支
git cherry-pick [commit_id]

// 保留原提交的作者信息进行提交
git cherry-pick -x [commit_id]

// 设定一个开始和结束的commit, 进行cherry-pick操作, 不会包含start-commit-id的commit
git cherry-pick <start-commit-id>...<end-commit-id>

// 设定一个开始和结束的commit, 进行cherry-pick操作, 包含start-commit-id的commit
git cherry-pick <start-commit-id>^...<end-commit-id>
```

#### Git: fatal: The remote end hung up unexpectedly 解决方法

```
git config --global http.postBuffer 524288000

# some comments below report having to double the value:
git config --global http.postBuffer 1048576000
```

#### 在项目目录执行 git config --local user.name "shaun"，来设置真实姓名

#### git subtree 用法

- 在项目中添加 web library 到 src/lib 目录：

`git subtree add --prefix src/lib git@code.aliyun.com:yunduo/winged-library-web.git develop --squash`

- 在项目中拉取 web library 的更新到 src/lib 目录:

`git subtree pull --prefix src/lib git@code.aliyun.com:yunduo/winged-library-web.git develop --squash`

- 在项目中将 web library 的更新推送到中央仓库:

`git subtree push --prefix src/lib git@code.aliyun.com:yunduo/winged-library-web.git develop --squash`

#### git 本地识别大小写

- `git config core.ignorecase false`
- `git rm --cached src/components/book_b/Coupon/couponList -r`

#### git 缓存

```js
// 把暂存区和工作区的改动缓存起来
git stash

// 显示缓存的内容
git stash list

// 将最新的缓存内容放回工作区
git stash pop

// 放回指定的缓存内容到工作区, stashId通过git stash list查看
// git stash pop stash@{[stashId]}
git stash pop stash@{1}

// 删除一个缓存的内容
// git stash drop stash@{[stashId]}
git stash drop stash@{0}
```

#### git revert

```js
// -m后面跟一个Parent Number标识出主线
// 一般使用1保留主分支代码
git revert -m 1 <commitHash>
```

#### git reflog

```js
// 记录所有commit操作记录，便于错误操作后找回记录
git reflog
```

#### git commit

```js
// 修改commit message
git commit --amend --only -m 'xxxxxxxx'
```

#### git stash 高阶

```shell
# 保存当前未commit的代码
git stash

# 保存当前未commit的代码并添加备注
git stash save "备注的内容"

# 列出stash的所有记录
git stash list

# 删除stash的所有记录
git stash clear

# 应用最近一次的stash
git stash apply

# 应用最近一次的stash，随后删除该记录
git stash pop

# 删除最近的一次stash
git stash drop

$ git stash list
stash@{0}: WIP on ...
stash@{1}: WIP on ...
stash@{2}: On ...

$ git stash apply stash@{1}
```
