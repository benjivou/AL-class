const express  = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const nodeCmd = require('node-cmd');
const app =  express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var urls = ['http://localhost:3003/ticketCheck/'];                                         // point d'entre des serveurs
var ports = ['3003','3103','3203','3303','3403','3503','3603','3703','3803','3903'];     // les port de tout les serveurs
var currentUrl = 0;                                                                     // le serveur utiliser maitenant
var waitingQueueRequests = [];                                                         // tous les requete envoyer par les controleurs
var openTime = [];

function checkCurrentLoad(){
    var date = new Date();
    var taille = waitingQueueRequests.length;
    console.log("La taille de la file d'attente des requètes est de " + taille);


    if(taille >= urls.length * 200)
    {

        console.log("ouverture d'un nouveau serveur pour soulager la charge");
        newServer();

    }

    else if(urls.length > 1
        && taille <= 200*urls.length
        && moreThanXMinutes(date.getMinutes(), date.getHours(), openTime[openTime.length-1][1],openTime[openTime.length-1][0],1))

    {
        console.log("fermeture d'un serveur pour limiter les couts");
        killServer();
    }


    setTimeout(checkCurrentLoad,2000);
}

checkCurrentLoad();

function moreThanXMinutes(minNow, hourNow, minOpen, hourOpen,min){
    if(hourNow === hourOpen){
        if(minNow-minOpen>min){
            return true
        }
        return false;
    }else{
        if(60-minOpen + minNow > min){
            return true;
        }
        return false;
    }
}

function pickWaitingQueueAndSend() {

    if(waitingQueueRequests.length > 0){

        //console.log('J ai une requete a envoyer');
        var temp = waitingQueueRequests.pop();
        var req = temp[0];
        var res = temp[1];

        var url_to_send = urls[currentUrl];
        if(url_to_send == undefined){
            url_to_send = urls[0];
        }
        //console.log('envoie au serveur au ports : ' + url_to_send+req.params.id);
        request
            .get(url_to_send+req.params.id)
            .form({"tripId": req.body.tripId,'controller': req.body.controller})
            .on('error',function (err) {
                console.log(err)
            })
            .pipe(res);
        currentUrl = (currentUrl + 1) % urls.length; // round bin dispatcher les request entre les serveurs ouverts.
    }
    setTimeout(pickWaitingQueueAndSend, 10/urls.length);
}

pickWaitingQueueAndSend();

function newServer(){
    var date = new Date();
    var commandLine = 'node ../ticket-check/app/app.js '+ports[urls.length];
   // setTimeout(function(){ console.log("attendre la connection du serveur"); }, 4000);
    console.log("*************************************************************Serveur ouvert sur le port " + ports[urls.length]);
    nodeCmd.get(commandLine, (err, data, stderr) => console.log(data));
    urls.push('http://localhost:' + ports[urls.length] + '/ticketCheck/')
    openTime.push([date.getHours(),date.getMinutes()]);

}

function killServer(){
    var portToDelete = ports[urls.length-1];
    var commandLine = 'netstat -a -n -o | findstr "0.0.0.0:' + portToDelete + '"';
    console.log(commandLine);
    nodeCmd.get(commandLine, (err, data, stderr) => {
        console.log(data);
        var temp = data.split('LISTENING');
        if(temp[1] != undefined) {
            var tempbis = temp[1].replace(/\s/g, "");
            console.log(tempbis);
            var commandLine = 'taskkill /f /PID ' + tempbis;
            nodeCmd.get(commandLine, (err, data, stderr) => console.log('Server on port ' + portToDelete + ' deleted'));
            urls.pop();
            openTime.pop();
        }
    });
}

app.get('/:id',  (req,res) => {

        waitingQueueRequests.push([req, res]);

});










module.exports = app;