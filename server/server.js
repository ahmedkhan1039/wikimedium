const express = require('express');
const service = require('./app/services/wikiService');

const app = express();
const router = express.Router();
const port = process.env.PORT || 8080;

/*
    For CORS Filter: (CROSS DOMAIN Access)
*/
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/*
    Route Defination: Taking a article Name as parameter.
*/
router.route('/article/:articleName').get((req, res) => {
    service.getArticleContent(req.params.articleName)
        .then(body => {
            const { title , extract } = body.query.pages[body.query.pageids[0]];
            res.send({ title , extract });
        })
        .catch(err => {
            res.send(err);
        });
}
);

app.use('/api', router);

app.listen(port);
console.log(`Server Started on port ${port}`);