const express = require('express');
const app = express();
const _ = require('lodash');
const Influx = require('influxdb-nodejs');
const client = new Influx('http://34.92.115.122:8086/mydb');
const onHeaders = require('on-headers');

const fieldSchema = {
    use: 'integer',
    code: 'integer',
    bytes: 'integer',
    url: 'string',
};

// set the http stats schema
client.schema('http', fieldSchema);

client.on('writeQueue', () => {
    console.log(client.writeQueueLength);
    // sync write queue if the length is 100
    if (client.writeQueueLength >= 10) {
        client.syncWrite()
            .then(() => {
                console.info('sync write success');
            })
            .catch(console.error);
    }
});

function httpStats(req, res, next) {
    const start = Date.now();
    onHeaders(res, () => {
        console.log(res.statusCode);
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

client.createDatabase().catch(err => {
    console.error('create database fail err: ', err);
});

app.use(httpStats);

// app.use((req, res, next) => {
//     setTimeout(next, _.random(0, 5000));
// });

app.get('/', (req, res) => {
   res.send("hello world");
});

app.get('/users/me', (req, res) => {
    res.json({
        account: 'vicanso',
        name: 'Tree Xie',
    })
});

app.get('/order/:id', (req, res) => {
    res.status(400).json({
        error: 'The id is not valid',
    });
});

app.get('/author/:id', (req, res) => {
    res.status(500).json({
        error: 'The database is disconnected',
    });
});

app.listen(8086, () => {
   console.log('listen on http://localhost:8086')
});