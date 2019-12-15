if (navigator.serviceWorker) {
    window.addEventListener('DOMContentLoaded', function () {
        navigator.serviceWorker.register('/sw.js');
    })
}
