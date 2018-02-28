var p = require('path'),
    jsonFile = require('jsonfile'),
    Empty = require('./empty.ayva.json')
    scriptPath = p.join(process.env.PWD || process.cwd())
    
var loadConfig = function(path){
    path =  path || scriptPath

    try{
        console.log(p.join(path, "ayva.json"))
        let config = require(p.join(path, "ayva.json"))
        return {
            config,
            speechModel: require(p.join(path, config.pathToSpeechModel))
        }
    }catch (e) {
        return {
            config: Ayva.Empty
        }
    }
}

var existsAt = function(path){
    path =  path || scriptPath
    try{
        require(p.join(path, "ayva.json"))
    } catch (e) {
        return false
    }
    return true
}

var saveConfig = function(path, config){
    path =  path || scriptPath
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
