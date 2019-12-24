const Influx = require('influxdb-nodejs');
const client = new Influx('http://34.92.115.122:8086/mydb');

client.query('http')
    .addFunction('max', 'use')
    .addGroup('type')
    .subQuery()
    .addFunction('sum', 'max')
    .then(data => {
        // { name: 'http', columns: [ 'time', 'sum' ], values: [ [ '1970-01-01T00:00:00Z', 904 ] ] }
        console.info(data.results[0].series[0]);
    }).catch(console.error);