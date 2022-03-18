if (typeof window !== "undefined" && !window.requestIdleCallback) {
    window.requestIdleCallback = function (callback) {
        return setTimeout(() => {
            callback({
                didTimeout: false,
                timeRemaining() {
                    return Infinity;
                },
            });
        });
    };

    window.cancelIdleCallback = function (callbackID) {
        clearTimeout(callbackID);
    };
}
