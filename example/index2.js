const express = require('express');
const app = express();
const client = require('./schema');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const checkDatabase = (req, res, next) => {
    client.showDatabases()
        .then(database => {
            if (!database.includes('myTest')) {
                return createDatabase();
            }
        })
        .catch(console.error);
    next();
};

const createDatabase = () => {
    client.createDatabase()
        .then(() => console.info('create database success'))
        .catch(err => console.error(`create database fail, ${err.message}`));
};

app.post('/create', checkDatabase, (req, res) => {
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

app.listen(1125, () => {
    console.log('listen on http://localhost:1125');
});