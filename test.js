var s = new XMLSerializer();
var $wrap = document.getElementById('root');
console.log($wrap.childNodes)
console.log(s.serializeToString($wrap))
console.log(JSON.stringify($wrap))