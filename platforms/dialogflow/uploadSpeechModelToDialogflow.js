var path = require('path'),
    ayvaConfigPath = path.join(process.env.PWD, "/Voice-Inbox/ayva.json"),
    rp = require('request-promise'),
    dialogflowAPIIntent = "https://api.dialogflow.com/v1/intents?v=20150910",
    dialogflowIntent = require('./basicIntent.json');

var uploadSpeechModelToDialogflow = function(){
    ayvaConfig = require(ayvaConfigPath)
    var speechModel = require(path.join(process.env.PWD, ayvaConfig.pathToSpeechModel))
    for (intent in speechModel.intents){
        syncIntentWithDialogflow(intent)
    }
}

var syncIntentWithDialogflow = function(intentConfig){
    var intent = Object.assign({}, dialogflowIntent, {"name": intentConfig.name})
    intent.actions.push(intentConfig.name)
    console.log(intent)
    var options = {
        method: 'POST',
        uri: dialogflowAPIIntent,
        headers: {
            'Authorization': 'Bearer ' + ayvaConfig.dialogflow.developerAccessToken
        },
        body: intent,
        json: true
    };
    
    // rp(options)
    //     .then(function (parsedBody) {
    //         console.log(parsedBody)
    //     })
    //     .catch(function (err) {
    //         console.log(err.error)
    //     });
}

module.exports = uploadSpeechModelToDialogflow