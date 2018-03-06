var updateSpeechModelDF = require("./dialogflow/uploadSpeechModel"),
    updateSpeechModelAlexa = require("./alexa/uploadSpeechModel"),
    Ayva = require('../ayvaConfigProvider'),
    prompts = require('../prompts'),
    clear = require('clear'),
    figlet = require('figlet')

var updateSpeechModels = function(path, cmd){
    clear();
    var outputFormat = {
        font: 'Graffiti',
        horizontalLayout: 'full',
        verticalLayout: 'full'
    }

    figlet.text('Ayva', outputFormat, function(err, ascii) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(prompts.formatAsMainText(ascii));
        console.log("\n")
        if(!Ayva.existsAt(path))
            return console.log(prompts.formatAsError("This does not seem to be an Ayva project, try running ayva init or ayva create first"));

        var ayvaConfig = Ayva.loadConfig(path);

        if(cmd.dialogflow || cmd.alexa){
            updateByFlags(cmd, ayvaConfig)
        } else {
            updateByConfig(ayvaConfig)
        }
    })
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