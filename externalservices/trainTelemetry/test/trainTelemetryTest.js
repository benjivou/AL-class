const mongoose = require('mongoose');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
var server = require('../index.js');




chai.use(chaiHttp);




describe('/GET train details for one trip',  () => {

    it('should get train details',  (done) => {

        chai.request('http://localhost:3005').get('/train/ABCDEFGH/Ab34782').end((err, res) => {
            console.log(res.body);
            res.should.have.status(200);

            done();
        });
    })
});


describe('/GET train stops',  () => {

    it('should get train stops',  (done) => {

        chai.request('http://localhost:3005').get('/train/stops/ABCDEFGH/Ab34782').end((err, res) => {
            console.log(res.body);
            res.should.have.status(200);

            done();
        });
    })
});


describe('/GET train position',  () => {

    it('should get train position',  (done) => {

        chai.request('http://localhost:3005').get('/train/currentStop/ABCDEFGH/Ab34782').end((err, res) => {
            console.log(res.body);
            res.should.have.status(200);

            done();
        });
    })
});
