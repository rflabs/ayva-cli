var p = require('path'),
    jsonFile = require('jsonfile'),
    Empty = require('./empty.ayva.json'),
    scriptPath = p.join(process.env.PWD || process.cwd()),
    fs = require('fs')
    
var loadConfig = function(path){
    if(!path){
        path = scriptPath
    } else {
        path = p.join(scriptPath, path)
    }
    var ayvaConfig = {};
    try{
        ayvaConfig.config = require(p.join(path, "ayva.json"))
    }catch (e) {
        ayvaConfig.config = Ayva.Empty
    }
    
    try{
        ayvaConfig.speechModel = require(p.join(path, ayvaConfig.config.pathToSpeechModel))
    } catch (e) {
         fs.writeFileSync(p.join(path, ayvaConfig.config.pathToSpeechModel), "")
    }
    return ayvaConfig
}

var existsAt = function(path){
    if(!path){
        path = scriptPath
    } else {
        path = p.join(scriptPath, path)
    }
    try{
        var config = require(p.join(path, "ayva.json"))
        require(p.join(path, config.pathToSpeechModel))
    } catch (e) {
        return false
    }
    return true
}

var saveConfig = function(path, config){
    if(!path){
        path = scriptPath
    } else {
        path = p.join(scriptPath, path)
    }
    jsonFile.writeFileSync(p.join(path, "ayva.json"), config);
}

var hasDialogflowConfiguration =  function(config){
    return !!(config.dialogflow && config.dialogflow.developerAccessToken != null)
}

var hasAlexaConfiguration = function(config){
    return !!(config.invocationPhrase && config.alexa && config.alexa.skillId)
}

var Ayva = {loadConfig, existsAt, saveConfig, Empty, hasAlexaConfiguration, hasDialogflowConfiguration}

module.exports = Ayva;
