var request = require('request');

var getArticleContent = function getArticle(articleName, callback) {
    var uri = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&redirects=true&indexpageids=&titles='.concat(articleName);
    request(uri, function (error, response, body) {
        var articleData = JSON.parse(body);
        articleData = articleData.query.pages[articleData.query.pageids[0]];
        callback(error, response, articleData);
    });

}

var serviceObject = {
    "getArticleContent": getArticleContent
}

module.exports = serviceObject;