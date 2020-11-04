const {Given, When, Then, AfterAll, After} = require('cucumber');
const assert = require('assert').strict
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let context = [];
Given('controller connect to the app with {} and {}', async function (user,pwd) {
    context.push(user);
    context.push(pwd);
});

When('I send GET request to authentification service', (done) => {
    chai.request('http://localhost:3001').get('/authentification/getToken/'+context[0]+'/'+context[1]).end((err, res) => {
        context.push(res.body.token) ;
        done();
    });

});

Then(/^I receive (.*)$/, async function (expectedResponse) {
    assert.deepEqual(context[2], expectedResponse);
})



