### js
```
$.loading = {
	start: function (options) {

		var defaults = {
			opacity: 1, // loading页面透明度
			backgroundColor: '#FFF', // loading页面背景色
			borderColor: '#bbb', // 提示边框颜色
			borderWidth: 1, // 提示边框宽度
			borderStyle: 'solid', // 提示边框样式
			loadingTips: '正在加载，请稍后...', // 提示文本
			TipsColor: '#666', // 提示颜色
			delayTime: 1000, // 页面加载完成后，页面渐出速度
			zindex: 999, // loading页面层次
			sleep: 0, // 设置挂起，等于0时无需挂起
		}

		var options = $.extend(defaults, options);

		// 获取页面可见区域宽高
		var _pageHeight = document.documentElement.clientHeight,
			_pageWidth = document.documentElement.clientWidth;

		// loading Html自定义内容
		var _LoadingHtml = '<div id="loadingPage" style="position:fixed;left:0;top:0;_position: absolute;width:100%;height:' + _pageHeight + 'px;background:' + options.backgroundColor + ';opacity:' + options.opacity + ';filter:alpha(opacity=' + options.opacity * 100 + ');z-index:' + options.zindex + ';"><div id="loadingTips" style="position: absolute; cursor1: wait; width: auto;border-color:' + options.borderColor + ';border-style:' + options.borderStyle + ';border-width:' + options.borderWidth + 'px; height:80px; line-height:80px; padding-left:80px; padding-right: 5px;border-radius:10px;  background: ' + options.backgroundColor + 'color:' + options.TipsColor + ';font-size:20px;">' + '<svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg>' + '</div></div>';

		// 呈现Loading效果
		$('body').append(_LoadingHtml);

		// 获取loading提示框宽高
        var _LoadingTipsH = document.getElementById("loadingTips").clientHeight,
        _LoadingTipsW = document.getElementById("loadingTips").clientWidth;

        //计算距离，让loading提示框保持在屏幕上下左右居中
        var _LoadingTop = _pageHeight > _LoadingTipsH ? (_pageHeight - _LoadingTipsH) / 2 : 0,
        _LoadingLeft = _pageWidth > _LoadingTipsW ? (_pageWidth - _LoadingTipsW) / 2 : 0;

        $("#loadingTips").css({
            "left": _LoadingLeft + "px",
            "top": _LoadingTop + "px"
        });

        //监听页面加载状态
        document.onreadystatechange = PageLoaded;

        //当页面加载完成后执行
        function PageLoaded() {
            if (document.readyState == "complete") {
                var loadingMask = $('#loadingPage');

                setTimeout(function () {
                    loadingMask.animate(
	                    {
	                        "opacity": 0
	                    },
	                    options.delayTime,
	                    function () {
	                        $(this).hide();
	                    }
                    );
                }, options.sleep);
            }
        }
    },
    end: function () {
        $("#loadingPage").remove();
    }
}
$.loading.start();
setTimeout(function () {
	$.loading.end();
}, 5000)
```

### css 
```
.circular {
    width: 42px;
    height: 42px;
    animation: loading-rotate 2s linear infinite;
}
.path {
    animation: loading-dash 1.5s ease-in-out infinite;
    stroke-dasharray: 90,150;
    stroke-dashoffset: 0;
    stroke-width: 2;
    stroke: #20a0ff;
    stroke-linecap: round;
}
@keyframes loading-rotate {
	100% {
		transform: rotate(1turn);
	}
}
@keyframes loading-dash {
	0% {
		stroke-dasharray: 1,200;
		stroke-dashoffset: 0;
	}
	50% {
		stroke-dasharray: 90,150;
		stroke-dashoffset: -40px;
	}
	100% {
		stroke-dasharray: 90,150;
		stroke-dashoffset: -120px;
	}
}
```