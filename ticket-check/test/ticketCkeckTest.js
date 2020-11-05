const mongoose = require('mongoose');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
var server = require('../index.js');




chai.use(chaiHttp);


describe('/GET check ticket1',  () => {

    it('check whether the ticket is valid or not by its id ',  (done) => {

        chai.request('http://localhost:3003').get('/ticketCheck/rf379190?controllerId=5f99ac7584b0c83808bb1a95').end((err, res) => {

            res.should.have.status(200);
            done();
        });
    })
});


setTimeout((function() {
    return process.exit(0);
}), 2000);
