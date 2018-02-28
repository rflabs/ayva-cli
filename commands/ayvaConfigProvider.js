var p = require('path'),
    jsonFile = require('jsonfile'),
    Empty = require('./empty.ayva.json')
    scriptPath = p.join(process.env.PWD || process.cwd())
    
var loadConfig = function(path){
    path =  path || scriptPath

    try{
        let config = require(p.join(scriptPath,path, "ayva.json"))
        return {
            config,
            speechModel: require(p.join(scriptPath, path, config.pathToSpeechModel))
        }
    }catch (e) {
        console.log("This does not appear to be an Ayva project. Run ayva init to initialize");
    }
}


var loadOrCreate = function(path){
    path =  path || scriptPath
    try{
        let config = require(p.join(scriptPath, path, "ayva.json"))
        return {
            config,
            speechModel: require(p.join(scriptPath, path, config.pathToSpeechModel))
        }
    }catch (e) {
        return {config: Ayva.Empty}
    }
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

var Ayva = {loadConfig, loadOrCreate, saveConfig, Empty, hasAlexaConfiguration, hasDialogflowConfiguration}

module.exports = Ayva;
