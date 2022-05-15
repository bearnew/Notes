# chrome extensions 开发

> https://juejin.cn/post/7035782439590952968#heading-24

## 1.manifest.json

```json
{
    "name": "Hello Extensions",
    "description": "Base Level Extension",
    "version": "1.0", // 插件版本
    "manifest_version": 2, // 配置插件程序的版本号，主流版本是2，最新是3
    "browser_action": {
        // "default_icon": "popup.png",
        "default_icon": {
            // optional
            "16": "images/icon16.png", // optional
            "24": "images/icon24.png", // optional
            "32": "images/icon32.png" // optional
        },
        "default_title": "hello popup", // 设置鼠标悬浮在插件icon上的tooltip文案
        "default_popup": "popup.html" // 设置点击插件icon弹出的弹窗
    },
    // 新增命令
    "commands": {
        "_execute_browser_action": {
            // 快捷键
            "suggested_key": {
                "default": "Ctrl+Shift+F",
                "mac": "Ctrl+Shift+F"
            },
            "description": "Opens popup.html"
        }
    },
    // 生命周期是插件中所有类型页面中最长的
    // 随着浏览器的打开而打开，随着浏览器的关闭而关闭
    // page和scripts只需要配置一个即可
    "background": {
        // "page": "background.html",
        "scripts": ["background.js"],
        // persistent设置为true，表示插件将一直在后台运行
        "persistent": true
    },
    // 注册使用权限
    "permissions": [
        "storage",
        "declarativeContent",
        "activeTab",
        "contextMenus",
        "notifications",
        "webRequest",
        "webRequestBlocking",
        "*://*.xieyufei.com/"
    ],
    "content_scripts": [
        {
            // matches必需。指定此内容脚本将被注入到哪些页面。
            // exclude_matches, 可选。排除此内容脚本将被注入的页面。
            // include_globs, 可选。 在 matches 后应用，以匹配与此 glob 匹配的URL。旨在模拟 @exclude 油猴关键字。
            // exclude_globs, 可选。 在 matches 后应用，以排除与此 glob 匹配的URL。旨在模拟 @exclude 油猴关键字。
            "matches": ["https://*.xieyufei.com/*"],
            "exclude_matches": ["*://*/*business*"],
            "include_globs": ["*xieyufei.com/???s/*"],
            "exclude_globs": ["*science*"],
            "js": ["contentScript.js"],
            // document_idle, window.onload 事件触发后立即注入脚本
            // document_start, 在 css 文件之后，但在构造其他 DOM 或运行其他脚本前注入。
            // document_end, 在 DOM 创建完成后，但在加载子资源（例如 images 和 frames ）之前，立即注入脚本。
            "run_at": "document_idle"
        }
    ],
    // 将Chrome默认的特定页面替换为插件程序中的HTML文件
    // 熟知的Momentum插件，就是覆盖了新标签页面。
    "chrome_url_overrides": {
        "newtab": "newtab.html"
        // "history": "history.html",
        // "bookmarks": "bookmarks.html"
    }
}
```

## 2.加载非 chrome 网上应用商店的插件

1. 将`.crx`后缀改成`.zip`，解压后通过开发者模式`加载已解压的扩展程序`
2. 加载插件的文件夹一定要包含`manifest.json`文件

## 3.background 监听事件

1. 插件程序首次安装或更新为新版本。
2. 后台页面正在监听事件，并且已调度该事件
3. 内容脚本或其他插件发送消息
4. 插件中的另一个视图（例如弹出窗口）调用`runtime.getBackgroundPage`

```js
// background.js
chrome.runtime.onInstalled.addListener(function () {
    // storage中设置值
    chrome.storage.sync.set({ color: "#3aa757" }, function () {
        console.log("storage init color value");
    });
    // 用于精确地控制什么时候显示我们的页面按钮
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { hostEquals: "baidu.com" },
                    }),
                ],
                actions: [new chrome.declarativeContent.ShowPageAction()],
            },
        ]);
    });
});
```

## 4.获取浏览器 tabs

```js
// popupjs
changeColor.onclick = function (el) {
    chrome.storage.sync.get("color", function (data) {
        let { color } = data;
        chrome.tabs.query(
            // 找到激活的tab
            { active: true, currentWindow: true },
            function (tabs) {
                // 通过executeScript执行代码
                chrome.tabs.executeScript(tabs[0].id, {
                    code:
                        'document.body.style.backgroundColor = "' +
                        color +
                        '";',
                });
            }
        );
    });
};
```

