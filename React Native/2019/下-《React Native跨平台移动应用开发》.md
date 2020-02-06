# React Native跨平台移动应用开发
## 1. 手势识别
1. `PanResponder API`
    * 将多种触摸行为协调成一个手势
    * 也可以用于识别简单的多点触摸手势
2. `PanResponder`对每一个触摸响应函数提供`event`事件和`gestureState`对象
    ```js
    onPanResponderMove: (event, gestureState) => {}
    ```
3. `event`事件
    * `changedTouches` - 在上一次事件之后，所有发生变化的触摸事件的数组集合（即上一次事件后，所有移动过的触摸点）
    * `identifier` - 触摸点的 ID
    * `locationX` - 触摸点相对于父元素的横坐标
    * `locationY` - 触摸点相对于父元素的纵坐标
    * `pageX` - 触摸点相对于根元素的横坐标
    * `pageY` - 触摸点相对于根元素的纵坐标
    * `target` - 触摸点所在的元素 ID
    * `timestamp` - 触摸事件的时间戳，可用于移动速度的计算
    * `touches` - 当前屏幕上的所有触摸点的集合
4. `gestureState`对象
    * `stateID` - 触摸状态的 ID。在屏幕上有至少一个触摸点的情况下，这个 ID 会一直有效。
    * `moveX` - 最近一次移动时的屏幕横坐标
    * `moveY` - 最近一次移动时的屏幕纵坐标
    * `x0` - 当响应器产生时的屏幕坐标
    * `y0` - 当响应器产生时的屏幕坐标
    * `dx` - 从触摸操作开始时的累计横向路程
    * `dy` - 从触摸操作开始时的累计纵向路程
    * `vx` - 当前的横向移动速度
    * `vy` - 当前的纵向移动速度
    * `numberActiveTouches` - 当前在屏幕上的有效触摸点的数量
5. `PanResponder`事件
    ```js
     componentWillMount: function() {
        this._panResponder = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
                // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！

                // gestureState.{x,y} 现在会被设置为0
            },
            onPanResponderMove: (evt, gestureState) => {
                // 最近一次的移动距离为gestureState.move{X,Y}

                // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
                // 一般来说这意味着一个手势操作已经成功完成。
            },
            onPanResponderTerminate: (evt, gestureState) => {
                // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
                // 默认返回true。目前暂时只支持android。
                return true;
            },
        });
    },

    render: function() {
        return (
        <View {...this._panResponder.panHandlers} />
        );
    },
    ```
## 2. 网络
1. RN支持的网络方案
    1. 可以使用`NetInfo API`来获取手机当前的各个网络状态
    2. RN集成了最新的`Fetch API`，可以使用`Fetch API`灵活高效地进行HTTP与HTTPS通信
    3. RN支持`WebSocket`协议，可以与服务器进行全双工通信
2. 获取网络状态
    1. 得到当前网络状态
        ```js
        NetInfo.fetch().done(status => {
            // ...
        })
        ```
    2. Android手机状态
        1. 开发者需要先修改RN项目目录下的`\android\app\src\main\AndroidMainfest.xml`
            * 在文件中加入`<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>`
    3. 监听网络状态改变事件
        ```js
        //...
        componentWillMount() {
            this.removeListener = NetInfo.addEventListener('change', status => {
                console.log(status);
            })
        }
        componentWillUnmount() {
            this.removeListener();
        }
        //...
        ```
    4. 判断是否有网络连接
        ```js
        NetInfo.isConnected.fetch().done(isConnected => {
            console.log(isConnected ? 'online' : 'offline')
        })
        ```
    5. 判断当前网络是否收费（只支持Android）
        ```js
        NetInfo.isConnectionExpensive().then(result => {
            console.log(result ? 'charged' : 'free')
        })
        ```
3. 使用`fetch`发送请求
    ```js
    fetch('https://mywebsite.com/endpoint/', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            firstParam: 'yourValue',
            secondParam: 'yourOtherValue',
        }),
    });
    ```
