var updateSpeechModelDF = require("./dialogflow/uploadSpeechModel"),
    updateSpeechModelAlexa = require("./alexa/uploadSpeechModel"),
    Ayva = require('../ayvaConfigProvider')

var updateSpeechModels = function(path, cmd){
    if(!Ayva.existsAt(path))
        return console.log("This does not seem to be an Ayva project, try running ayva init or ayva create first");

    var ayvaConfig = Ayva.loadConfig(path);

    if(cmd.dialogflow || cmd.alexa){
        updateByFlags(cmd, ayvaConfig)
    } else {
        updateByConfig(ayvaConfig)
    }
}

var updateByFlags = function(cmd, ayvaConfig){
    if(cmd.dialogflow)
        updateSpeechModelDF(ayvaConfig)
    if(cmd.alexa)
        updateSpeechModelAlexa(ayvaConfig)
}

var updateByConfig = function(ayvaConfig){
    if(Ayva.hasAlexaConfiguration(ayvaConfig.config))
        updateSpeechModelAlexa(ayvaConfig)
    if(Ayva.hasDialogflowConfiguration(ayvaConfig.config))
        updateSpeechModelDF(ayvaConfig)
}

module.exports = updateSpeechModels; 