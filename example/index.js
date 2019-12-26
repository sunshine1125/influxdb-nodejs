// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');
const app = require('./router');

// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());

// app.use(routes);

app.listen(1125, () => {
    console.log('listen on http://localhost:1125');
});