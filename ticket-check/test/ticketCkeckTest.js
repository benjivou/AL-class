const mongoose = require('mongoose');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
var server = require('../index.js');




chai.use(chaiHttp);


describe('/GET check ticket1',  () => {

    it('check whether the ticket is valid or not by its id ',  (done) => {

        chai.request('http://localhost:3003').get('/ticketCheck/rf379190').end((err, res) => {

            console.log(res.body)
            res.should.have.status(200);
            done();
        });
    })
});

describe('/GET check ticket2',  () => {

    it('check whether the ticket is valid or not by its id ',  (done) => {

        chai.request('http://localhost:3003').get('/ticketCheck/ticket/rf379190').end((err, res) => {

            console.log(res.body)
            res.should.have.status(200);
            done();
        });
    })
});

