var path = require('path')
var ayvaConfigPath = path.join(process.env.PWD || process.cwd(), "/ayva.json")
var getAlexaLanguageModel = require('./alexaLanguageModel')
var askUpdateModel = require('./ask-commands/updateModel')
var jsonFile = require('jsonfile')
var _ = require('lodash')

var ayvaConfig = {};

var uploadSpeechModelToAlexa = function(){
    ayvaConfig = require(ayvaConfigPath)
    var ayvaSpeechModel = require(path.join(process.env.PWD||process.cwd(), ayvaConfig.pathToSpeechModel))
    writeAlexaModelToFile(ayvaConfig, ayvaSpeechModel)
        .then((res) => askUpdateModel(ayvaConfig))
        .catch((err) => console.log(`Error writing Alexa speech model: ${err}`))
}

var writeAlexaModelToFile = function(ayvaConfig, ayvaSpeechModel){
    return new Promise((resolve, reject) => {
        var alm = getAlexaLanguageModel()
        alm.interactionModel.languageModel.invocationName = ayvaConfig.invocationPhrase;
        ayvaSpeechModel.intents.map((intent) => {
            var alexaFormattedIntent = {"name": intent.name, "slots":[], "samples": []}
            addSlotsToModel(intent.slots, alexaFormattedIntent)
            addSayingsToModel(intent.utterances, alexaFormattedIntent)
            alm.interactionModel.languageModel.intents.push(alexaFormattedIntent)
        })
        resolve(jsonFile.writeFileSync('./en-US.json', alm))
    })
}

var addSlotsToModel = function(slots, alexaFormattedIntent){
    if(!slots) return;
    Object.keys(slots).map((slotName) => {
        alexaFormattedIntent.slots.push({"name":slotName,"type":slots[slotName].dataType_alexa})
    })
}

var addSayingsToModel = function(phrases, alexaFormattedIntent){
    phrases.map((phrase) => {
        phrase = phrase.replace(/'/g, '"')
        alexaFormattedIntent.samples.push(formatAsSaying(phrase))
    })
}

var formatAsSaying = function(unformattedPhrase, formattedPhrase = ""){
    let slotBegin = unformattedPhrase.indexOf("{");

    if(slotBegin == -1 || unformattedPhrase.length == 0)
        return formattedPhrase + unformattedPhrase
   
    if(slotBegin != 0){
        formattedPhrase += unformattedPhrase.substring(0,slotBegin);
        return formatAsSaying(unformattedPhrase.substring(slotBegin), formattedPhrase)
    } else {
        var slotEnd = unformattedPhrase.indexOf('}');
        var slotFromUtterance = JSON.parse(unformattedPhrase.substring(0, slotEnd+1))
        var slotName = Object.keys(slotFromUtterance)[0]
        formattedPhrase += '{' + slotName + '}'
        return formatAsSaying(unformattedPhrase.substring(slotEnd+1), formattedPhrase)
    }
}

module.exports = uploadSpeechModelToAlexa