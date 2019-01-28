
var app = window.app || {
    'parentClass': 'select-font',
    'curFontClass': 'cur-font',
    'curFontId': '1006',
    'source': 'official',
    'fontConfig': {
        '1000': '雅韵体',
        '1001': '毛圆体',
        '1002': '甜甜圈体',
        '1003': '一纸情书体',
        '1004': '毛笔行书体',
        '1005': '汉印布青体',
        '1006': '汉隶行书体'
    },
    'setDownFont': function () {
        $('.' + this.curFontClass).html(this.fontConfig[this.curFontId]);
        this.getWebFont(this.curFontId, $('.show-text input').val());
        for(var i in this.fontConfig){
            var p = $('<p></p>');
            p.html(this.fontConfig[i]).attr('data-id', i);
            $("." + this.parentClass).append(p);
        }
    },
    'chooseFont': function (fontId) {
        this.curFontId = fontId;
        $('.' + this.curFontClass).html(this.fontConfig[this.curFontId]);
        $('.select-font').css('display', 'none');
        this.getWebFont(fontId, $('.show-text input').val());
    },
    'getWebFont': function (fontId, text) {
        var that = this;
        $.ajax({
            url: '/getFont',
            type: "post",
            data: JSON.stringify({'fontId': fontId, 'fontText': text, 'source': that.source}),
            contentType: "application/json",
            dataType: "json",
            success: function (r) {
                if(r && r.resultCode === '000000'){
                    var data = r.resultData;
                    $('head').append(data['cssUrl']);
                    $('.show-text input').attr('style', "font-family:'" + data['fontName'] + "'");
                }
            },
            error: function (err) {
                console.log(err);
            }
        })
    }
}

$(function () {
    app.setDownFont();
    $('.select-font').on('click', function (e) {
        var id = $(e.target).attr('data-id');
        app.chooseFont(id);
    })
    $('.show-text input').on('input', function (e) {
        app.getWebFont(app.curFontId, $('.show-text input').val());
    })
})