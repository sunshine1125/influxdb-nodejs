const Influx = require('influxdb-nodejs');
const client = new Influx('http://34.92.115.122:8086/mydb');

const fieldSchema = {
    use: 'integer',
    bytes: 'integer',
    url: 'string',
};

const tagSchema = {
  spdy: ['speedy', 'fast', 'slow'],
  method: '*',
  // http stats code: 10x, 20x, 30x, 40x, 50x
  type: ['1', '2', '3', '4', '5'],
};

client.schema('http', fieldSchema, tagSchema, {
    // default is false
    stripUnknown: true,
});

client.write('http')
    .tag({
        spdy: 'fast',
        method: 'GET',
        type: '2',
    })
    .field({
        use: 300,
        bytes: 2312,
        url: 'https://github.com/vicanso/influxdb-nodejs',
    })
    .queue();

const writer = client.write('http')
    .tag({
        spdy: 'slow',
        method: 'GET',
        type: '2',
    })
    .field({
        use: 3000,
        bytes: 2312,
        url: 'https://github.com/vicanso/influxdb-nodejs',
    })
    .queue();

client.syncWrite()
    .then(() => console.info('sync write queue success'))
    .catch(err => console.error(`sync write queue fail, err: ${err.message}`));
console.info(writer.toJSON());

// const client = new Influx('http://34.92.115.122:8086/tt');
// client.createDatabase()
//     .then(() => console.info('create database success'))
//     .catch(err => console.error(`create database fail, ${err.message}`));