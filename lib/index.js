var commander = require('commander');
var path = require('path');
var pkg = require('./../package.json');
var compress = require('./compress').execute;
; require('colors');
commander
    .version(pkg.version, '-v, --version')
    .command('compress <source> [destination]')
    .description('轻量级图片压缩工具')
    .option('-q, --quality <value>', '设置压缩图片质量0～100')
    .option('-s, --speed <value>', '设置压缩速度1～11，默认为3，速度10以上，图片质量大概会降低5%左右，但压缩速度会提升8倍！！！')
    .action(function (src, dest, cmd) {
        var speed = cmd.speed;
        var quality = cmd.quality;
        compress({ src, dest, speed, quality }, function (fileName, sourSize, destSize) {
            var log = '文件' + fileName.blue + ': ' + ('(源文件大小：' + sourSize + 'KB，压缩后文件大小：' + destSize + 'KB)').red + '，' + ('压缩率为 ' + ((sourSize - destSize) * 100 / sourSize).toFixed(2) + '%').green;
            console.log(log);
        })
    })
commander.on('--help', function () {
    console.log('🏠  欢迎使用哈皮图片压缩工具'.yellow)
    console.log('$ -s <value> 设置压缩速度1～11，默认为3，速度10以上，图片质量大概会降低5%左右，但压缩速度会提升8倍！！！'.yellow);
    console.log('$ -q <value> 设置压缩图片质量0～100'.yellow);
    console.log('')
    console.log('👽  Example:')
    console.log('')
    console.log('$ hapi compress <source> <dest>'.blue)
    console.log('')
});
commander.parse(process.argv)