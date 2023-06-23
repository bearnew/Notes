# MAC移动硬盘2022.10.04
```js

brew tap gromgit/homebrew-fuse


brew install ntfs-3g-mac

sudo diskutil unmount /dev/disk2s1

sudo /usr/local/Cellar/ntfs-3g-mac/2022.10.3/bin/ntfs-3g /dev/disk2s1 /Volumes/TOSHIBA -olocal -oallow_other -o auto_xattr
```
# mac 移动硬盘

1. 查看硬盘的 `Volume Name`

```js
// TOSHIBA
diskutil list
```

2. 更新 fstab 文件，此步骤需要输入密码

```js
sudo nano /etc/fstab
```

3.在 fstab 文件中写入一下内容(movie 替换为你自己的 Volume Name，建议用英文命名)

```js
// LABEL=TOSHIBA none ntfs rw,auto,nobrowse
LABEL=movie none ntfs rw,auto,nobrowse
```

4. CTRL + X 保存，选择 Y，然后按回车键。
5. 通过`Finder`进入`/Volumes/`，将移动硬盘拖动到桌面或者个人收藏

6. 重新插入硬盘后生效。

