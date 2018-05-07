var express = require('express');
var app = express();
var service = require('./app/services/wikiService');

var port = process.env.PORT || 8080;

var router = express.Router();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.get('/', function (req, res) {
    res.json({ message: 'Hello World' });
});

router.route('/article/:articleName').get(function (req, res) {
    service.getArticleContent(req.params.articleName, function(err,response,data){
        if(!err){
          res.send(data);   
        }
    });
});

app.use('/api', router);


app.listen(port);
console.log('Server Started on port ' + port);