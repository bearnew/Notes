## React Native
> Learn once, write anywhere
### 1.RN混合开发
1. 通用的UI界面与业务逻辑由RN实现，与手机平台关联的处理由原生代码实现
2. 将由原生代码实现的UI小部件，包装成RN的自定义组件
3. RN界面与原生界面可相互切换
4. react native的ui组件通过js bridge与原生平台ui组件一一对应 
  ![theory](https://github.com/bearnew/picture/blob/master/mardown/2019-08-18%20react%20native/theory2.png?raw=true)
5.  
  ![event](https://github.com/bearnew/picture/blob/master/mardown/2019-08-18%20react%20native/event.png?raw=true)
### 2.RN 优劣点
* 优点： 
  1. RN相比webview，能够得到原生的用户体验，能够与原生代码双向通信，无缝衔接。 
  2. 高效的移动应用开发调试
  3. 灵活高效的应用热更新
  4. 有效降低移动应用安装包体积
  5. 对于javascript开发学习门槛低，开发难度低
* 缺点：
  1. 内存消耗略大
  2. 运行速度略慢
### 3.开发环境
#### 1.概览
* https://reactnative.cn/docs/getting-started.html
* mac支持ios, android调试
* windows不支持ios调试，需安装虚拟机VMWare + Mac
* 可以搭配react dev tools的插件进行开发调试
#### 2.react-native-cli
* 安装: https://facebook.github.io/react-native/docs/getting-started
#### 3.expo
* expo是使用同一代码库，构建、部署、快速迭代iOS, Android, web的工具和服务
* 官方文档：https://docs.expo.io/versions/latest/
* 安装`expo`（真机、模拟器均支持）: https://docs.expo.io/versions/v34.0.0/introduction/installation/
### 4.Flex布局

 