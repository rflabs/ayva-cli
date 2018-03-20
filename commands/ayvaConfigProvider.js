var p = require('path'),
    jsonFile = require('jsonfile'),
    Empty = require('./empty.ayva.json'),
    scriptPath = p.join(process.env.PWD || process.cwd()),
    findFiles = require('recursive-readdir')

//Currently returns empty if there is an error. Should consider refactor
var loadConfig = function(path){
    return new Promise( (resolve, reject) => {
        path = getWorkingPath(path)

        var ayvaConfig = {speechModel: {intents: [], entities: []}};
        try{
            ayvaConfig.config = require(p.join(path, "ayva.json"))
        }catch (e) {
            ayvaConfig.config = Ayva.Empty
        }
        //Package up the intents and entities in the SpeechModel folder
        findFiles(p.join(path, ayvaConfig.config.pathToSpeechModel, "/Intents"), function(e, files){
            if(e || !files) return resolve(ayvaConfig) //Return empty if new
            files.map(f => {
                var intent = require(f)
                valid(intent) && ayvaConfig.speechModel.intents.push(intent)
            })
            findFiles(p.join(path, ayvaConfig.config.pathToSpeechModel, "/Entities"), function(e, files){
                if(e || !files) return resolve(ayvaConfig)
                files.map(f => {
                    var entity = require(f);
                    valid(entity) && ayvaConfig.speechModel.entities.push(entity);
                })
                resolve(ayvaConfig)
            })
        })
    })
}

var dataTypeForPlatform = function(dataTypes, platform){
    var typeForPlatform = dataTypes.map(dT => {
        var df = dT.match("@sys.")
        var alexa = dT.match("AMAZON.")

        if(df && df.index==0) return dT //Hit for dialogflow
        else if(alexa && alexa.index==0) return dT //Hit for alexa
        else return dT; //Hit custom
    })

    if(!dataType || dataType.length == 0 || dataType.length > 2)
        throw Error("InvalidSlotType")
    else
        return typeForPlatform[0]

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

var valid = function(item){
    return !!(item.name)
}


var Ayva = {loadConfig, existsAt, saveConfig, Empty, hasAlexaConfiguration, hasDialogflowConfiguration, dataTypeForPlatform}

module.exports = Ayva;