## 5.alarms

```js
chrome.alarms.create({ delayInMinutes: 3.0 });

chrome.alarms.onAlarm.addListener(function () {
    alert("Hello, world!");
});
```

## 6.browserAction.setPopup 动态设置弹出窗口

```js
chrome.browserAction.setPopup({ popup: "popup_new.html" });
```

## 7.使用 browserAction.setTitle 设置提示文案

```js
chrome.browserAction.setTitle({ title: "New Tooltip" });
```

## 8.设置插件图片上的 Badge

-   只能设置 4 个英文或者 2 个中文

```js
chrome.browserAction.setBadgeText({ text: "new" });
chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
// or 颜色字符串
// chrome.action.setBadgeBackgroundColor({color: '#4688F1'});
```

## 9.将内容脚本注入到整个文件中

-   内容脚本处于独立、隔离的文件，不会和主页脚本或者其他插件脚本发生冲突

```js
chrome.tabs.executeScript(tabs[0].id, {
    file: "contentScript.js",
});
```

## 10.content-scripts 是在网页上下文中运行的文件，可以访问以下 chrome 的 API

-   i18n
-   storage
-   runtime
    -   connect
    -   getManifest
    -   getURL
    -   id
    -   onConnect
    -   onMessage
    -   sendMessage

## 11.内容脚本消息通信

```js
// contentScript.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log("content-script收到的消息", message);
    sendResponse("我收到了你的消息！");
});

chrome.runtime.sendMessage(
    { greeting: "我是content-script呀，我主动发消息给后台！" },
    function (response) {
        console.log("收到来自后台的回复：" + response);
    }
);
```

## 12.contextMenus, 自定义浏览器的右键菜单（也有叫上下文菜单的）

```js
chrome.contextMenus.create({
    id: "1",
    title: "使用百度搜索：%s",
    contexts: ["selection"],
    onclick: function (params) {
        chrome.tabs.create({
            url:
                "https://www.baidu.com/s?ie=utf-8&wd=" +
                encodeURI(params.selectionText),
        });
    },
});
```

## 13.storage

1. 用户数据使用 chrome.storage 存储可以和 Chrome 的同步功能自动同步。
2. 插件的内容脚本可以直接访问用户数据，而无需 background。
3. chrome.storage 可以直接存储对象，而 localStorage 是存储字符串，需要再次转换
4. 要使用 `storage` 的自动同步，我们可以使用 `storage.sync`：

```js
chrome.storage.sync.set({ key: value }, function () {
    console.log("Value is set to " + value);
});

chrome.storage.sync.get(["key"], function (result) {
    console.log("Value currently is " + result.key);
});
```

5. 不需要同步的数据可以用`storage.local`进行存储：

```js
chrome.storage.local.set({ key: value }, function () {
    console.log("Value is set to " + value);
});

chrome.storage.local.get(["key"], function (result) {
    console.log("Value currently is " + result.key);
});
```

6. `onChanged`监听存储中的数据变化

```js
// background.js

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        console.log(
            `Storage key "${key}" in namespace "${namespace}" changed.`,
            `Old value was "${oldValue}", new value is "${newValue}".`
        );
    }
});
```

## 14.devtools

```json
// manifest.json
{
    "devtools_page": "devtools.html"
}
```

```html
<!-- devtools.html -->
<!DOCTYPE html>
<html lang="en">
    <head> </head>
    <body>
        <script type="text/javascript" src="./devtools.js"></script>
    </body>
</html>
```

```js
// devtools.js
// 创建扩展面板
chrome.devtools.panels.create(
    // 扩展面板显示名称
    "DevPanel",
    // 扩展面板icon，并不展示
    "panel.png",
    // 扩展面板页面
    "Panel.html",
    function (panel) {
        console.log("自定义面板创建成功！");
    }
);

// 创建自定义侧边栏
chrome.devtools.panels.elements.createSidebarPane(
    "Sidebar",
    function (sidebar) {
        sidebar.setPage("sidebar.html");
    }
);
```

## 15.devpanels

-   `DevPanel`面板是一个顶级标签，和`Element`、`Source`、`Network`等是同一级，在一个`devtools.js`可以创建多个
-   panel.js 中我们使用`devtools.inspectedWindow`的 API 来和被检查窗口进行交互：

