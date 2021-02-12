const mongoose = require('mongoose');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
var server = require('../index.js');




chai.use(chaiHttp);


describe('/GET frauds total for the controller',  () => {

    it('should get frauds total for the controller from the database',  (done) => {

        chai.request('http://localhost:3006').get('/cash/5f99ac7584b0c83808bb1a95').end((err, res) => {

            console.log(res.body);
            res.should.have.status(200);

            done();
        });
    })
});

setTimeout((function() {
    return process.exit(0);
}), 2000);