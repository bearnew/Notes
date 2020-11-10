"use strict";
exports.__esModule = true;
exports.TypedEvent = void 0;
var TypedEvent = /** @class */ (function () {
    function TypedEvent() {
        var _this = this;
        this.listeners = [];
        this.listenersOncer = [];
        this.on = function (listener) {
            _this.listeners.push(listener);
            return {
                dispose: function () { return _this.off(listener); }
            };
        };
        this.once = function (listener) {
            _this.listenersOncer.push(listener);
        };
        this.off = function (listener) {
            var callbackIndex = _this.listeners.indexOf(listener);
            if (callbackIndex > -1)
                _this.listeners.splice(callbackIndex, 1);
        };
        this.emit = function (event) {
            _this.listeners.forEach(function (listener) { return listener(event); });
            _this.listenersOncer.forEach(function (listener) { return listener(event); });
            _this.listenersOncer = [];
        };
        this.pipe = function (te) {
            console.log('11111');
            return _this.on(function (e) { return te.emit(e); });
        };
    }
    return TypedEvent;
}());
exports.TypedEvent = TypedEvent;
var te = new TypedEvent();
var te1 = new TypedEvent();
te.pipe(te1);
