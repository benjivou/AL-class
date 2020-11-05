const {Given, When, Then, AfterAll, After} = require('cucumber');
const assert = require('assert').strict
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);



/***************************** scenario authentification ******************************/
console.log( "scenario1 : -> scenario authentification")
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





/***************************** scenario2 : valid ticket ******************************/
console.log( "scenario2 : -> the controller connect to the app and check a valid ticket")
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


/***************************** scenario3 : unvalid ticket ******************************/
console.log( "scenario3 : -> the controller connect to the app and check unvalid ticket and declare fraud ( cash payment )")
let s = []
let t = ""

let resul = "false"
let typ  =  "ticket unfound"
let pay    = "Already paid !"
let fraudId  = ""

Given('connexion with {} and {} and ticket {} code', async function (user,pwd,qr) {
    s.push(user);
    s.push(pwd);
    s.push(qr)

});

When('send GET request to ticket ckeck service', (done) => {

    chai.request('http://localhost:3001').get('/authentification/getToken/'+s[0]+'/'+s[1]).end((err, res) => {
        t = res.body.token;

    });


    chai.request('http://localhost:3003').get('/ticketCheck/'+s[2]+'?controllerId='+t).end((err, res) => {

        resul = res.body.result;
        typ  = res.body.type;

    });


    let d = {
        type : "falsified",
        controllerId : "5f99ac7584b0c83808bb1a95"
    }
    chai.request('http://localhost:3006').post('/declare/fraud').send(d).end((err, res) => {

        fraudId = res.body.fraudId;
        done();
    });


    let da = {
        fraudId : fraudId
    }
    chai.request('http://localhost:3006').put('/pay/cash').send(da).end((err, res) => {

        pay = res.body.msg;
        done();
    });

});

Then('the result are {} and {} and {}', async function (result,type,paymentCheck) {

    assert.deepEqual(resul, result);
    assert.deepEqual(typ, type);
    assert.deepEqual(pay, paymentCheck);

});

/***************************** scenario4 : valid ticket with reduced price ******************************/
console.log( "scenario4 : -> the controller connect to the app and check valid ticket but not reduced and declare fraud ( cart payment )")
let tab = []
let id = ""

let re = "true"
let ty =  "reduced"
let pa    = "true"
let fraud  = ""

Given('the controller {} and {} and ticket {} code', async function (user,pwd,qr) {
    s.push(user);
    s.push(pwd);
    s.push(qr)

});

When('send the request to ticket check to verify', (done) => {

    chai.request('http://localhost:3001').get('/authentification/getToken/'+tab[0]+'/'+tab[1]).end((err, res) => {
        id = res.body.token;

    });


    chai.request('http://localhost:3003').get('/ticketCheck/'+tab[2]+'?controllerId='+id).end((err, res) => {

        re = res.body.result;
        ty = res.body.type;

    });


    let d = {
        type : "falsified",
        controllerId : "5f99ac7584b0c83808bb1a95"
    }
    chai.request('http://localhost:3006').post('/declare/fraud').send(d).end((err, res) => {

        fraud = res.body.fraudId;
        done();
    });


    let da = {
        fraudId : fraud
    }
    chai.request('http://localhost:3006').put('/pay/cb').send(da).end((err, res) => {

        pa = res.body.msg;
        done();
    });

});

Then('the controller verify the payment {} and {} and {}', async function (result,type,paymentCheck) {

    assert.deepEqual(re, result);
    assert.deepEqual(ty, type);
    assert.deepEqual(pa, paymentCheck);

});

