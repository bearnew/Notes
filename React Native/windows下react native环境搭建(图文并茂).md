#### Tip:
文章中所有示例的变量值均是我的安装路径 ,具体值请以实际安装路径为准
***
#### 1.安装Java jdk
* 下载java jdk 1.8+版本
* 配置环境变量（新建JAVA_HOME）
![GPY61LS2LJ9~PRHM_Y%{A}L.png](http://upload-images.jianshu.io/upload_images/5725832-72e1883e03bceda0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
* 配置环境变量（新建CLASSPATH）
变量值``` .;%JAVA_HOME%\lib\dt.jar;%JAVA_HOME%\lib\toos.jar```
![Paste_Image.png](http://upload-images.jianshu.io/upload_images/5725832-47ffd8f4a769bca6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
* win+r输入cmd，在dos窗口输入``` java -version ```查看java jdk是否安装成功
![4(@TZX4SX]D5HG9)`))`U@B.png](http://upload-images.jianshu.io/upload_images/5725832-152309d1d014ac7d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
##### 2.安装Android sdk
* 安装Android Studio并勾选上sdk，或者单独下载Android sdk安装包
* 配置环境变量（新建ANDROID_HOME）
变量值```C:\Users\Administrator.SC-201207261047\AppData\Local\Android/sdk1```（andriod sdk的安装路径）
* 配置环境变量（增加tools,platform-tools）
在path中增加sdk下tools,platform-tools的环境变量路径,以;隔开
例：
```
C:\Users\Administrator.SC-201207261047\AppData\Local\Android\sdk1\platform-tools;
C:\Users\Administrator.SC-201207261047\AppData\Local\Android\sdk1\tools
```
![Paste_Image.png](http://upload-images.jianshu.io/upload_images/5725832-71fde5ba873c0a7c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
##### 3.设置Android sdk
* 如果安装的sdk包就打开sdk manager,如果通过Android Studio安装的sdk则打开Android Studio>file>settings>Android SDK

![Paste_Image.png](http://upload-images.jianshu.io/upload_images/5725832-141a9433b23259dd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![Paste_Image.png](http://upload-images.jianshu.io/upload_images/5725832-949bde7cd3795d5c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##### 4.安装python
* 不支持python3,建议安装python2.7

##### 5.安装node
* 安装node4.0+

##### 6.安装git
* 在windows下安装python,node,git,为了提高效率，建议都通过下载安装包来安装

##### 7.安装react-native脚手架
```
 npm install -g react-native-cli
```
##### 8.初始化项目
```
react-native init myProject
```
##### 9.运行项目
```
cd myProject
react-native start
react-native run-android
```
* 初次运行react-native run-android需要安装Gradle依赖包，由于墙的原因请使用科学上网方法，或者参照
http://www.jianshu.com/p/ca62e4c1e44b

* 显示build successful表示安装成功

![Paste_Image.png](http://upload-images.jianshu.io/upload_images/5725832-db3d1459fca67662.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##### 10.连接设备
* 如果用的是react-native官网推荐的genymotion模拟器，则需要修改adb下Android Sdk路径
* 如果安装了virtualbox后还是不能打开虚拟设备，则先进入bios,然后进入cpu选项，使virtualization technology enable,然后在virtualBox中选择Settings-General-Basic-Version, 选择other linux(64 bit), 


![Paste_Image.png](http://upload-images.jianshu.io/upload_images/5725832-38c9032eba1dc12f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
* 使用真机调试，则需要打开usb调试，如果是小米则需要进入安全中心》应用权限管理》myProject》显示悬浮窗（打开）
* 小米手机还需要进入设置》开发者选项》启动MIUI优化（关闭）
* 如果运行了翻墙工具，如VPN，连接的时候需要退出VPN
* 此时在dos命令中输入
```
adb devices // 查看连接上的设备
```

![Paste_Image.png](http://upload-images.jianshu.io/upload_images/5725832-26ef6d10c621d198.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

* 设置完成后，点击手机上安装好的apk，不出意外会报错


![QQ图片20170421152205.jpg](http://upload-images.jianshu.io/upload_images/5725832-6e7c8492393a142a.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
* 此时，将手机和电脑连接上同一网络，在dos中输入：
```
adb reverse tcp:8081 tcp:8081
```
如果连接成功，并且react-native服务运行成功，则在手机浏览器上输入(注：10.0.4.87为我的IP，需要替换成你自己电脑的IP)：
```
http://10.0.4.87:8081/index.android.bundle?platform=android&dev=false&hot=false&minify=false
```
显示如下，则表示连接成功：

![Paste_Image.png](http://upload-images.jianshu.io/upload_images/5725832-362bf40c9b2b60e0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

*  重新打开APK，摇晃手机，模拟器上选择menu菜单
![QQ图片20170421152609.jpg](http://upload-images.jianshu.io/upload_images/5725832-fe23351013a525dc.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
* 点击debug server host & port for device选项，输入你PC端的IP

![Paste_Image.png](http://upload-images.jianshu.io/upload_images/5725832-1deb11c4bdb6dfe3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
* 然后重新打开dev settings>reload，大功告成！


![Paste_Image.png](http://upload-images.jianshu.io/upload_images/5725832-dd51306a69de8b18.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)