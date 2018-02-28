var p = require('path'),
    jsonFile = require('jsonfile'),
    Empty = require('./empty.ayva.json')
    scriptPath = p.join(process.env.PWD || process.cwd(), "/ayva.json")
    
var loadConfig = function(path){
    var configPath =  path || scriptPath

    try{
        let config = require(path)
        return {
            config,
            speechModel: require(path.join(configPath, config.pathToSpeechModel))
        }
    }catch (e) {
        console.log("This does not appear to be an Ayva project. Run ayva init to initialize");
    }
}

var saveConfig = function(path, config){
    path = path || scriptPath
    jsonFile.writeFileSync(path, config);
}

var hasDialogflowConfiguration =  function(config){
    return !!(config.dialogflow && config.dialogflow.developerAccessToken != null)
}

var hasAlexaConfiguration = function(config){
    return !!(config.invocationPhrase && config.alexa && config.alexa.skillId)
}

var Ayva = {loadConfig, saveConfig, Empty, hasAlexaConfiguration, hasDialogflowConfiguration}

module.exports = Ayva;
