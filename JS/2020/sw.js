// service worker参考文章: https://lavas-project.github.io/pwa-book/chapter04/2-service-worker-register.html
if (navigator && ('serviceWorker' in navigator)) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/poker_sw.js', {
            scope: '/poker/'
        }).then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}