// 手动实现jsonp跨域
; (function (window, name) {
    var jsonp = function (url, param, callback) {
        var callbackSuffix = Math.random().toString().replace('.', '');
        // console.log(callbackSuffix);  // 07626840955849186
        var callbackName = "callback_function" + callbackSuffix;
        // console.log(callbackName); // callback_function07626840955849186
        window[callbackName] = callback;
        var queryString = url.indexOf('?') == -1 ? "?" : '&';
        // console.log(queryString); // ?
        for (var key in param) {
            queryString += key + '=' + param[key] + '&';
        }
        // console.log(queryString); // ?count=10&start=15&
        queryString += 'callback=' + callbackName;
        // console.log(queryString); // ?count=10&start=15&callback=callback_function07626840955849186
        var scriptElement = document.createElement('script');
        scriptElement.src = url + queryString;
        document.body.appendChild(scriptElement);
    };
    window.$jsonp = jsonp;
})(window, document);

(function () {
    $jsonp('www.baidu.com', { count: 10, start: 15 }, function (data) {
        document.getElementById('inner').innerHTML = JSON.stringify(data);
    });
})();