```html
<!DOCTYPE html>
<html lang="en">
    <head></head>
    <body>
        <div>dev panel</div>
        <button id="check_jquery">检查jquery</button>
        <button id="get_all_resources">获取所有资源</button>
        <script src="panel.js"></script>
    </body>
</html>
```

```js
document.getElementById("check_jquery").addEventListener("click", function () {
    chrome.devtools.inspectedWindow.eval(
        "jQuery.fn.jquery",
        function (result, isException) {
            if (isException) {
                console.log("the page is not using jQuery");
            } else {
                console.log("The page is using jQuery v" + result);
            }
        }
    );
});

document
    .getElementById("get_all_resources")
    .addEventListener("click", function () {
        chrome.devtools.inspectedWindow.getResources(function (resources) {
            console.log(resources);
        });
    });
```

## 16.Sidebar

-   通过 elements.onSelectionChanged 监听事件

```js
var page_getProperties = function () {
    if ($0 instanceof HTMLElement) {
        return {
            tag: $0.tagName.toLocaleLowerCase(),
            class: $0.classList,
            width: window.getComputedStyle($0)["width"],
            height: window.getComputedStyle($0)["height"],
            margin: window.getComputedStyle($0)["margin"],
            padding: window.getComputedStyle($0)["padding"],
            color: window.getComputedStyle($0)["color"],
            fontSize: window.getComputedStyle($0)["fontSize"],
        };
    } else {
        return {};
    }
};

chrome.devtools.panels.elements.createSidebarPane(
    "Select Element",
    function (sidebar) {
        function updateElementProperties() {
            sidebar.setExpression(
                "(" + page_getProperties.toString() + ")()",
                "select element"
            );
        }
        updateElementProperties();
        chrome.devtools.panels.elements.onSelectionChanged.addListener(
            updateElementProperties
        );
    }
);
```

## 17.notifications

```js
// background.js
chrome.notifications.create(null, {
    type: "basic",
    iconUrl: "drink.png",
    title: "喝水小助手",
    message: "看到此消息的人可以和我一起来喝一杯水",
});
```

## 18.webRequest

```js
// 对拦截的请求进行取消
chrome.webRequest.onBeforeRequest.addListener(
    function (detail) {
        return { cancel: details.url.indexOf("example.com") != -1 };
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
);
```

## 19. background 和 popup 通信

```js
// popup.js
var bg = chrome.extension.getBackgroundPage();
bg.someMethods();
```

```js
//background.js
var views = chrome.extension.getViews({ type: "popup" });
if (views.length > 0) {
    // 相当于popup的windows对象
    console.log(views[0].location.href);
}
```

## 20.background 和内容脚本通信

```js
// content-script.js
chrome.runtime.sendMessage(
    { greeting: "hello，我是content-script，主动发消息给后台！" },
    function (response) {
        console.log("收到来自后台的回复：" + response);
    }
);

// 接收事件
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(
        sender.tab
            ? "from a content script:" + sender.tab.url
            : "from the extension"
    );
    if (request.greeting.indexOf("hello") !== -1) {
        sendResponse({ farewell: "goodbye" });
    }
});
```

```js
// background.js
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
        tabs[0].id,
        { greeting: "hello，我是后台，主动发消息给content-script" },
        function (response) {
            console.log(response.farewell);
        }
    );
});

// 接收事件
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(
        sender.tab
            ? "from a content script:" + sender.tab.url
            : "from the extension"
    );
    if (request.greeting.indexOf("hello") !== -1) {
        sendResponse({ farewell: "goodbye" });
    }
});
```

```js
// 长链接
// content-script.js
// 设置通道名称
var port = chrome.runtime.connect({ name: "knockknock" });
port.postMessage({ joke: "Knock knock" });
port.onMessage.addListener(function (msg) {
    if (msg.question == "Who's there?") port.postMessage({ answer: "Madame" });
    else if (msg.question == "Madame who?")
        port.postMessage({ answer: "Madame... Bovary" });
});
```

```js
// 长链接
// background.js
chrome.runtime.onConnect.addListener(function (port) {
    console.assert(port.name == "knockknock");
    port.onMessage.addListener(function (msg) {
        if (msg.joke == "Knock knock")
            port.postMessage({ question: "Who's there?" });
        else if (msg.answer == "Madame")
            port.postMessage({ question: "Madame who?" });
        else if (msg.answer == "Madame... Bovary")
            port.postMessage({ question: "I don't get it." });
    });
});
```
