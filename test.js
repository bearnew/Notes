var s = new XMLSerializer();

var $ll = document.getElementById('ll');
var $input = document.getElementById('input');

$input.value = '123'
var $wrap = document.getElementById('root');
console.log(s.serializeToString($wrap))
console.log($wrap.childNodes)
$ll.innerHTML = s.serializeToString($wrap)
