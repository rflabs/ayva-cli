var Ayva = require('../ayvaConfigProvider');

var inquirer = require('inquirer')
var prompts = require('../prompts')
var fs = require('fs')
var p = require('path')

var dialogflowSelection = function(ayvaConfigPath, ayvaConfig) { 
    return new Promise(function(resolve, reject) {
        inquirer.prompt(prompts.dfDevAccessToken).then(function(res) {
            ayvaConfig.dialogflow["developerAccessToken"] = res.dfDevAccessToken;
            Ayva.saveConfig(ayvaConfigPath,ayvaConfig)            
            resolve(ayvaConfig)
        })
    })
}

var alexaSelection = function(ayvaConfigPath, ayvaConfig) {
    return new Promise(function(resolve, reject) {
        inquirer.prompt(prompts.alexaSkillId).then(function(res) {
            ayvaConfig.alexa["skillId"] = res.alexaSkillId;
            Ayva.saveConfig(ayvaConfigPath, ayvaConfig)
            resolve()
        })
    })
}

var init = function(ayvaConfigPath){
    if(!Ayva.existsAt(ayvaConfigPath))
        Ayva.saveConfig(ayvaConfigPath, Ayva.Empty)
    
    var ayvaConfig = Ayva.loadConfig(ayvaConfigPath).config

    if(!fs.existsSync(p.join(ayvaConfigPath|| "", ayvaConfig.pathToSpeechModel)))
        fs.writeFileSync(p.join(ayvaConfigPath|| "", ayvaConfig.pathToSpeechModel), "")

    inquirer.prompt(prompts.choosePlatform)
    .then(function(answer) {
        answer.platform === 'Google (Dialogflow)' && dialogflowSelection(ayvaConfigPath, ayvaConfig) 
        answer.platform === 'Alexa' && alexaSelection(ayvaConfigPath, ayvaConfig)     
    })
}


module.exports = init