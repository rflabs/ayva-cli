var path = require('path')
console.log(process.cwd())
var ayvaConfigPath = path.join(process.env.PWD || process.cwd(), "/ayva.json")
var getAlexaLanguageModel = require('./alexaLanguageModel')
var askUpdateModel = require('./ask-commands/updateModel')
var _ = require('lodash')

var ayvaConfig = {};

var uploadSpeechModelToAlexa = function(){
    ayvaConfig = require(ayvaConfigPath)
    var ayvaSpeechModel = require(path.join(process.env.PWD||process.cwd(), ayvaConfig.pathToSpeechModel))
    writeAlexaModelToFile(ayvaConfig, ayvaSpeechModel)
        .then((res) => console.log(res))
        // .then((res) => {askUpdateModel(intentConfig)})
        .catch((err) => console.log(`Error writing Alexa speech model: ${err}`))
}

var formatAsSaying = function(unformattedPhrase, formattedPhrase = ""){
    console.log(unformattedPhrase,formattedPhrase);
    let slotBegin = unformattedPhrase.indexOf("{");
    if(slotBegin == -1 || unformattedPhrase.length ==0)
        return formattedPhrase + unformattedPhrase
   
    if(slotBegin != 0){
        formattedPhrase += unformattedPhrase.substring(0,slotBegin);
        formatAsSaying(unformattedPhrase.substring(slotBegin))
    } else {
        var slotEnd = unformattedPhrase.indexOf('}');
        var slotFromUtterance = JSON.parse(unformattedPhrase.substring(0, slotEnd+1))
        var slotName = Object.keys(slotFromUtterance)[0]
        console.log(slotName)
        formattedPhrase += `{${slotName}}`
        formatAsSaying(unformattedPhrase.substring(slotEnd+1), formattedPhrase)
    }
}

var writeAlexaModelToFile = function(ayvaConfig, ayvaSpeechModel){
    return new Promise((resolve, reject) => {
        var alm = getAlexaLanguageModel()
        alm.languageModel.invocationName = ayvaConfig.invocationName;
        console.log(ayvaSpeechModel)
        ayvaSpeechModel.intents.map((intent) => {
            var alexaFormattedIntent = {"name": intent.name, "slots":[], "samples": []}
            addSlotsToModel(intent.slots, alexaFormattedIntent)
            addSayingsToModel(intent.utterances, alexaFormattedIntent)

        })
    })
}

var addSlotsToModel = function(slots, alexaFormattedIntent){
    if(!slots) return;

    Object.keys(slots).map((slotName) => {
        console.log(slotName)
        alexaFormattedIntent.slots.push({"name":slotName,"type":slots[slotName].dataType_alexa})
    })
}

var addSayingsToModel = function(phrases, alexaFormattedIntent){
    phrases.map((phrase) => {
        alexaFormattedIntent.samples.push(formatAsSaying(phrase))
    })
}

module.exports = uploadSpeechModelToAlexa