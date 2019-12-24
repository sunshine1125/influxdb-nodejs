const express = require('express');
const app = express();
const _ = require('lodash');
const Influx= require('influxdb-nodejs');
const client = new Influx('http://34.92.115.122:8086/test');
const onHeaders = require('on-headers');

// set the http stats schema
client.schema('http', {
    use: 'integer',
    code: 'integer',
    bytes: 'integer',
    url: 'string',
});

client.on('writeQueue', () => {
    // sync write queue if the length is 100
    if (client.writeQueueLength >= 1) {
        client.syncWrite()
            .then(() => {
                console.info('sync write success');
            })
            .catch(console.error);
    }
});

function httpStats(req, res, next) {
    console.log(req.path);
    const start = Date.now();
    onHeaders(res, () => {
        const code = res.statusCode;
        const use = Date.now() - start;
        const method = req.method;
        const bytes = parseInt(res.get('Content-Length') || 0, 10);
        const tags = {
            spdy: _.sortedIndex([100, 300, 1000, 3000], use),
            type: code / 100 | 0,
            method,
        };
        const fields = {
            use,
            code,
            bytes,
            url: req.url,
            route: req.path
        };
        // use queue for better performance
        client.write('http')
            .tag(tags)
            .field(fields)
            .queue();
    });
    next();
}


const init = () => {
    client.showDatabases()
        .then(databases => {
            if (!databases.includes('test')) {
                return createDatabase();
            }
        })
        .catch(console.error);
};

const createDatabase = () => {
    client.createDatabase()
        .then(() => console.info('create database success'))
        .catch(err => console.error(`create database fail, ${err.message}`));
};

init();

app.use(httpStats);

app.use((req, res, next) => {
    setTimeout(next, _.random(0, 5000));
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/users/me', (req, res) => {
    res.json({
        account: 'vicanso',
        name: 'Tree Xie',
    });
});

app.get('/book/:id', (req, res) => {
    const { id } = req.params;
    res.json({
        id: id,
        name: 'my book',
        author: 'vicanso',
    });
});

app.get('/order/:id', (req, res) => {
    const code = _.sample([200, 304, 400, 403]);
    switch (code) {
        case 304:
            res.status(304).send('');
            break;
        case 400:
            res.status(400).json({
                error: 'The id is not valid',
            });
            break;
        case 403:
            res.status(403).json({
                error: 'Please login first',
            });
            break;
        default:
            res.json({
                account: 'vicanso',
            });
            break;
    }
});

app.get('/author/:id', (req, res) => {
    const code = _.sample([200, 304, 500]);
    switch (code) {
        case 304:
            res.status(304).send('');
            break;
        case 500:
            res.status(500).json({
                error: 'The database is disconnected',
            });
            break;
        default:
            res.json({
                account: 'vicanso',
            });
            break;
    }
});

app.listen(3000, () => {
   console.log('listen on http://localhost:3000');
});


