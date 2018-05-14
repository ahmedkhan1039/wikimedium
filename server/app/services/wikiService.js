const fetch = require('node-fetch');

const getArticleContent = (articleName) => {
    const uri = `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&redirects=true&indexpageids=&titles=${articleName}`;

    return fetch(uri).then(
        res => res.json()
    )
    .catch(
        err => {
            throw err;
        }
    );
}

const serviceObject = {
    "getArticleContent": getArticleContent
}

module.exports = serviceObject;