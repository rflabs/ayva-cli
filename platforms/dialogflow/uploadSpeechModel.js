var path = require('path')
var rp = require('request-promise')
var dialogflowBaseURI = "https://api.dialogflow.com/v1/intents/"
var ayvaConfigPath = path.join(process.env.PWD || process.cwd(), "/ayva.json")
var emptyIntentBody = require('./basicIntent.js')

var ayvaConfig = {};
var uploadSpeechModelToDialogflow = function(){
    ayvaConfig = require(ayvaConfigPath)
    var speechModel = require(path.join(process.env.PWD||process.cwd(), ayvaConfig.pathToSpeechModel))
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
    var dialogflowIntent = emptyIntentBody();
    var intentBody = Object.assign({}, dialogflowIntent, {"name": intentConfig.name})
    intentBody.responses.unshift({"action": intentConfig.name, "parameters":[]})

    if(dialogflowModel[intentConfig.name])
    {
        intentBody.id = dialogflowModel[intentConfig.name]
        method = "PUT"
        dialogflowURI += intentBody.id
    }

    for (var u in intentConfig.utterances){
        intentBody.userSays.unshift({"data": []})
        var utterance = intentConfig.utterances[u].replace(/'/g, '"')
        formatUtterance(utterance, intentBody.userSays[0].data, intentConfig.slots)
    }

    for (let i in intentConfig.events) {
        intentBody.events.push({"name":intentConfig.events[i]})
    }

    for (let s in intentConfig.slots) {
        intentConfig.slots[s].name = s;
        intentConfig.slots[s].value = "$" + s;
        intentBody.responses[0].parameters.push(intentConfig.slots[s])
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

var formatUtterance = function(utterance, requestFormat, slots){
    if(utterance.length == 0) 
        return;

    let slotBegin = utterance.indexOf("{");
    if(slotBegin == -1)
        return requestFormat.push({"text": utterance});

    if(slotBegin != 0){
        requestFormat.push({"text": utterance.substring(0, slotBegin)});
    } else {
        var slotEnd = utterance.indexOf('}');
        var slotFromUtterance = JSON.parse(utterance.substring(0, slotEnd+1))
        var slotName = Object.keys(slotFromUtterance)[0]
        requestFormat.push({"alias": slotName, "text": slotFromUtterance[slotName], "userDefined": false, "meta": slots[slotName].dataType})
        slotBegin = slotEnd+1
    }
    formatUtterance(utterance.substring(slotBegin), requestFormat, slots)
}

module.exports = uploadSpeechModelToDialogflow