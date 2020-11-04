const {Given, When, Then, AfterAll, After} = require('cucumber');
const assert = require('assert').strict
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

Given(' controller connect to the app with {} and {}', async function (user,pwd) {
    this.context['username'] = user;
    this.context['pwd'] = pwd;
});

When('I send GET request to authentification service', async function () {
    chai.request('http://localhost:3001').get('/authentification/getToken/'+this.context['username']+'/'+this.context['pwd']).end((err, res) => {

        this.context['response'] = res.body.token;
    });

});

Then(/^I receive (.*)$/, async function (expectedResponse) {
    assert.deepEqual(this.context['response'].data, expectedResponse);
})



