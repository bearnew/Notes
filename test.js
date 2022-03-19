function render(template, data) {
    // 模板字符串正则
    // 字母、数字、下划线和点
    const reg = /\{\{((\w|\.)+)\}\}/;
    if (reg.test(template)) {
        const name = reg.exec(template)[1];
        if (name.includes(".")) {
            const keys = name.split(".");
            let index = 0;
            let o = data;
            while (index < keys.length) {
                const key = keys[index];
                o = o[key];
                index++;
            }
            template = template.replace(reg, o);
        } else {
            template = template.replace(reg, data[name]);
        }

        return render(template, data);
    }

    return template;
}

let template =
    "我是{{name}}，年龄{{age}}，性别{{sex}}，我的爸爸是{{parent.father}}";
let person = {
    name: "布兰",
    age: 12,
    parent: {
        father: "杰克",
        mother: "丽萨",
    },
};
var html = render(template, person);
// 我是布兰，年龄12，性别undefined，我的爸爸是杰克
console.log(html);
