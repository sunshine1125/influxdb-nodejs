const assert = require('assert');
const request = require('supertest');
const app = require('./router');

describe("#test express app", () => {
    let server;
    const mockData = {
        "tag": {
            "spdy": "fast",
            "method": "GET",
            "type": 3
        },
        "field": {
            "use": 3000,
            "code": 200,
            "bytes": 2312,
            "url": "https://github.com/vicanso/influxdb-nodejs"
        }
    };

    before(() => {
       server = app.listen(9999);
    });

    after(() => {
        server.close();
    });

    describe("#test server", () => {
       it('#test post /create', (done) => {
           request(server)
               .post("/create")
               .send(mockData)
               .expect(200, (err, res) => {
                   if (err) {
                       console.log(err);
                       done(err);
                   } else {
                       // console.log(res.body);
                       done();
                   }
               })
       });
    });
});