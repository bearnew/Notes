var a = 1;
switch (a) {
    case 1:
    case 2:
        // 永远执行不到这里
        console.log('1 or 2')
    case 3:
        console.log("3");
        break;
    case 4:
        console.log("4");
    default:
        console.log("default");
}
// 1 or 2
// 3