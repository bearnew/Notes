# chrome devtools 全攻略

-   参考文章 1: https://new.qq.com/omn/20220414/20220414A08M2X00.html
-   参考文章 2: https://juejin.cn/post/6844904162602254350
-   参考文章 3：https://juejin.cn/post/7091263579319435277
-   参考文章 4：https://juejin.cn/post/7042333938089459743

### 1.Cmd + Shift + P 打开命令菜单

### 2.capture network screen（看到每一帧的网络请求）

-   ![capture_screen](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/chrome%20devtools/capture_screenshots.png?raw=true)

### 3.控制台 copy

-   ![copy](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/chrome%20devtools/copy.png?raw=true)

### 4.cpu 和 network 降级测试

-   ![downgrade](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/chrome%20devtools/downgrade_### .png?raw=true)

### 5.直接修改页面

-   ![edit_page](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/chrome%20devtools/editPage.png?raw=true)

### 6.保存 img 为 data url

-   ![data_url](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/chrome%20devtools/img_to_dataurl.png?raw=true)

### 7.media_queries

-   ![media_queries](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/chrome%20devtools/media_queries.png?raw=true)

### 8.animation 调试

-   ![animation](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/chrome%20devtools/more_tools_animation.png?raw=true)

### 9.coverage

-   ![coverage](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/chrome%20devtools/more_tools_coverage.png?raw=true)

### 10.replayXHR

-   ![replayXHR](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/chrome%20devtools/replayXHR.png?raw=true)

### 11.snippets

-   ![snippets](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/chrome%20devtools/snippets.png?raw=true)

### 12. 控制台变量

-   ![variable](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/chrome%20devtools/%E6%8E%A7%E5%88%B6%E5%8F%B0%E5%8F%98%E9%87%8F.PNG?raw=true)

### 13.css 递增/递减

-   增量 0.1
    -   Mac： Option +向上和 Option +向下
    -   Windows： Alt +向上和 Alt +向下
-   增量 1
    -   Mac：向上+向下
    -   Windows：向上+向下
-   增量 10
    -   Mac：⇧+向上和 ⇧+向下
    -   Windows：⇧+向上和 ⇧+向下
-   递增 100
    -   Mac： ⌘+向上和 ⌘+向下
    -   Windows： Ctrl +向上和 Ctrl +向下

### 14.console settings

-   ![settings](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/chrome%20devtools/console_settings.png?raw=true)

### 15.event listener

-   ![event_listener](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/chrome%20devtools/event_listener.png?raw=true)

### 16.file global search

-   ![file_global_search](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/chrome%20devtools/file_search.png?raw=true)

### 17.lighthouse

-   ![lighthouse](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/chrome%20devtools/lighthouse.png?raw=true)

### 18.manifest

-   ![manifest](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/chrome%20devtools/manifest.png)

### 19.file coverage

-   ![coverage](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/chrome%20devtools/more_tools_coverage2.png)

### 20.code global search

-   ![search](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/chrome%20devtools/more_tools_search.png)

### 21.performance

-   ![performance](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/chrome%20devtools/performance_reload.png)

### 22.render painting

-   ![render_painting](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/chrome%20devtools/render_paint_flashing.png)

### 23.request blocking

-   ![request_blocking](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/chrome%20devtools/request_blocking.png)

### 24.security

-   ![security](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/chrome%20devtools/security.png)

### 25.source filesystem

-   ![source filesystem](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/chrome%20devtools/sources_filesystem.png)

### 26.web assets

-   ![web assets](https://github.com/bearnew/picture/blob/master/markdown_v2/2022/chrome%20devtools/web_assets.png)

## 27.总结

1. Ctrl + Shift + P 打开命令行菜单

2. Ctrl + G 跳转源码位置

3. Network -> Initiator 请求定位到源码

4. Network->Capture Screenshots 捕捉每一帧的画面

5. Source->Filesystem->add folder to workspace 同步 chrome devtools 的更改到本地文件
   目前好像不支持 webpack 编译的文件同步

6. 查看 css 计算之后的值

7. 在控制台修改入参快速发起请求
   选中 Network
   点击 Fetch/XHR
   选择 Copy as Fetch
   控制台粘贴代码
   修改参数，回车完成请求

8. 给 debug 增加过滤条件

9. Console Importer 在控制台安装 Npm 包

10. $代替document.querySelector，$$代替 document.querySelectorAll

11. $\_使用上一次执行的结果

12. 自定义 Network 显示的请求信息

13. 使用 console 的 watch 做代码测试（避免重复 console.log(arr)）
    对 arr 进行操作，watch 面板上 console 的值会实时变更

14. flex 调试面板

15. Network request blocking

16. 查看元素上的事件

17. 查看网站的安全信息

18. performance 降级

19. Preserve Log，A 页面跳 B 页面，保留 A 页面的请求（请求的 response 只有点击过的才会保存）

20. Replay XHR 一键重新发起请求

21. 按住 options，点击 dom 元素，展开 dom 的所有子元素

22. $0 获取 Elements 面板选中的元素
