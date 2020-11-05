const mongoose = require('mongoose');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
var server = require('../index.js');




chai.use(chaiHttp);


    describe('/GET getToken',  () => {

        it('should get the specific controller token from the database',  (done) => {

             chai.request('http://localhost:3001').get('/authentification/getToken/julien/julien').end((err, res) => {

                 res.should.have.status(200);
                 res.body.token.should.equal("5f99ac7584b0c83808bb1a95")
                 done();
            });

        })

});


setTimeout((function() {
    return process.exit(0);
}), 2000);




