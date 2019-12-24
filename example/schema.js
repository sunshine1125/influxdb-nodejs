const Influx= require('influxdb-nodejs');
const client = new Influx('http://34.92.115.122:8086/myTest');

const fieldSchema = {
    use: 'integer',
    code: 'integer',
    bytes: 'integer',
    url: 'string',
};

const tagSchema = {
    spdy: ['speedy', 'fast', 'slow'],
    method: '*',
    type: [1, 2, 3, 4, 5]
};

client.schema('', fieldSchema, tagSchema, {
    stripUnknown: true,
});

client.createRetentionPolicy('myTest', '1h')
    .then(() => console.info('create retention policy success'))
    .catch(err => console.error(`create retention policy fail, ${err}`));

module.exports = client;