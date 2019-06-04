const fs = require('fs');
const path = require('path');
// const { exec } = require('child_process');

// 先手动执行webpack --config ./build/webpack.config.prod.js --json > stats.json
// exec('webpack --config ./build/webpack.config.prod.js --json > stats.json', (err, stdout, stderr) => {
//     if (err) console.warn(err)
// });
getUnusedFiles();

// 筛选出废弃的文件名
async function getUnusedFiles() {
    //调用文件遍历方法
    const allFiles = getFileDir('./src');
    const usedFiles = await getModules('./stats.json');

    const unUsedFiles = allFiles.reduce((acc, file) => {
        if (!usedFiles.includes(file)) {
            acc.push(file);
        }
        return acc;
    }, []);
    
    // fs.writeFile('allFiles.json', allFiles, err => {
    //     if (err) console.warn(err);
    // })
    // fs.writeFile('usedFiles.json', usedFiles, err => {
    //     if (err) console.warn(err);
    // })
    fs.writeFile('unUsed.json', JSON.stringify(unUsedFiles), err => {
        if (err) console.warn(err);
    })
}

// 获取webpack打包中所有引入的包名
async function getModules(src) {
    return new Promise((resolve, reject) => {
        fs.readFile(src, (err, json) => {
            if (err) reject(err);

            const data = JSON.parse(json);
            const usedFileList = data.modules.reduce((acc, chunk) => {
                if (chunk.name && !chunk.name.includes('node_modules')) {
                    acc.push(path.join(__dirname, './src', chunk.name));
                }
                return acc;
            }, []);
    
            resolve(usedFileList);
        })
    })
}

// 文件遍历方法
function getFileDir(src) {
    try {
        let list = [];
        const filePath = path.resolve(__dirname, src);
        const fileList = readdirSync(filePath);

        fileList.map(file => {
            //获取当前文件的绝对路径
            const fileDir = path.join(filePath, file);
            const isDir = getIsDir(fileDir);

            if (isDir) {
                list = list.concat(getFileDir(fileDir));
            } else {
                list.push(fileDir);
            }
        }, []);

        return list;
    } catch(err) {
        console.warn(err);
    }
}

// 根据文件路径，返回文件列表
function readdirSync(filePath) {
    return fs.readdirSync(filePath);
}

// 根据文件路径，判断文件是否是文件夹
function getIsDir(fileDir) {
    const statInfo = fs.statSync(fileDir);
    // return statInfo.isFile(); // 是文件
    return statInfo.isDirectory(); // 是文件夹
}
