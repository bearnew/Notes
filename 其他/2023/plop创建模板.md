import * as fs from 'node:fs';

export default plop => {
    // controller generator
    plop.setGenerator('controller', {
        description: 'new popup',
        prompts: [
            {
                type: 'input',
                name: 'popupName',
                message: '请输入新弹窗名，大写开头驼峰形式',
                validate: popupName => {
                    const reg = /^[A-Z]+((\d)|([A-Z0-9][a-z0-9]+))*([A-Z])?/;
                    const files = fs.readdirSync('./src/homePopup');
                    // 获取已有的弹窗名
                    const allPopupNames = files.map(file => {
                        const stats = fs.statSync(`./src/homePopup/${file}`);
                        if (stats.isDirectory()) {
                            return file;
                        }
                    });

                    if (allPopupNames.includes(popupName.toLowerCase())) {
                        return '弹窗已存在，请重新命名';
                    }
                    if (!popupName || popupName.trim === '') {
                        // 验证用户是否输入
                        return '弹窗命名不能为空，重新输入';
                    } else if (!reg.test(popupName)) {
                        // 验证文件是否存在
                        return '弹窗命名不合法，重新输入';
                    } else {
                        return true;
                    }
                }
            },
            {
                type: 'confirm',
                name: 'isHomePopup',
                message: '该弹窗是否支持模块联邦？'
            },
            {
                type: 'input',
                name: 'popupId',
                message: '请输入弹窗 id：',
                when: function (answers) {
                    return answers.isHomePopup;
                }
            }
        ],
        actions: data => {
            const { popupName, popupId, isHomePopup } = data;
            return [
                {
                    type: 'add',
                    path: `src/home/${popupName}/index.tsx`,
                    templateFile: 'plopTemplates/index.hbs'
                },
                {
                    type: 'add',
                    path: `src/home/${popupName}/types.ts`,
                    templateFile: 'plopTemplates/types.hbs'
                },
                {
                    type: 'add',
                    path: `demo/mocks/${popupName}.ts`,
                    templateFile: 'plopTemplates/mockData.hbs'
                },
                {
                    type: 'append',
                    path: 'demo/mocks/index.ts',
                    pattern: `/* PLOP_INJECT_EXPORT */`,
                    template: `export { ${popupName} } from './${popupName}';`
                },
                {
                    type: 'append',
                    path: 'src/home/index.tsx',
                    pattern: `/* PLOP_INJECT_IMPORT */`,
                    template: `import { ${popupName} } from './${popupName}';`
                },
                {
                    type: 'append',
                    path: 'src/home/index.tsx',
                    pattern: `/* PLOP_INJECT_EXPORT */`,
                    template: `    ${popupName},`
                },
                {
                    type: 'append',
                    path: 'src/config.ts',
                    pattern: `/* PLOP_INJECT_CONFIG */`,
                    template: `    '${popupId}': '${popupName}',`,
                    force: false,
                    skip: function () {
                        if (!isHomePopup) {
                            return '非模块联邦，不配置config.ts';
                        }
                    }
                },
                {
                    type: 'onComplete'
                }
            ];
        }
    });

    // 在生成器执行成功时输出一条消息
    plop.setActionType('onComplete', function (answers, config) {
        console.log(
            `请运行 npm run start 后，打开 http://localhost:3000 调试吧`
        );
    });
};
