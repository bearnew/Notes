function GetWebData(URL){
    /**
    * 1:新建XMLHttpRequest请求对象
    */
    let xhr = new XMLHttpRequest()
    /**
    * 2:注册相关事件回调处理函数
    */
    xhr.onreadystatechange = function () {
    switch(xhr.readyState){
    case 0: //请求未初始化
    console.log("请求未初始化")
    break;
    case 1://OPENED
    console.log("OPENED")
    break;
    case 2://HEADERS_RECEIVED
    console.log("HEADERS_RECEIVED")
    上⾯是⼀段利⽤了XMLHttpRequest来请求数据的代码，再结合上⾯的流程图，我们可以分析下这段代码是
    怎么执⾏的。
    第⼀步：创建XMLHttpRequest对象。
    当执⾏到let xhr = new XMLHttpRequest()后，JavaScript会创建⼀个XMLHttpRequest对象xhr，
    ⽤来执⾏实际的⽹络请求操作。
    第⼆步：为xhr对象注册回调函数。
    因为⽹络请求⽐较耗时，所以要注册回调函数，这样后台任务执⾏完成之后就会通过调⽤回调函数来告诉其
    执⾏结果。
    XMLHttpRequest的回调函数主要有下⾯⼏种：
    break;
    case 3://LOADING
    console.log("LOADING")
    break;
    case 4://DONE
    if(this.status == 200||this.status == 304){
    console.log(this.responseText);
    }
    console.log("DONE")
    break;
    }
    }
    xhr.ontimeout = function(e) { console.log('ontimeout') }
    xhr.onerror = function(e) { console.log('onerror') }
    /**
    * 3:打开请求
    */
    xhr.open('Get', URL, true);//创建⼀个Get请求,采⽤异步
    /**
    * 4:配置参数
    */
    xhr.timeout = 3000 //设置xhr请求的超时时间
    xhr.responseType = "text" //设置响应返回的数据格式
    xhr.setRequestHeader("X_TEST","time.geekbang")
    /**
    * 5:发送请求
    */
    xhr.send();
    }