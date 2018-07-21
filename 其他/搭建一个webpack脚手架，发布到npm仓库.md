## 准备脚手架的模板
> 我的脚手架配置了两套template，均使用webpack4.x，引入了webpack新属性```tree sharking```。<br/>__react模板地址:__&nbsp;https://github.com/bear-new/react-webpack-template<br/>__原生js模板地址:__&nbsp;https://github.com/bear-new/webpack-template

## 搭建脚手架
Not much nonsense, directly on the code.<br/>
__github__: https://github.com/bear-new/next-webpack-cli

##### 引入依赖库
> <font color="red">Tip:&nbsp;</font> 第一行需加上```#! /usr/bin/env node```,给该文件添加node脚本解析环境。作用: 命令index.js等同于node index.js

```js
#! /usr/bin/env node
const fs = require('fs');
const program = require('commander'); // 自动解析命令和参数，用于处理用户输入的命令
const download = require('download-git-repo'); // 下载并提取git仓库，用于下载项目模板
const handlebars = require('handlebars'); // 模板引擎，将用户提交的信息动态填充到文件中
const inquirer = require('inquirer'); // 通用的命令行，用于和用户进行交互
const ora = require('ora'); // 显示下载中的动画效果
const chalk = require('chalk'); // 给终端的字体添加样式
const symbols = require('log-symbols'); // 终端上显示出 √ 或 × 等的图标
```

##### 模板下载
> <font color="red">Tip:&nbsp;</font> download-git-repo有个坑，爬了好久。。。<br/><br/>download-git-repo的url格式应该为```[github/gitlab]:[账户名]/[仓库名]#[代码分支]```。<br/><br/>eg：我的脚手架所需模板github地址为:https://github.com/bear-new/webpack-template, 实际传值为```github:bear-new/webpack-template#master```

```js
program.version('1.0.0', '-v, --version')
	.command('init <name>')
    .action((name) => {
        if(!fs.existsSync(name)){
            inquirer.prompt([
                {
					name: 'description',
					message: 'Please enter a description of the project'
				},
				{
					name: 'author',
					message: 'Please enter the author name'
                },
                {
                    name: 'template',
                    message: 'Do you use React(Y/N)?'
                }
            ]).then((answers) => {
                // 下载loading动画
                const spinner = ora('正在下载模板...');
                spinner.start();

                // 是否使用react模板
                let gitUrl = 'github:bear-new/webpack-template#master';
                if (answers.template.toUpperCase() === 'Y') {
                    gitUrl = 'github:bear-new/react-webpack-template#master';
                }

				download(gitUrl, name, {clone: true}, err => {
                    if(err){
                        spinner.fail();
                        console.log(symbols.error, chalk.red(err));
                    }else{
                        spinner.succeed();
                        const fileName = `${name}/package.json`;
                        const meta = {
                            name,
                            description: answers.description,
                            author: answers.author
                        }
                        if(fs.existsSync(fileName)){
                            const content = fs.readFileSync(fileName).toString();
                            const result = handlebars.compile(content)(meta);
                            fs.writeFileSync(fileName, result);
                        }
                        console.log(symbols.success, chalk.green('项目初始化完成'));
                    }
                })
            })
        }else{
            // 错误提示项目已存在，避免覆盖原有项目
            console.log(symbols.error, chalk.red('项目已存在'));
        }
    })
program.parse(process.argv);

```
##### 配置package.json
> 我需要设置我的脚手架命令为```next-webpack-cli```,在package.json中添加如下代码:
```json
"bin": {
    "next-webpack-cli": "./index.js"
}
```
<font color="red">Tip:</font>&nbsp;记得执行```npm link```

## 发布到npm仓库
##### 1.注册一个npm帐号
##### 2.npm登录
> 执行```npm login```或者```npm adduser```
##### 3.npm发布
> 在脚手架跟目录执行```npm publish```<br/>
之后更新重新发布，都需要更新package.json的version，然后再执行```npm publish```

<font color="red">Tip:</font> 发布的时候如果发布失败，使用```npm config get registry```查看源是否为npm官方源```https://registry.npmjs.org/```,如果不是请重新设置```npm config set registry https://registry.npmjs.org/```
## 使用我们发布的npm包
##### 1.在项目根目录执行```npm i next-webpack-cli -D```安装
##### 2.用脚手架初始化项目```next-webpack-cli init react-test```安装
![example](https://github.com/bear-new/picture/blob/master/mardown/2018-07-20%20next-webpack-cli/webpack-cli.png?raw=true)
##### 3.安装npm包，运行dev
![example](https://github.com/bear-new/picture/blob/master/mardown/2018-07-20%20next-webpack-cli/npm-run-dev.png?raw=true)



__参考链接__: <br/>
https://github.com/lin-xin/blog/issues/27<br/>
https://github.com/wlx200510/webpack4.x-learn
