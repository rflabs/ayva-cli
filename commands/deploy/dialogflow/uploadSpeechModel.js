var rp = require('request-promise')
var dialogflowBaseURI = "https://api.dialogflow.com/v1"
var emptyIntentBody = require('./basicIntent')
var emptyEntityBody = require('./basicEntity')
var prompts = require('../../prompts')
var errorReported = false;
var Ayva = require('../../ayvaConfigProvider')



var uploadSpeechModelToDialogflow = function(ayvaConfig){
    getEntityModel(ayvaConfig.config).then( remoteEntityModel =>{
        ayvaConfig.speechModel.entities.map(entityConfig => {
            syncEntityWithDialogflow(ayvaConfig, entityConfig, remoteEntityModel)
        })
    }).catch(e => {return notConfiguredError(e)})

    getIntentModel(ayvaConfig.config).then( remoteIntentModel => {
        ayvaConfig.speechModel.intents.map( intentConfig => {
            syncIntentWithDialogflow(ayvaConfig, intentConfig, remoteIntentModel)
        })
    }).catch(e => {return notConfiguredError(e)})

}

var getEntityModel = function(ayvaConfig){
    return new Promise(function(resolve,reject){
        var options = {
            method: 'GET',
            uri: dialogflowBaseURI + "/entities",
            headers: {
                'Authorization': 'Bearer ' + ayvaConfig.dialogflow.developerAccessToken
            }
        };
    
        rp(options)
            .then(res => {
                res = JSON.parse(res)
                var model = {}
                res.map(slot => { model[slot.name] = slot.id})
                resolve(model);
            })
            .catch(e => {
                reject(e.error)
            })
    })
}

var getIntentModel = function(ayvaConfig){
    return new Promise(function(resolve,reject){
        var options = {
            method: 'GET',
            uri: dialogflowBaseURI + "/intents",
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
            .catch(e => {
                reject(e.error)
            })
    })
}

var syncEntityWithDialogflow = function(ayvaConfig, entityConfig, remoteEntityModel){
    
    var method = "POST"
    var dialogflowURI = dialogflowBaseURI + "/entities/";
    var entityBody = emptyEntityBody();
    entityBody.name = entityConfig.name

    if(remoteEntityModel[entityConfig.name]){
        entityBody.id = remoteEntityModel[entityConfig.name],
        method = "PUT"
        dialogflowURI += entityBody.id
    }

    entityConfig.values.map(e => {
        let value = e.name || e
        let synonyms = e.synonyms || []
        if(!synonyms.includes(value)) synonyms.push(value);
        entityBody.entries.push({value,synonyms})
    })

    var options = {
        method: method,
        uri: dialogflowURI,
        headers: {
            'Authorization': 'Bearer ' + ayvaConfig.config.dialogflow.developerAccessToken
        },
        body: entityBody,
        json: true
    };

    rp(options)
        .then(function (parsedBody) {
            console.log(prompts.formatAsMainText(`Successfully deployed entity to Google: ${entityBody.name}`))
        })
        .catch(function (err) {
            console.log(prompts.formatAsError(`Entity ${entityBody.name} failed to upload to Dialogflow`))
            console.log(err.error)
        });
}

var syncIntentWithDialogflow = function(ayvaConfig, intentConfig, remoteIntentModel){
    var method = "POST"
    var dialogflowURI = dialogflowBaseURI + "/intents/";
    var dialogflowIntent = emptyIntentBody();
    var intentBody = Object.assign({}, dialogflowIntent, {"name": intentConfig.name})
    intentBody.responses.unshift({"action": intentConfig.name, "parameters":[]})

    if(remoteIntentModel[intentConfig.name])
    {
        intentBody.id = remoteIntentModel[intentConfig.name]
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
        let slot = intentConfig.slots[s];
        intentConfig.slots[s] = {
            name: s,
            value: "$" + s,
            required: slot.required,
            prompts: slot.prompts || []
        }

        intentBody.responses[0].parameters.push(intentConfig.slots[s])
    }
    
    var options = {
        method: method,
        uri: dialogflowURI,
        headers: {
            'Authorization': 'Bearer ' + ayvaConfig.config.dialogflow.developerAccessToken
        },
        body: intentBody,
        json: true
    };
    rp(options)
        .then(function (parsedBody) {
            console.log(prompts.formatAsMainText(`Successfully deployed intent to Google: ${intentBody.name} `))
        })
        .catch(function (err) {
            console.log(prompts.formatAsError(`Intent ${intentBody.name} failed to upload to Dialogflow:`))
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

var notConfiguredError = function(e){
    if(!errorReported){
        errorReported = true;
        console.log(e)
        console.log(prompts.formatAsError("Ayva was unable to process the request. Make sure you have configured your dialoflow credentials using ayva init"))
    }
}

module.exports = uploadSpeechModelToDialogflow