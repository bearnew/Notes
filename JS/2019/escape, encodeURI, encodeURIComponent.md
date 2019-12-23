## escape, encodeURI, encodeURIComponent
1. escape
    * 采用ISO Latin字符集对指定的字符串进行编码。所有的空格符、标点符号、特殊字符以及其他非ASCII字符都会转化成%xx格式的字符编码（xx代表此字符在字符集表里编码的16进制数字）。比如，空格符的对应编码是%20。不会对ASCII字符和数字进行编码。不会被此方法编码的字符：@ * / +，反向编码函数：unescape()。
2. encodeURI
    * 把URI字符串采用UTF-8编码格式转化成escape格式的字符串。不会被此方法编码的字符：! @ # $ & ( ) = ： / ; ? + '，反向编码函数：decodeURI()。
3. encodeURIComponent
    * 把URI字符串采用URF-8编码格式转化成escape格式的字符串。与encodeURI相比，这个函数会将更多的字符进行编码，比如"/"等字符。所以如果字符串里面包含了URI的几个部分的话，不能用这个来进行编码。否则“/”字符被编码后将URL显示错误。不会被此方法编码的字符：! * ( )，反向编码函数：decodeURIComponent()。
4. 总结
    * `escape`对字符串进行编码，不常用
    * `encodeURI`用于对完整的url进行处理
        ```js
        encodeURI('"http://localhost:8080/pro?a=1&b=张三&c=aaa"'); // "%22http://localhost:8080/pro?a=1&b=%E5%BC%A0%E4%B8%89&c=aaa%22"
        // 接收方进行解码
        decodeURI("%22http://localhost:8080/pro?a=1&b=%E5%BC%A0%E4%B8%89&c=aaa%22"); // ""http://localhost:8080/pro?a=1&b=张三&c=aaa""
        ```
    * `encodeURIComponent`用于对url中的值进行处理
        ```js
        var url = "http://localhost:8080/aa?a=1&b=2&c=3";
        encodeURIComponent(url); // ""http%3A%2F%2Flocalhost%3A8080%2Faa%3Fa%3D1%26b%3D2%26c%3D3""
        decodeURIComponent('"http%3A%2F%2Flocalhost%3A8080%2Faa%3Fa%3D1%26b%3D2%26c%3D3"'); // ""http://localhost:8080/aa?a=1&b=2&c=3""
        ```
