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
    * `bounces`
        * 布尔类型
        * `WebView`拉到尽头时，是否有弹动效果
    * `onShouldStartLoadWithRequest`
        * 回调函数
        * `WebView`访问的网页中触发的任何js发起的请求都会交给这个回调函数
        * 回调函数分析js发起的请求，然后返回true或者false以决定是否执行js发起的请求
    * `scrollEnabled`
        * 布尔类型
        * 用来决定是否允许当前网页上下滚动
    * `decelerationRate`
        * `WebView`停止划动动作后，页面减速的方式
        * 取值
            * `normal`
            * `fast`  
3. android平台独有属性
    * `domStorageEnabled`
        * 布尔类型
        * 是否允许DOM在本机存储
    * `javaScriptEnabled`
        * 布尔类型
        * 是否允许运行javascript脚本
    * `userAgent`
        * 用来给`WebView`组件设置代理 
4. `WebView`组件成员函数
    * `onLoadinStart`，供开发者调用`onLoadStart`回调函数
    * `onLoadingError`, 供开发者调用`onLoadError`回调函数
    * `onLoadingFinish`, 供开发者调用`onLoadEnd`回调函数
    * `reload`, 供开发者调用重新加载当前页面
5. example
    ```js
    <WebView
        ref="webViewRef"
        automaticallyAdjustContentInsets={false}
        source={
            uri: 'https://news.sina.com.cn'
        }
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onNavigationStateChange={this.onNavigationStateChange}
        startInLoadingState={true}
    />
    ```
    ```js
    <WebView
        automaticallyAdjustContentInsets={false}
        source={require('./A.html')}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
    />
    ```
6. 音视频媒体播放
    * 通过`WebView`访问包含音视频媒体的网页
## 4. 应用权限与图库操作
1. Android平台应用权限
    * 在项目`AndroidManifest.xml`文件中申请
        * 手机震动
        * 访问网络
        * 其他普通权限
    * 通过`PermissionsAndroid API`实现动态授权
        * 读取sdcard
        * 访问通讯录
        * 访问用户摄像头
        * 获取用户位置
    * `CameraRoll API`
        * 对手机中保存的图片、视频进行遍历操作与访问
        * 还可以实现上传图片、裁剪图片功能 
2. ios平台应用权限
    * 在项目`info.plist`文件中声明需要使用的权限, 并可设置一段提示语
    * 第一次执行到需要相应权限的地方时，会弹出选择提示框让用户决定是否给应用相应的权限
3. example(申请摄像头权限)
    ```js
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA).then(result => {
        if (result) {
            this.doSomething();
            return;
        }
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
            title: 'LearnRN权限申请',
            message: 'LearnRN申请摄像头相关权限'
        }).then(permission => {
            if (permission === 'granted') {
                this.doSomething();
            } else {
                if (permission === 'denied') {
                    this.doOtherthing();
                } else {
                    this.doAnotherthing();
                }
            }
        })
    }).catch(err => {
        console.error(err);
    })
    ```
4. `React Native`在ios平台以链接库的方式提供一些功能
5. `getPhotos`获取手机中所有图片的信息
    * `getPhotos`的第1个参数是1个对象，有4个值
        * `first`, 数值型变量，告诉`CameraRoll API`希望获取多少张图片信息
        * `groupTypes`, 用来指定获取图片或者视频的类型
            * `Album`
            * `All`
            * `Event`
            * `Faces`
            * `Library`
            * `PhotoStream`
        * `assetType`
            * `Photos`, 只获取图片
            * `All`
            * `Videos`
        * `after`, 记录上一次获取图片的截止标记
    * example
        ```js
        import { CameraRoll } from 'react-native';

        // ...
        CameraRoll.getPhotos({ first: 50 }).then(data => {
            // ...
        }).catch(err => {
            console.error(err);
        })
        // ...
        ``` 
6. 获取到的图片信息
    1. Android平台和Ios平台都具备的图片信息
        * type, 值为`image/jpeg`或者`image/png`
        * group_map, 用来保存当前图片文件的文件夹名
        * timestamp, 时间戳数值
        * image, { width: number, height: number, uri: string, filename: string }, 可以传给Image组件显示图片信息
    2. Ios平台图片信息
        * isStored, 获取到的图片，这个值都为true
        * location, { latitude: string, longitude: string, altitude: string, heading: string, speed: string }
    3. 显示`CameraRoll API`获取到的图片
        ```js
        import { CameraRoll } from 'react-native';

        // ...
        componentWillMount() {
            CameraRoll.getPhotos({
                first: 1
            }).then(data => {
                let image = data.edges[0].node.image;
                this.setState({ image })
            })
        }

        render() {
            return (
                <Image
                    style={styles.imageStyle}
                    source={this.state.image}
                />
            )
        }
        // ...
        ```  
        
