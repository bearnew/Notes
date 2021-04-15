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