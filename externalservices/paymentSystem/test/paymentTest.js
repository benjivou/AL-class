const mongoose = require('mongoose');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
var server = require('../index.js');

chai.use(chaiHttp);



describe('/POST to bank', () => {

    it('it should accept correct payment card ', (done) => {
        let data = {
            num : "1234567890123456",
            code : "123"
        }
        chai.request('http://localhost:3007')
            .post('/bank')
            .send(data)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

});

