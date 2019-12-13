var s = new XMLSerializer();
var $wrap = document.getElementById('root');
console.log(s.serializeToString($wrap))