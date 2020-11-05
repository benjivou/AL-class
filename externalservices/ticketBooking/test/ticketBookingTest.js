const mongoose = require('mongoose');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
var server = require('../index.js');




chai.use(chaiHttp);




describe('/GET getAllTicket',  () => {

    it('should get all ticket for one trip',  (done) => {

        chai.request('http://localhost:3004').get('/tickets/Ab34735').end((err, res) => {
            console.log(res.body);
            res.should.have.status(200);

            done();
        });
    })
});

setTimeout((function() {
    return process.exit(0);
}), 2000);