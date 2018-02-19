var path = require('path'),
rp = require('request-promise'),
dialogflowIntent = require('./basicIntent.json'),
dialogflowBaseURI = "https://api.dialogflow.com/v1/intents/",
ayvaConfigPath = path.join(process.env.PWD, "/ayva.json"),
ayvaConfig = {}

var uploadSpeechModelToDialogflow = function(){
    ayvaConfig = require(ayvaConfigPath)
    var speechModel = require(path.join(process.env.PWD, ayvaConfig.pathToSpeechModel))
    var dialogflowModel ={}
    getDialogflowModel()
        .then(function(res){
            dialogflowModel = res;
            for (i in speechModel.intents){
                syncIntentWithDialogflow(speechModel.intents[i], dialogflowModel)
            }
        })

}

var getDialogflowModel = function(){
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
    var intent = Object.assign({}, dialogflowIntent, {"name": intentConfig.name})
    intent.responses.push({"action":intentConfig.name})

    if(dialogflowModel[intentConfig.name])
    {
        intent.id = dialogflowModel[intentConfig.name]
        method = "PUT"
        dialogflowURI += intent.id
    }

    for (var u in intentConfig.utterances){
        intent.userSays.push({"data":[{"text": intentConfig.utterances[u]}]})
    }

    for (let i in intentConfig.events) {
        intent.events.push({"name":intentConfig.events[i]})
    }

    var options = {
        method: method,
        uri: dialogflowURI,
        headers: {
            'Authorization': 'Bearer ' + ayvaConfig.dialogflow.developerAccessToken
        },
        body: intent,
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