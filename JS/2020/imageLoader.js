// 预加载图片函数
function loadImage(images, callback, timeout) {
    var count = 0;
    var success = true;
    var timeoutId = 0;
    var isTimeout = false;

    for (var key in images) {
        if (!images.hasOwnProperty(key)) {
            continue;
        }

        var item = images[key];
        if (typeof item === 'string') {
            item = images[key] = {
                src: item
            }
        }

        if (!item || !item.src) {
            continue;
        }

        count++;
        item.id = '__img__' + key + getId();
        item.img = window[item.id] = new Image();

        doLoad(item);
    }


    function doLoad(item) {
        item.status = 'loading';
        var img = item.img;
        img.onload = function () {
            success = success & true;
            item.status = 'loaded';
            done();
        }
        img.onerror = function () {
            success = false;
            item.status = 'error';
            done();
        }

        img.src = item.src;

        if (!count) {
            callback(success);
        } else if (timeout) {
            timeoutId = setTimeout(onTimeout, timeout);
        }

        function done() {
            img.onload = img.onerror = null;
            try {
                delete window[item.id];
            } catch (e) {

            }

            if (!--count && !isTimeout) {
                callback(success);
                clearTimeout(timeoutId);
            }
        }
    }

    function onTimeout() {
        isTimeout = true;
        callback(false);
    }
}

var _id = 0;
function getId() {
    return ++_id;
}

module.exports = loadImage;
