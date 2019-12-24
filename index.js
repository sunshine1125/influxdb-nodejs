const Influx= require('influxdb-nodejs');
const client = new Influx('http://34.92.115.122:8086/mydb');

// i --> integer
// s --> string
// f --> float
// b --> boolean
const fieldSchema = {
    use: 'i',
    bytes: 'i',
    urls: 's'
};

const tagSchema = {
  spdy: ['speedy', 'fast', 'slow'],
  method: '*',
  type: ['1', '2', '3', '4', '5']
};

client.schema('http', fieldSchema, tagSchema, {
    stripUnknown: true
});

client.write('http')
    .tag({
        spdy: 'fast',
        method: 'GET',
        type: '2'
    })
    .field({
        use: 300,
        bytes: 2312,
        url: 'https://github.com/vicanso/influxdb-nodejs'
    })
    .then(() => console.info('write point success'))
    .catch(console.error);

// query influxdb with multi where condition
// client.query('http')
//     .where('spdy', '1')
//     .where('method', ['GET', 'POST'])
//     .where('use', 300, '>=')
//     .then((result) => console.log(result))
//     .catch(console.error);

// query influxdb using function
// client.query('http')
//     .where('spdy', '1')
//     .addFunction('count', 'url')
//     .then(console.info)
//     .catch(console.error)

// client.query('http')
//     .where('spdy', '1')
//     .addFunction('bottom', 'use', 5)
//     .then(data => {
//         console.info(data.results[0].series[0]);
//     })
//     .catch(console.error)