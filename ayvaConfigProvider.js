var path = require('path')

var ayvaConfigProvider = function(overridePath){
    var configPath = path.join(process.env.PWD || process.cwd(), "/ayva.json")
    try{
        let config = require(configPath)
        return {
            configPath,
            config,
            hasDialogflowConfiguration: function(){
                return !!(config.dialogflow && config.dialogflow.developerAccessToken != null)
            },
            hasAlexaConfiguration: function(){
                return !!(config.invocationPhrase && config.alexa && config.alexa.skillId)
            },
            speechModel: require(path.join(process.env.PWD||process.cwd(), config.pathToSpeechModel)),
            overridePath: overridePath.bind(this)
        }
    }catch (e) {
        console.log("This does not appear to be an Ayva project. Run ayva init to initialize");
        return {
            overridePath: overridePath.bind(this)
        };
    }
}

module.exports = ayvaConfigProvider