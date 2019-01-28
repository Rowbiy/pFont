var F = require('fontmin');
var path = require('path');
var fs = require('fs');

var fontPath = path.resolve('./asserts/');
var destPath = 'dist';        // 输出路径

module.exports = {
    'fontConfig': {
        '1000': 'YYT.ttf',
        '1001': 'MYT.ttf',
        '1002': 'TTQ.ttf',
        '1003': 'YZQS.ttf',
        '1004': 'MBXS.ttf',
        '1005': 'HYBQ.ttf',
        '1006': 'HLXS.ttf'
    },
    'randomString': function (len) {
        len = len || 32;
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ012345678-';
        var maxPos = chars.length;
        var pwd = '';
        for (i = 0; i < len; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    },
    'getDate': function () {
        var date = new Date();
        var s = date.getFullYear() + '';
        s += date.getMonth() < 10 ? '0' + (date.getMonth() + 1) :  (date.getMonth() + 1 + '');
        s += date.getDate() < 10 ? '0' + date.getDate() : (date.getDate() + '');
        return s;
    },
    'generate': function (owner, fontId, str, success, fail) {
        var fontSrc = path.resolve(fontPath, this.fontConfig[fontId]);
        var operationDay = this.getDate();
        var destSrc = path.resolve(destPath, owner, operationDay);
        var d = new Date().getTime().toString();
        var fontName = d.substring(7, d.length) + this.randomString(10);
        var dirName = path.resolve(destSrc, fontName);
        var that = this;


        // 初始化
        var f = new F()
            .src(fontSrc)                  // 输入配置
            .use(F.glyph({                 // 字型提取插件
                text: str                  // 所需文字
            }))
            // .use(Fontmin.ttf2eot())     // eot 转换插件
            // .use(Fontmin.ttf2woff())    // woff 转换插件
            // .use(Fontmin.ttf2svg())     // svg 转换插件
            .dest(dirName);

        // 执行
        f.run(function (err, files, stream) {
            if (err) {                  // 异常捕捉
                fail(err);
                return;
            }

            fs.rename(path.resolve(dirName, that.fontConfig[fontId]), path.resolve(dirName, fontName + '.ttf'), function (err) {
                    if(err){
                        fail(err);
                        return;
                    }
                    var cssText = "@font-face {\n   font-family: '" + fontName +
                        "';\n   src: url('./" + fontName + ".ttf') format('TrueType');\n" +
                        "   font-weight: normal;\n" +
                        "   font-style: normal;\n" +
                        "   font-display: swap;\n}\n";
                    fs.writeFile(path.resolve(dirName, fontName + '.css'), cssText,  function(err) {
                        if (err) {
                            fail(err);
                            return;
                        }
                        var result = {
                            'dirUrl': '/' + destPath + '/' + owner + '/' + operationDay + '/' + fontName,
                            'fontName': fontName
                        };
                        success(result);
                    });
            });
        });
    }
}

