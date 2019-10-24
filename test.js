var a = "Hello World";
~a.indexOf("lo"); // -4 <-- 真值!
if (~a.indexOf("lo")) { // true
    // 找到匹配！
}
~a.indexOf("ol"); // 0 <-- 假值!
!~a.indexOf("ol"); // true
if (!~a.indexOf("ol")) { // true
    // 没有找到匹配！
}