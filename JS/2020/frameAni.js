// 初始状态
var STATE_INITIAL = 0;
// 开始状态
var STATE_START = 1;
// 停止状态
var STATE_STOP = 2;

function Animation() {
    this.taskQueue = [];
    this.index = 0;
    this.state = STATE_INITIAL;
}

Animation.prototype.loadImage = function (imglist) {

}

Animation.prototype.changePosition = function (ele, position, imageUrl) {

}

Animation.prototype.changeSrc = function (ele, imglist) {

}

Animation.prototype.enterFrame = function (taskFn) {

}

Animation.prototype.then = function (callback) {

}

Animation.prototype.start = function (interval) {

}

Animation.prototype.repeat = function (times) {

}

Animation.prototype.repeatForever = function () {

}

Animation.prototype.wait = function (time) {

}

Animation.prototype.pause = function () {

}

Animation.prototype.restart = function () {

}

Animation.prototype.dispose = function () {

}
