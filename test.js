var parseCookie = function (cookie) {
    var cookies = {};
    if (!cookie) {
        return cookies;
    }
    
    var list = cookie.split(';');
    for (var i = 0; i < list.length; i++) {
        var pair = list[i].split('=');
        cookies[pair[0].trim()] = pair[1];
    }
    return cookies;
}; 