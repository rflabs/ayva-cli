var path = require('path')
var rp = require('request-promise')
var dialogflowBaseURI = "https://api.dialogflow.com/v1/intents/"
var ayvaConfigPath = path.join(process.env.PWD, "/ayva.json")
var getDialogflowBody = require('./basicIntent.js')

var ayvaConfig = {};
var uploadSpeechModelToDialogflow = function(){
    ayvaConfig = require(ayvaConfigPath)
    var speechModel = require(path.join(process.env.PWD, ayvaConfig.pathToSpeechModel))
    var dialogflowModel ={}
    getDialogflowModel(ayvaConfig)
        .then(function(res){
            dialogflowModel = res;
            speechModel.intents.map((intentConfig) => {
                syncIntentWithDialogflow(intentConfig, dialogflowModel)
            })
        })
}

var getDialogflowModel = function(ayvaConfig){
    return new Promise(function(resolve,reject){
        var options = {
            method: 'GET',
            uri: dialogflowBaseURI,
            headers: {
                'Authorization': 'Bearer ' + ayvaConfig.dialogflow.developerAccessToken
            }
        };
    
        rp(options)
            .then(function(res){
                res = JSON.parse(res)
                var model = {}
                res.map((intent) => {
                    model[intent.name] = intent.id
                })
                resolve(model);
            })
    })
}

var syncIntentWithDialogflow = function(intentConfig, dialogflowModel){
    var method = "POST"
    var dialogflowURI = dialogflowBaseURI;
    var dialogflowIntent = getDialogflowBody();
    var intentBody = Object.assign({}, dialogflowIntent, {"name": intentConfig.name})
    intentBody.responses.push({"action": intentConfig.name})

    if(dialogflowModel[intentConfig.name])
    {
        intentBody.id = dialogflowModel[intentConfig.name]
        method = "PUT"
        dialogflowURI += intentBody.id
    }

    for (var u in intentConfig.utterances){
        intentBody.userSays.push({"data":[{"text": intentConfig.utterances[u]}]})
    }

    for (let i in intentConfig.events) {
        intentBody.events.push({"name":intentConfig.events[i]})
    }
    
    var options = {
        method: method,
        uri: dialogflowURI,
        headers: {
            'Authorization': 'Bearer ' + ayvaConfig.dialogflow.developerAccessToken
        },
        body: intentBody,
        json: true
    };

    rp(options)
        .then(function (parsedBody) {
            console.log(parsedBody)
        })
        .catch(function (err) {
            console.log(err.error)
        });
}

module.exports = uploadSpeechModelToDialogflow