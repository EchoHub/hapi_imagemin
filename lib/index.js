var commander = require('commander');
var path = require('path');
var pkg = require('./../package.json');
var compress = require('./compress').execute;
; require('colors');
commander
    .version(pkg.version, '-v, --version')
    .command('compress <source> [destination]')
    .description('轻量级图片压缩工具')
    .action(function (src, dest) {
        compress({ src, dest }, function (fileName, sourSize, destSize) {
            var log = '文件' + fileName.blue + ': ' + ('(源文件大小：' + sourSize + 'KB，压缩后文件大小：' + destSize + 'KB)').red + '，' + ('压缩率为 ' + ((sourSize - destSize) * 100 / sourSize).toFixed(2) + '%').green;
            console.log(log)
        })
    })
commander.parse(process.argv)