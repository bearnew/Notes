var list = {
    "vc": {
        "ask": 7234,
        "bid": 7345,
        "ts": 1.2
    },
    "huobi": {
        "ask": 7235,
        "bid": 7342,
        "ts": 1.4
    },
    "aofex": {
        "ask": 7244,
        "bid": 7345,
        "ts": 1.4
    },
    "baince": {
        "ask": 7224,
        "bid": 7245,
        "ts": 1.3
    }
}

generateChart(list);

/**
 * 生成条形图
 *
 * @param {Array} data 数据源
 */
function generateChart(data) {
    // 清空上一次的数据
    $('.clear').remove()

    var max = 0;
    var min = Number.MAX_SAFE_INTEGER;
    var interval = 0;
    var float = 0;
    for (var key in data) {
        const {
            ask,
            bid
        } = data[key];
        if (ask > max) max = ask;
        if (bid > max) max = bid;
        if (ask < min) min = ask;
        if (bid < min) min = bid;
    }
    if (max.toString().split('.')[1]) {
        float = max.toString().split('.')[1].length;
    }
    console.log(max, float)
    interval = +(max - min).toFixed(float);
    max = max + interval;
    min = min - interval;

    // y轴坐标
    var $yAis = document.querySelector('.left');
    for (var i = (max - min) / interval; i >= 0; i--) {
        var ele = document.createElement('div');
        ele.setAttribute('class', 'clear');
        ele.innerText = min + i * interval;

        $yAis.appendChild(ele);
    }

    // x轴坐标
    var $xAisName = document.querySelector('.xAis-name');
    var $xAisNumber = document.querySelector('.xAis-number');
    for (var key in data) {
        var ele1 = document.createElement('span');
        ele1.setAttribute('class', 'clear');
        ele1.innerText = key;

        // x轴坐标-名称
        $xAisName.appendChild(ele1);

        var ele2 = document.createElement('span');
        ele2.setAttribute('class', 'clear');
        ele2.innerText = data[key].ts;

        // x轴坐标-数字
        $xAisNumber.appendChild(ele2);
    }

    // 柱状图布局
    var $box = document.querySelector('.box');
    for (var key in data) {
        var ele = document.createElement('div');
        ele.setAttribute('class', 'chart clear');
        $box.appendChild(ele);
    }

    // 柱状图内容
    var $charts = document.querySelectorAll('.chart');
    var count = 0;
    for (var key in data) {
        // 插入ask
        var ele1 = document.createElement('div');
        ele1.setAttribute('class', 'orange clear');
        ele1.style.bottom = `${(400 * (data[key].ask - min + interval) / (interval * 4)) - 10}px`;
        $charts[count].appendChild(ele1);

        // 插入bid
        var ele2 = document.createElement('div');
        ele2.setAttribute('class', 'black clear');
        ele2.style.bottom = `${(400 * (data[key].bid - min + interval) / (interval * 4)) - 10}px`;
        $charts[count].appendChild(ele2);

        count++
    }
}
