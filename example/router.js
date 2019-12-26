const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const client = require('./schema');
const middlewares = require('./middlewares');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/create', middlewares, (req, res) => {
    const { tag, field } = req.body;
    client.write('http')
        .tag(tag)
        .field(field)
        .then(() => {
            console.info('write point success');
            res.send('write point success');
        })
        .catch(err => {
            console.error(err);
            res.send(err);
        });
});

app.get('/query', (req, res) => {
    const { type, spdy } = req.query;
    client.query('http')
        .where('type', type)
        .where('spdy', spdy)
        .then(result => {
            if (result.results[0].series) {
                console.log(result.results[0].series[0]);
                res.json(result.results[0].series[0]);
            }
        })
        .catch(err => {
            console.error(err);
            res.send(err);
        });
});

module.exports = app;