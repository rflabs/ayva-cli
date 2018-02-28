var updateSpeechModelDF = require("./platforms/dialogflow/uploadSpeechModel"),
    updateSpeechModelAlexa = require("./platforms/alexa/uploadSpeechModel"),
    Ayva = require('./ayvaConfigProvider')

var updateSpeechModels = function(cmd){
    if(!Ayva) return;

    if(cmd.dialogflow || cmd.alexa){
        updateByFlags(cmd)
    } else {
        updateByConfig()
    }

}

var updateByFlags = function(cmd){
    if(cmd.dialogflow)
        updateSpeechModelDF()
    if(cmd.alexa)
        updateSpeechModelAlexa()
}

var updateByConfig = function(cmd){
    if(Ayva.hasAlexaConfiguration())
        updateSpeechModelAlexa()
    if(Ayva.hasDialogflowConfiguration())
        updateSpeechModelDF()
}

module.exports = updateSpeechModels;