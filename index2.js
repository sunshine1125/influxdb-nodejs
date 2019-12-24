const Influx = require('influxdb-nodejs');
const client = new Influx('http://34.92.115.122:8086/mydb');

function loginStatus(account, ip, type) {
    client.write('login')
        .tag({
            type,
        })
        .field({
            account,
            ip,
        })
        .queue();
    if (client.writeQueueLength >= 10) {
        client.syncWrite()
            .then(() => console.info('sync write queue success'))
            .catch(err => console.error(`sync write queue fail, ${err.message}`));
    }
}

setInterval(() => {
    loginStatus('vicanso', '127.0.0.1', 'vip');
}, 5000);