7. 上传图片
    ```js
    CameraRoll.getPhotos({
        first: 1000
    }).then(data => {
        const image = data.edges[0].node.image;
        if (Platform.OS !== 'ios') image.filename = 'test.jpg';

        let body = new FormData();
        body.append('photo', {
            uri: image.uri,
            name: image.filename,
            filename: image.filename,
            type: 'image/jpg'
        }),
        body.append('Content-Type', 'image/jpg');

        let aObj = {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            body
        }

        fetch(uri, aObj).then(result => {
            // ...
        })
    })
    ```
8. 裁剪图片
    ```js
    import { ImageEditor } from "react-native";

    // ...
    cropImageDone(aUri) {

    }
    cropImageFailed(error) {

    }
    let cropData = {
        offset: { x: 0, y: 0 },
        size: { width: 600, height: 1200 },
        displaySize: { width: 600, height: 1200 },
        resizeMode: 'contain'
    }

    ImageEditor.cropImage(this.image, cropData, this.cropImageDone.bind(this), this.cropImageFailed.bind(this))
    // ...
    ```
## 5. 选择器、位置相关、应用状态
1. 日期、时间选择器
    1. `DatePickerAndroid` API
    2. `TimePickerAndroid` API
    3. `DatePickerIOS`组件 
2. `Picker`组件
    1. `Picker`组件的属性
        * `onValueChange`, 传递2个参数
            * `itemValue`, 被选中项的`value`值
            * `itemPosition`, 被选中项在`picker`中的索引位置
        * `selectedValue`, 指定默认选中的值
    2. `Android`平台特有属性
        * `enabled`, 是否可选择
        * `mode`, Picker的呈现方式
            * `dialog`
            * `dropdown`
        * `prompt`, mode为dialog时，选择框的提示内容
    3. `ios`平台特有属性
        * `itemStyle`, 每个选项标签上的样式
    4. `Picker.Item`组件的属性
        * `label`, 选项的显示字符串
        * `color`, 选项的显示颜色
        * `value`, 选项的返回值
    5. example
        ```js
        import { Picker } from 'react-native';

        <Picker
            mode={Picker.MODE_DROPDOWN}
            prompt="提示字符串"
        >
            {
                this.options.map((option, index) => (
                    <Picker.Item
                        key={index}
                        label={option}
                        value={option}
                    />
                ))
            }
        </Picker>
        ```    
3. `PickerIOS`组件
4. `Slider`组件
    > 在某个值范围内来选择一个值
    * `Disabled`, true则用户不能操作这个组件
    * `maximumValue`, 默认值为1，用来定义可选择的最大值
    * `minimumValue`, 默认值为0，用来定义可选择的最小值
    * `onSlidingComplete`, 用户改变数值后回调函数被调用
    * `onValueChange`, 用户拖动组件时，函数被持续调用
    * `step`, 每次拖动的最小单位
    * `value`, 初始值
5. `AppState` API
    1. 支持2个静态函数`addEvenListener`和`removeEvenListener`
    2. 得知当前应用是前台运行还是后台运行
        * `active`
        * `inactive`
        * `background`
    3. example
        ```js
        import { AppState } from 'react-native';

        // ...
        componentWillMount() {
            AppState.addEvenListener('change', newState => {

            })
        }
        componentWillUnmount() {
            AppState.removeEvenListener('change', newState => {

            })
        }
        // ...
        ```   
6. 获取地理位置
    1. ios平台，项目的`Info.plist`文件中要有`NSLocationWhenInUseUsageDescription`
    2. android平台，项目的`AndroidManifest.xml`文件中
        ```js
        <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION">
        ```
    3. 获取地理位置
        ```js
        // ...
        componentDidMount() {
            navigator.geolocation.getCurrentPosition(position => {
            
            }, error => {

            }, {
                enableHighAccuracy: true, // 允许高精度定位
                timeout: 20000, // 20s没有位置信息则停止获取
                maximumAge: 1000 // 定位结果缓存1000毫秒
            })

            // 地理位置变化监听器
            this.watchID = navigator.geolocation.watchPosition(position => {

            })
        }
        componentWillUnmount() {
            // 应用退出前，关闭地理位置变化监听器
            navigator.geolocation.clearWatch(this.watchID);
        }
        // ...
        ``` 
