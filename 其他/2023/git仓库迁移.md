# git仓库迁移
1. 将目标仓库中的当前分支切换到一个新分支。
```js
git checkout -b new-branch
```
2. 将源仓库的内容拉取到本地，并在新分支上合并源仓库的内容。
```js
git remote add source <源仓库地址>
git fetch source
git merge source/master --allow-unrelated-histories
```
3. 解决可能产生的合并冲突。
4. 提交合并后的代码到目标仓库。
```js
git push origin new-branch
```
5. 在目标仓库中将新分支合并到主分支。
```js
git checkout master
git merge new-branch
```
6.删除新分支。
```js
git branch -d new-branch
```
