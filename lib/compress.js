var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var pngquant = require('node-pngquant-native');
var images = require('images');
/**
 * @desc 文件校验
 */
function validate(sourPath) {
    var isExist = fs.existsSync(sourPath);
    if (!isExist) console.error('目录不存在');
    return isExist;
}
/**
 * @desc png图片压缩
 *  */
function compressPng(src, dest) {
    fs.readFile(src, function (err, buffer) {
        if (err) throw err;
        var resBuffer = pngquant.compress(buffer, {
            "speed": 1 //1 ~ 11
        });
        fs.writeFile(dest, resBuffer, {
            flags: 'wb'
        }, function (err) {
            if (err) console.log('error log: ', err);
        });
    });
}
/**
 * @desc jpg图片压缩
 *  */
function compressJpg(src, dest) {
    images(src).save(dest, {
        quality: 50
    })
}
/**
 * @desc 单文件压缩
 * @param src 输入 
 * ps: src不可存在空格
 * @param dest 输出
 */
function singleCompress(src, dest) {
    var suffixExp = /^\S+\.(jpg|png|svg|jpeg)$/;
    var suffix = (src.replace(/\s/g, '')).replace(suffixExp, '$1');
    var isFile = /\.\w+$/.test(dest);
    var srcArr = src.split('/');
    var len = srcArr.length;
    var sourceFileName = srcArr[len - 1];
    var _dest = isFile ? dest : (dest + '/' + sourceFileName).replace(/\/+/g, '/')
    // check dest exist
    if(!isFile && !fs.existsSync(dest)) {
        mkdirp.sync(dest)
    }
    switch (suffix.toLocaleLowerCase()) {
        case 'png':
            compressPng(src, _dest);
            break;
        case 'jpg':
        case 'jpeg':
            compressJpg(src, _dest);
            break;
    }
}
/**
 * @desc 多文件压缩
 */
function batchCompress(src, dest) {
    fs.stat(src, function (err, stat) {
        if (err) console.log('error log: ', err);
        else {
            // single
            if (stat.isFile()) {
                singleCompress(src, dest);
                return;
            }
            // batch
            // *.{jpg|png|jpeg|svg} || dirs

        }
    })
}
/**
 * @desc 压缩
 * @main
 */
function Compress() {
    this.src = '';
    this.dest = '';
}
Compress.prototype = {
    execute(conf) {
        var src = this.src = path.resolve(process.cwd(), conf.src);
        var dest = this.dest = path.resolve(process.cwd(), conf.dest);
        if (validate(src)) {
            fs.stat(src, function (err, stat) {
                if (err)
                    console.log('error log:', err);
                else
                    batchCompress(src, dest);
            })
        }
    },
}
module.exports = new Compress;