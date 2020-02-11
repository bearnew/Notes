# Flutter
## 1.Flutter介绍
1. 跨平台：Linux、Android、IOS、Fuchsia
2. 原生用户界面：体验更好，性能更佳
    * `Flutter`可以达到120fps(每秒画面数)
3. 开源免费：完全开源，可以商用
    * `Flutter`的第三方组件`awesome-flutter`
    * 阿里的咸鱼，腾讯，京东在使用
## 2.Flutter与主流框架对比
* Cordova: 混合式开发框架（Hybrid App）
* RN(React Native): 生成原生的APP, 但以View为基础嵌入
* Flutter: 在渲染技术上选择了自己实现（GDI）
## 3.开发环境
1. Java环境安装
    * `java jdk`
2. `Flutter SDK`安装
    * 下载安装
    * 配置系统环境变量
    * 在终端输入`flutter doctor`进行环境检测
3. 其他安装
    * `Android Studio`下载安装
    * 在`Android Studio`中搜索`flutter`插件，并进行安装
    * 安装Android证书
        ```js
        flutter doctor --android-licenses
        ```
    * 可在`Android Studio`中使用AVD虚拟机
4. VSCode
    1. 安装`Flutter`插件
    2. 运行`flutter create demo`新建flutter项目
    3. 配置虚拟机
    4. 运行`flutter run`启动项目
    5. 可以使用`flutter upgrade`进行flutter升级
## 4.Flutter实现Hello World
```js
import 'package:flutter/material.dart';

void main() => runApp(new MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      title: 'Welcome to Flutter',
      home: new Scaffold(
        appBar: new AppBar(
          title: new Text('Welcome to Flutter'),
        ),
        body: new Center(
          child: new Text('Hello World'),
        ),
      ),
    );
  }
}
```