```javascript
var Ajax = function() {
	var that = this;
	// 创建异步请求对象方法
	that.createXHR = function() {
		if(window.XMLHttpRequest){ // IE7+,Firefox,Opera,Chrome,Safari
			return new XMLHttpRequest();
		}else if(window.ActiveXObject){ // IE6及以下
			var versions = ['MSXML2.XMLHttp', 'Microsoft.XMLHTTP'];
			for(var i = 0; len = versions.length; i < len; i++) {
				try {
					return new ActiveXObject(version[i]);
					break;
				} catch(e) {
					// 跳过
				}
			}                     
		} else {
			throw new Error('浏览器不支持XHR对象!');
		}
	}

	// 初始化数据方法
	that.init = function(obj) {
		var objAdapter = {
			method: 'get',
			data: {},
			success: function() {},
			complete: function() {},
			error: function(s) {
				alert('status:' + s + 'error!');
			},
			async: true
		}
		//通过使用JS随机字符串解决IE浏览器第二次默认获取缓存的问题
        that.url = obj.url + '?rand=' + Math.random();
        that.method = obj.method || objAdapter.method;
        that.data = that.params(obj.data) || that.params(objAdapter.data);
        that.async = obj.async || objAdapter.async;
        that.complete = obj.complete || objAdapter.complete;
        that.success = obj.success || objAdapter.success;
        that.error = obj.error || objAdapter.error;
	}

	// ajax异步调用
	that.ajax = function(obj) {
		that.method = obj.method || 'get';
		if(obj.method === 'post'){
			that.post(obj);
		}else{
			that.get(obj);
		}
	}

	// post方法
	that.post = function(obj) {
		var xhr = that.createXHR(); // 创建XHR对象
		that.init(obj);
		that.method='post';
		if(that.async === true) { // true表示异步,false表示同步
			// 使用异步调用的时候，需要触发readystatechange事件
			xhr.onreadystatechange = function() {
				if(xhr.readyState == 4) { // 判断对象的状态是否交互完成
					that.callback(obj,this); // 回调
				}
			}
		}
		// 在使用XHR对象时，必须先调用open()方法
		// 他接受三个参数：请求类型(get,post),请求的url和表示是否异步
		xhr.open(that.method, that.url, that.async);
		// post方式需要自己设置http的请求头，来模仿表单提交
		// 放在open方法之后，send方法之前
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send(that.data); // post方式将数据放在send()方法里
		if(that.async === false) { // 同步
			that.callback(obj,this); // 回调
		}
	}
	 //get方法
	that.get = function(obj) {
 		var xhr = that.createXHR(); //创建XHR对象
 		that.init(obj);
 		if(that.async === true) { //true表示异步，false表示同步
 			//使用异步调用的时候，需要触发readystatechange 事件
 			xhr.onreadystatechange = function() {
 				if(xhr.readyState == 4) { //判断对象的状态是否交互完成
 					that.callback(obj,this); //回调
				}
 			};
 		}
 		//若是GET请求，则将数据加到url后面
 		that.url += that.url.indexOf('?') == -1 ? '?' + that.data : '&' + that.data;
 		//在使用XHR对象时，必须先调用open()方法，
 		//它接受三个参数：请求类型(get、post)、请求的URL和表示是否异步。
 		xhr.open(that.method, that.url, that.async);
 		xhr.send(null); //get方式则填null
 		if(that.async === false) { //同步
 			that.callback(obj,this); //回调
 		}
	}
	//请求成功后，回调方法
	that.callback = function(obj,xhr) {
		if(xhr.status == 200) { //判断http的交互是否成功，200表示成功
			obj.success(xhr.responseText); //回调传递参数
		} else {
			alert('获取数据错误！错误代号：' + xhr.status + '，错误信息：' + xhr.statusText);
		}
	}
	//数据转换
	that.params = function(data) {
		var arr = [];
		for(var i in data) {
			//特殊字符传参产生的问题可以使用encodeURIComponent()进行编码处理
			arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
		}
		return arr.join('&');
	}
   	return {
		post : that.post,
		get : that.get,
		ajax : that.ajax
	}

}

export Ajax;

example:
  var ajax = new Ajax();
    ajax.post({
    url: 'ajax.php',
    data: {
    'name': 'JR',
    'age': 22
    },
    success: function(message) {
        console.log(message);
    },
    async: true
});
```