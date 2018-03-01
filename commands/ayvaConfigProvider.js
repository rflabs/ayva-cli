var p = require('path'),
    jsonFile = require('jsonfile'),
    Empty = require('./empty.ayva.json'),
    scriptPath = p.join(process.env.PWD || process.cwd())
    
var loadConfig = function(path){
    path = getWorkingPath(path)

    var ayvaConfig = {};
    try{
        ayvaConfig.config = require(p.join(path, "ayva.json"))
    }catch (e) {
        ayvaConfig.config = Ayva.Empty
    }

    try{
        ayvaConfig.speechModel = require(p.join(path, ayvaConfig.config.pathToSpeechModel))
    } catch (e) {
    }
    return ayvaConfig
}

var existsAt = function(path){
    path = getWorkingPath(path)
    try{
        var config = require(p.join(path, "ayva.json"))
    } catch (e) {
        return false
    }
    return true
}

var saveConfig = function(path, config){
    path = getWorkingPath(path)
    jsonFile.writeFileSync(p.join(path, "ayva.json"), config);
}

var hasDialogflowConfiguration =  function(config){
    return !!(config.dialogflow && config.dialogflow.developerAccessToken != null)
}

var hasAlexaConfiguration = function(config){
    return !!(config.invocationPhrase && config.alexa && config.alexa.skillId)
}

var getWorkingPath = function(path){
    if(!path){
       return scriptPath
    } else {
        return p.join(scriptPath, path)
    }
}

var Ayva = {loadConfig, existsAt, saveConfig, Empty, hasAlexaConfiguration, hasDialogflowConfiguration}

module.exports = Ayva;