4. `WebSocket`
    1. 介绍
        1. `WebSocket`实现了浏览器与服务器的全双工通信
        2. 借助`HTTP`完成握手
        3. 服务器与客户端之间保持`TCP`连接，服务器与客户端之间进行双向通信
    2. RN中使用`WebSocket`通信
        ```js
        // client.js
        import {
            DeviceEventEmitter
        } from 'react-native';
        const url = 'ws://xxx/websocket/chat';
        let that = null;
        
        export default class WebSocketClient {
            constructor() {
                this.ws = null;
                that = this;
            }
        
            /**
            * 获取WebSocket单例
            * @returns {WebSocketClient}
            */
            static getInstance() {
                if (!this.instance) {
                    this.instance = new WebSocketClient();
                }
                return this.instance;
            }
        
            /**
            * 初始化WebSocket
            */
            initWebSocket() {
                try {
                    //timer为发送心跳的计时器
                    this.timer && clearInterval(this.timer);
                    this.ws = new WebSocket(url);
                    this.initWsEvent();
                } catch (e) {
                    console.log('WebSocket err:', e);
                    //重连
                    this.reconnect();
                }
            }
        
            /**
            * 初始化WebSocket相关事件
            */
            initWsEvent() {
                //建立WebSocket连接
                this.ws.onopen = function () {
                    console.log('WebSocket:', 'connect to server');
                };
        
                //客户端接收服务端数据时触发
                this.ws.onmessage = function (evt) {
                    if (evt.data !== 'pong') {
                        //不是心跳消息，消息处理逻辑
                        console.log('WebSocket: response msg', evt.data);
                        //接收到消息，处理逻辑...
                        //更新广播
                        DeviceEventEmitter.emit('pushEmitter', '');
        
                    } else {
                        console.log('WebSocket: response pong msg=', evt.data);
                    }
                };
                //连接错误
                this.ws.onerror = function (err) {
                    console.log('WebSocket:', 'connect to server error');
                    //重连
                    that.reconnect();
                };
                //连接关闭
                this.ws.onclose = function () {
                    console.log('WebSocket:', 'connect close');
                    //重连
                    that.reconnect();
                };
        
                //每隔15s向服务器发送一次心跳
                this.timer = setInterval(() => {
                    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                        console.log('WebSocket:', 'ping');
                        this.ws.sendMessage('ping');
                    }
                }, 15000);
            }
        
            //发送消息
            sendMessage(msg) {
                if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                    try {
                        this.ws.send(msg);
                    } catch (err) {
                        console.warn('ws sendMessage', err.message);
                    }
                } else {
                    console.log('WebSocket:', 'connect not open to send message');
                }
            }
        
            //重连
            reconnect() {
                if (this.timeout) {
                    clearTimeout(this.timeout);
                }
                this.timeout = setTimeout(function () {
                    //重新连接WebSocket
                    this.initWebSocket();
                }, 15000);
            }
        }
        ```
        ```js
        // server.js
        var WebSocketServer = require('ws').Server;
        wss = new WebSocketServer({port: 8181});
        wss.on('connection', function (ws) {
            console.log('client connected');
            ws.on('message', function (message) {
                console.log('receive:' + message);
                if (message === 'ping') {
                    //心跳包
                    ws.send('pong', (err) => {
                        if (err) {
                            console.log(`[SERVER] error: ${err}`);
                        }
                    });
                } else {
                    //客户端消息，send 方法的第二个参数是一个错误回调函数
                    ws.send('receive client:' + message, (err) => {
                        if (err) {
                            console.log(`[SERVER] error: ${err}`);
                        }
                    });
                }
            });
        });
        ```
5. 推送
    1. Android上使用推送
        * 极光推送
        * 腾讯推送
    2. ios上使用推送
        * ios操作系统集成了APNS(Apple Push Notification Service)，开发者可以通过它来推送消息
        * RN提供了`PushNotificationIOS API`, 让RN开发者可以很方便的使用APNS 
