const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const api = require('./api');

module.exports = (cb) => {
    const app = express();
    app.disable('x-powered-by');
    app.use(cors());
    app.use(bodyParser.json({}));
    app.use(morgan('[:date[iso]] :method :url :status :response-time ms - :res[content-length]'));
    app.use('/api', api);
    app.use('*', (req, res) => res.status(404).end());
    var port = process.argv[2];
    console.log(port);
    if(port == undefined){
        port = 8880;
    }
    const server = app.listen(process.env.PORT || port, () => cb && cb(server));
};
