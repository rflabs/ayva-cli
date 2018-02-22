var path = require('path')
var ayvaConfigPath = path.join(process.env.PWD, "/ayva.json")
var getAlexaLanguageModel = require('./alexaLanguageModel')
var askUpdateModel = require('./ask-commands/updateModel')
var _ = require('lodash')

var ayvaConfig = {};

var uploadSpeechModelToAlexa = function(){
    ayvaConfig = require(ayvaConfigPath)
    console.log(process.env.PWD,ayvaConfig)
    var ayvaSpeechModel = require(path.join(process.env.PWD, ayvaConfig.pathToSpeechModel))
    writeAlexaModelToFile(ayvaConfig, ayvaSpeechModel)
    .then((res) => console.log(res))
    // .then((res) => {askUpdateModel(intentConfig)})
    .catch((err) => console.log(`Error writing Alexa speech model: ${err}`))
}

var formatAsSaying = function(unformattedPhrase, formattedPhrase = ""){
    let slotBegin = unformattedPhrase.indexOf("{");
    if(slotBegin == -1 || unformattedPhrase.length ==0)
        return formattedPhrase + unformattedPhrase
   
    if(slotBegin != 0){
        formattedPhrase += unformattedPhrase.substring(0,slotBegin);
        formatAsSaying(unformattedPhrase.substring)
    } else {
        var slotEnd = utterance.indexOf('}');
        var slotFromUtterance = JSON.parse(utterance.substring(0, slotEnd+1))
        var slotName = Object.keys(slotFromUtterance)[0]
        formattedPhrase += `{${slotName}}`
        formatAsSaying(unformattedPhrase.substring(slotEnd+1), formattedPhrase)
    }
}

var writeAlexaModelToFile = function(ayvaConfig, ayvaSpeechModel){
    return new Promise((resolve, reject) => {
        var alm = getAlexaLanguageModel()
        alm.languageModel.invocationName = ayvaConfig.invocationName;
        ayvaSpeechModel.intents.map((intent) => {
            var alexaFormattedIntent = {"name": intent.name, "slots":[], "samples": []}
            addSlotsToModel(intent.slots, alexaFormattedIntent)
            addSayingsToModel(intent.utterances, alexaFormattedIntent)

        })
    })
}

var addSlotsToModel = function(slots, alexaFormattedIntent){
    slots.map((slot) => {
        alexaFormattedIntent.slots.push({"name":slot.name,"type":slot.dataType_alexa})
    })
}

var addSayingsToModel = function(phrases, alexaFormattedIntent){
    phrases.map((phrase) => {
        alexaFormattedIntent.samples.push(formatAsSaying(phrase))
    })
}

module.exports = uploadSpeechModelToAlexa