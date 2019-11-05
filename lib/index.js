var commander = require('commander');
var pkg = require('./../package.json');
var compress = require('./compress').execute;
commander
    .version(pkg.version, '-v, --version')
    .command('compress <source> [destination]')
    .description('轻量级图片压缩工具')
    .action(function (src, dest) {
        compress({ src, dest })
    })
commander.parse(process.argv)