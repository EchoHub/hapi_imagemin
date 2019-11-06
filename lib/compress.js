var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var pngquant = require('node-pngquant-native');
var images = require('images');
var suffixExp = /^\S+\.(jpg|png|svg|jpeg)$/;
// 默认速度为3，质量为80
var speed = 3;
var quality = 90;
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
function compressPng(conf, cb) {
    var src = conf.src, dest = conf.dest;
    fs.readFile(src, function (err, buffer) {
        if (err) throw err;
        var resBuffer = pngquant.compress(buffer, {
            speed,
            quality: quality
        });
        fs.writeFile(dest, resBuffer, {
            flags: 'wb'
        }, function (err) {
            if (err) {
                console.log('error log: ', err);
                return;
            }
            cb(src, buffer.length / 1000, resBuffer.length / 1000)
        });
    });
}
/**
 * @desc jpg图片压缩
 *  */
function compressJpg(conf, cb) {
    var src = conf.src, dest = conf.dest;
    images(src).save(dest, {
        quality
    })
    var image = fs.readFileSync(src);
    var _image = fs.readFileSync(dest);
    cb(src, image.length / 1000, _image.length / 1000)
}
/**
 * @desc 单文件压缩
 * @param src 输入 
 * ps: src不可存在空格
 * @param dest 输出
 */
function singleCompress(conf, cb) {
    var src = conf.src, dest = conf.dest;
    var suffix = (src.replace(/\s/g, '')).replace(suffixExp, '$1');
    var isFile = /\.\w+$/.test(dest);
    var srcArr = src.split('/');
    var len = srcArr.length;
    var sourceFileName = srcArr[len - 1];
    var _dest = isFile ? dest : (dest + '/' + sourceFileName).replace(/\/+/g, '/')
    // check dest exist
    if (!isFile && !fs.existsSync(dest)) {
        mkdirp.sync(dest)
    }
    switch (suffix.toLocaleLowerCase()) {
        case 'png':
            compressPng({ src, dest: _dest }, cb);
            break;
        case 'jpg':
        case 'jpeg':
            compressJpg({ src, dest: _dest }, cb);
            break;
    }
}
/**
 * @desc 多文件压缩
 */
function batchCompress(conf, cb) {
    var src = conf.src, dest = conf.dest;
    fs.stat(src, function (err, stat) {
        if (err) console.log('error log: ', err);
        else {
            // single
            if (stat.isFile()) {
                singleCompress({ src, dest }, cb);
                return;
            }
            // batch
            // *.{jpg|png|jpeg|svg} || dirs
            else if (stat.isDirectory()) {
                if (!fs.existsSync(dest)) mkdirp(dest)
                const files = fs.readdirSync(src);
                for (const item of files) {
                    var _src = src + '/' + item;
                    var _dest = dest + '/' + item;
                    batchCompress({ src: _src, dest: _dest }, cb);
                }
            }
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
    execute(conf, cb) {
        var src = this.src = path.resolve(process.cwd(), conf.src),
            dest = this.dest = path.resolve(process.cwd(), conf.dest);
        conf.speed && (speed = conf.speed);
        conf.quality && (quality = conf.quality);
        if (validate(src)) {
            fs.stat(src, function (err, stat) {
                if (err)
                    console.log('error log:', err);
                else
                    batchCompress({ src, dest }, cb);
            })
        }
    },
}
module.exports = new Compress;