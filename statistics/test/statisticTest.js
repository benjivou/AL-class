const mongoose = require('mongoose');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
var server = require('../index.js');




chai.use(chaiHttp);


describe('/GET satistics by controller',  () => {

    it('get Number of frauds done by the controller',  (done) => {

        chai.request('http://localhost:3009').get('/stats/controller/frauds/5f99ac7584b0c83808bb1a95').end((err, res) => {

            console.log(res.body)
            res.should.have.status(200);
            done();
        });
    })
});

describe('/GET satistics',  () => {

    it('get Number of controlled tickets by the controller Id',  (done) => {

        chai.request('http://localhost:3009').get('/stats/controller/tickets/5f99ac7584b0c83808bb1a95').end((err, res) => {

            console.log(res.body)
            res.should.have.status(200);
            done();
        });
    })
});

describe('/GET frauds',  () => {

    it('get the total number of frauds',  (done) => {

        chai.request('http://localhost:3009').get('/stats/frauds').end((err, res) => {

            console.log(res.body)
            res.should.have.status(200);
            done();
        });
    })
});

describe('/GET ticket non controlled',  () => {

    it('get the total number of the uncontrolled tickets',  (done) => {

        chai.request('http://localhost:3009').get('/stats/UncontrolledTickets').end((err, res) => {

            console.log(res.body)
            res.should.have.status(200);
            done();
        });
    })
});

describe('/GET ticket controlled',  () => {

    it('get the total number of the controlled tickets',  (done) => {

        chai.request('http://localhost:3009').get('/stats/controlledTickets').end((err, res) => {

            console.log(res.body)
            res.should.have.status(200);
            done();
        });
    })
});

setTimeout((function() {
    return process.exit(0);
}), 2000);