6. `Linking API`
    1. 处理发给本应用的链接
        * 其他应用通过APP链接打开RN应用
            ```js
            // 获取打开本应用的APP链接
            Linking.getInitialURL().then(url => {
                // ...
            }).catch(err => {
                console.error(err);
            })
            ```
        *  使用`Linking API`的监听函数来监听链接
            ```js
            componentDidMount() {
                Linking.addEventListener('url', this._handleOpenURL);
            }
            componentWillUnmount() {
                Linking.removeEventListener('url', this._handleOpenURL);
            }
            _handleOpenURL(aURL) {
                console.log(aURL);
            }
            ```  
    2. 打开外部链接
        * 打开应用
            ```js
            Linking.canOpenURL('baidumap://').then(supported => {
                if (supported) Linking.openURL('baidumap://');
                else console.log('Baidu Map not installed!')
            }).catch(err => {
                console.error(err);
            })
            ```
        * 打开苹果手机的应用商店，打开指定应用的详情下载页
            ```js
            itms-apps://itunes.apple.com/us/app/apple-store/APP_ID
            ```
        * 拨打电话
            ```js
            tel:电话号码
            ```
## 3. 网页浏览器、音视频媒体播放器
1. `WebView`
    1. `WebView`继承所有的`View`属性
    2. `WebView`非回调函数属性
        * `automaticallyAdjustContentInsets`
            * 布尔类型
            * true, 打开WebView组件自动调整网页内容功能
        * `contentInset`
            * 类变量类型的属性，接收`{top: number, left: number, bottom: number, right: number}`
            * 定义`WebView`组件中显示内容距`WebView`四边的距离
        * `html`
            * 用来在`WebView`组件中显示指定的`HTML`字符串
        * `injectedJavascript`
            * 字符串类型
            * 网页加载时，需要运行的`javascript`代码
        * `mediaPlaybackRequiresUserAction`
            * 默认值为true
            * 加载H5格式的音频或者视频时，是否需要用户点击屏幕来确认播放
        * `scalesPageToFit`
            * 默认值为true
            * `WebView`会自动缩放当前显示网页的显示比例，适应`WebView`的窗口
            * 用户可以通过两点手势改变显示比例
        * `startInLoadingState`
            * 布尔类型
            * 指定`WebView`组件在刚开始加载时的`Loading`状态
        * `url`
            * 字符串类型
            * 指定`WebView`组件加载的网址
        * `source`
            * 结构1
                ```js
                {
                    uri: string, // 用来指定webview组件加载的网页
                    method: string, // 用来指定加载的方法，除非服务器配合支持，否则不要设置
                    headers: object, // 用来指定加载时的HTTP消息头，除非服务器配合支持，否则不要设置
                    body: string // 用来指定加载的HTTP消息体，除非服务器配合支持，否则不要设置
                }
                ``` 
            * 结构2
                ```js
                {
                    html: string, // 用来指定直接加载的HTML页面格式
                    baseUrl: string // 用来将需要加载的文件路径写成相对于项目的相对路径
                }
                ``` 
        * 
    3. `WebView`回调函数属性
        * `onError`
            * `WebView`加载错误时的处理函数
        * `onLoad`
            * `WebView`加载结束时的处理函数
        * `onLoadEnd`
            * 网页加载成功或失败，都会调用
        * `onLoadStart`
            * 开始加载网页时被调用
        * `onMessage`
            * H5中的`postMessage`被调用时，会调用，并得到`postMessage`的参数
        * `onNavigationStateChange`
            * 导航状态改变时将被调用
        * `renderError`
            * `WebView`加载网页出错时，将在手机屏幕上渲染这个View组件与它的所有子组件
        * `renderLoading`
            * 返回一个加载状态指示器 
2. ios平台独有属性
    * `allowsInlineMediaPlayback`
        * 布尔类型, 默认值false
        * 决定H5网页中的视频是在网页中播放还是使用原生的全屏视频播放器播放
    * 
3. android平台独有属性
