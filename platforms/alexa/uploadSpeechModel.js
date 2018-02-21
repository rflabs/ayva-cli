var path = require('path')
var rp = require('request-promise')
var alexaSMAPI = "https://api.amazonalexa.com/v1"
var ayvaConfigPath = path.join(process.env.PWD, "/ayva.json")
var emptyIntentBody = require('./basicIntent.js')

var ayvaConfig = {};

var uploadSpeechModelToAlexa = function(){
    ayvaConfig = require(ayvaConfigPath)
    var speechModel = require(path.join(process.env.PWD, ayvaConfig.pathToSpeechModel))
    var alexaSpeechModel ={}
    getAlexaModel(ayvaConfig)
        .then(function(res){
            alexaSpeechModel = res;
            speechModel.intents.map((intentConfig) => {
                syncIntentWithAlexa(intentConfig, alexaSpeechModel)
            })
        })
}

var getAlexaModel = function(ayvaConfig){
    return new Promise(function(resolve,reject){
        var options = {
            method: 'GET',
            uri: alexaSMAPI + "/skills/" + ayvaConfig.amazon.skillId + "/stage/development/interactionModel/locales/en-US",
            headers: {
                'Authorization': 'Bearer ' + ayvaConfig.alexa.developerAccessToken
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

var syncIntentWithAlexa = function(intentConfig, alexaSpeechModel){
    var method = "POST"
    var alexaURI = alexaSMAPI;
    var alexaIntent = emptyIntentBody();
    var intentBody = Object.assign({}, alexaIntent, {"name": intentConfig.name})
    intentBody.responses.unshift({"action": intentConfig.name, "parameters":[]})

    if(alexaSpeechModel[intentConfig.name])
    {
        intentBody.id = alexaSpeechModel[intentConfig.name]
        method = "PUT"
        alexaURI += intentBody.id
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
        uri: alexaURI,
        headers: {
            'Authorization': 'Bearer ' + ayvaConfig.alexa.developerAccessToken
        },
        body: intentBody,
        json: true
    };
    console.log(intentBody.responses[0].parameters)
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

module.exports = uploadSpeechModelToAlexa