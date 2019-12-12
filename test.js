var wrap = document.getElementById('wrap');
var outet = document.getElementById('outer');
var inner = document.getElementById('inner');

wrap.addEventListener('click',function(){
  alert('789');
},false);
outer.addEventListener('click',function(){
  alert('456');
},false);
inner.addEventListener('click',function(){k
  alert('123');
},false);
wrap.addEventListener('click',function(){
  alert('wrap');
},true);
outer.addEventListener('click',function(){
  alert('outer');
},true);
inner.addEventListener('click',function(){
  alert('inner');
},true);