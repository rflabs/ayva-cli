var path = require('path')
var getAlexaLanguageModel = require('./alexaLanguageModel')
var askUpdateModel = require('./ask-commands/updateModel')
var jsonFile = require('jsonfile')
var prompts = require('../../prompts')
var _ = require('lodash')

var Ayva = require('../../ayvaConfigProvider')

var uploadSpeechModelToAlexa = function(ayvaConfig){
    writeAlexaModelToFile(ayvaConfig.config, ayvaConfig.speechModel)
        .then((res) => askUpdateModel(ayvaConfig))
        .catch((err) => {console.log(prompts.formatAsError(`Error writing Alexa speech model:`)); console.log(err)})
}

var writeAlexaModelToFile = function(ayvaConfig, ayvaSpeechModel){
    return new Promise((resolve, reject) => {
        var alm = getAlexaLanguageModel()
        alm.interactionModel.languageModel.invocationName = ayvaConfig.invocationPhrase;
        ayvaSpeechModel.entities.map(entity => {
            let values = []

            entity.values.map(e => {
                let value = e.name || e
                let synonyms = e.synonyms || []
                if(!synonyms.includes(value)) synonyms.push(value);
                values.push({id:"",name:{value,synonyms}})
            })
        
            alm.interactionModel.languageModel.types.push({
                name: entity.name,
                values
            })
        })
        ayvaSpeechModel.intents.map(intent => {
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
        alexaFormattedIntent.slots.push({"name":slotName,"type":Ayva.dataTypeForPlatform(slots[slotName].dataType,"alexa")})
    })
}

var addSayingsToModel = function(phrases, alexaFormattedIntent){
    if(!phrases) return;
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