# 轻量级图片压缩工具
hapi_imagemin 是一款 Node.js轻量级跨平台图像处理工具
```
imagemin compress <source> <dest>
```

## 特征
* 轻 量：无需安装任何图像处理库
* 便 捷：指令化，操作便捷
* 功能强大，支持无损压缩

## 用法
### -s 设置压缩速率
设置图像压缩的速率，压缩速率分为1～11档，默认为3档，其中当speed值大于10时会造成大约5%的图像质量损耗，但压缩速率会提升大约speed为3时的8倍，压缩速率越高，图像品质也会出现偏差。
```
imagemin compress <source> <dest> -s 10
```
### -q 设置压缩品质
设置图像的压缩品质，品质范围在0～100之间。
```
imagemin compress <source> <dest> -q 80
```
