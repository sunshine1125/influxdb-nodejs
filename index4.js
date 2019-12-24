const Influx = require('influxdb-nodejs');
const client = new Influx('http://34.92.115.122:8086/mydb');
const reader = client.query('request');
reader.set({
    limit: 2
});
reader.multiQuery();
reader.measurement = 'login';
reader.set({
    limit: 1,
    tz: 'America/Chicago',
});
reader.set({
    format: 'json'
});
reader.then(data => {
    console.info(JSON.stringify(data));
}).catch(console.error);