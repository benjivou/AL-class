const {Given, When, Then, AfterAll, After} = require('cucumber');
const assert = require('assert').strict
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);



/***************************** scenario authentification ******************************/
let context = [];

Given('controller connect with {} and {}', async function (user,pwd) {
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





/***************************** scenario1 : valid ticket ******************************/
let scenario = []
let token = '';

Given('controller connect to the app with {} and {} then he scan the {} code from the ticket', async function (user,pwd,qr) {
    scenario.push(user);
    scenario.push(pwd);
    scenario.push(qr)

});

When('controller send GET request to ticket ckeck service', (done) => {
    chai.request('http://localhost:3001').get('/authentification/getToken/'+scenario[0]+'/'+scenario[1]).end((err, res) => {
        token = res.body.token;


    });


    chai.request('http://localhost:3003').get('/ticketCheck/'+scenario[2]+'?controllerId='+token).end((err, res) => {

        scenario.push(res.body.result);
        scenario.push(res.body.type);
        done();
    });



});

Then('controller receive {} and {}', async function (result,type) {

    assert.deepEqual(scenario[3].toString(), result);
    assert.deepEqual(scenario[4], type);
});


/***************************** scenario2 : unvalid ticket ******************************/
let s = []


Given('connexion with {} and {} and ticket {} code', async function (user,pwd,qr) {
    s.push(user);
    s.push(pwd);
    s.push(qr)

});

When('send GET request to ticket ckeck service', (done) => {

    chai.request('http://localhost:3001').get('/authentification/getToken/'+s[0]+'/'+s[1]).end((err, res) => {
        t = res.body.token;


    });


    chai.request('http://localhost:3003').get('/ticketCheck/'+s[2]+'?controllerId='+token).end((err, res) => {

        s.push(res.body.result);
        s.push(res.body.type);

    });


    let d = {
        type : "falsified",
        controllerId : "5f99ac7584b0c83808bb1a95"
    }
    chai.request('http://localhost:3006').post('/declare/fraud').send(d).end((err, res) => {

        s.push(res.body.fraudId);

    });


    let da = {
        fraudId : s[5]
    }
    chai.request('http://localhost:3006').put('/pay/cash').send(da).end((err, res) => {

        s.push(res.body.fraudId);
        done();
    });

});


Then('the result are {} and {} and {}', async function (result,type,paymentCheck) {

    assert.deepEqual(s[3].toString(), result);
    assert.deepEqual(s[4], type);
    assert.deepEqual(s[6], paymentCheck);

});