7. `Vibration` API
    1. Android需要在`AndroidManifest.xml`中加入
        ```js
        <uses-permission android:name="android.permission.VIBRATE">
        ```
    2. 实现手机振动
        ```js
        import { Vibration } from 'react-native';

        Vibration.vibrate([0, 500, 200, 500])
        ```
    3. 
8. 地图功能
    * `react-native-maps`
    * 百度地图
    * 高德地图

## 6.RN开源组件
1. 微软热更新开源平台-`CodePush`
    1. 使用`react-native-code-push`集成到RN中
    2. 热更新范围
        * 只能更新js以及jsx代码，以及js代码中使用的图片
    3. 缩小更新包
        * 图片使用网络图片
    4. 更新提示
        1. 苹果禁止了`Rollout`和`JSPatch`两种热更新方案
        2. 使用`CodePush`热更新方案的RN仍然可以在苹果商店上架审核
        3. 苹果只允许无提示的更新，不允许热更新时向用户弹出版本更新提示框
    5. 热更新工作流程
        1. 开发者可以选择马上更新还是下次应用重启时更新
        2. 热更新会自动删除历史包，不必担心热更新过多，软件占用手机存储空间变大 
2. `Google`统计平台-`Google Analytics`
    * RN中利用`react-native-google-analytics-bridge`使用`Google Analytics`
3. 极光推送
    * RN中利用`jpush-react-native`实现极光推送
    * 在ios平台，极光推送通过苹果的`APNS`服务来实现推送
4. 数据存储
    1. `Realm`移动平台
        * 让开发者可以方便地实现数据的持久化
        * `Realm`对象服务器为`Real`移动平台提供安全认证、自动数据同步、访问控制、事件处理等功能
    2. `RN`中文件操作
        * `react-native-fs`可以在APP的沙盒中创建、读、写、删除文件与文件夹
    3. `RN`中数据库操作
        * `react-native-sqlite-storage`跨平台数据库开发组件 
5. 图像处理
    1. `react-native-transformable-image`是RN开发中广泛使用的图片处理插件, 可以通过手势范大、缩小、拖动查看图片
    2. `react-native-qrcode`, 生成二维码
    3. `react-native-camera`, 拍照、摄像、扫描二维码处理插件
    4. `react-native-chart`， 图表插件
    5. `react-native-pathjs-charts`, 图表插件
6. 微信开发组件
    * `react-native-wechat`用来申请微信授权，集成微信分享功能与微信支付功能, 但都需要服务器配合
7. 支付宝支付组件
    * `react-native-alipay`
        * 集成支付宝支付功能的RN插件
        * 和`react-native-wechat`一样需要在ios平台修改`AppDelegate.m`文件中的`openURL`函数
8. 获取设备信息
    * `react-native-device-info`获取手机信息的跨平台组件
9. 国际化处理
    * `react-native-i18n`广泛使用的国际化插件
## 7.混合开发高级篇
1. 在`RN`中调用私有组件
    ```js
    import { NativeModules, requireNativeComponent } from 'react-native';
    // 在原生代码侧定义的常量
    var { ScaleToFill, ScaleAspectFit, ScaleAspectFill } = NativeModules.RNFLAnimatedImageManager;
    // 在原生代码侧定义的组件
    var iface = {
        name: 'KenBurnsView',
        propTypes: {
            imgSource: PropTypes.string,
            ...View.propTypes
        }
    }
    var Iface = requireNativeComponent('RNFLAnimatedImage', iface)
    ```
## 8.项目配置、生成发布版本、安装包及其他
1. 环境的差异
    1. `Safari`不支持`var date = new Date('2017-3-14')`, 需要使用`var date = new Date('2017/3/14')`
    2. RN开发中无法使用`btoa`和`atob`进行`Base64`编码和解码
2. ios平台应用发布
    * 开发者完成开发后，将开发的软件包使用苹果官方规定的各种证书（通常都是使用苹果开发者账号按苹果规定生成的）签名
        然后交给苹果审查 
3. android平台应用发布
    1. 生成发布密钥
    2. 密钥文件生成后，移动到项目目录的`android/app`子目录下
    3. 修改`gradle`配置文件
    4. 生成发布版本安装包 