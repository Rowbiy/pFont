
var express = require('express');
var ejs     = require('ejs');
var app     = express();
var bodyParser = require('body-parser');
var fontmin = require('./fontmin')

app.set('views', './');
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.use(express.static('static'));
app.use('/bower', express.static('bower_components'));
app.use('/dist', express.static('dist'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    res.render('index', function (err, html) {
        if(err){
            console.log(err);
            return;
        }
        res.send(html);
    });
});
app.post('/getFont', function(req, res) {
    var param = req.body;
    var fontId = param.fontId || '';
    var source = param.source;
    if(source !== 'official'){
        res.send('error');
        return;
    }
    var str = param.fontText || '';
    fontmin.generate(source, fontId, str, function (r) {

        var cssName = r.fontName + '.css';
        var cssUrl = "<link href='" + (r.dirUrl + '/' + cssName) + "' rel='stylesheet' type='text/css'/>";
        var obj = {
            'resultCode': '000000',
            'resultData': {
                'cssUrl': cssUrl,
                'fontName': r.fontName
            }
        }
        res.status(200).send(obj);
    }, function (err) {
        res.status(500).send(err);
    })
});

app.listen(3000, function () {
    console.log('App is listening on : http://localhost:3000')
});