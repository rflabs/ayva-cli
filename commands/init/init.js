var Ayva = require('../ayvaConfigProvider');

var inquirer = require('inquirer')
var prompts = require('../prompts')

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
    console.log(ayvaConfig)
    return new Promise(function(resolve, reject) {
        inquirer.prompt(prompts.alexaSkillId).then(function(res) {
            ayvaConfig.alexa["skillId"] = res.alexaSkillId;
            inquirer.prompt(prompts.invocationPhrase).then(function(res) {
                ayvaConfig.invocationPhrase = res.invocationPhrase
                Ayva.saveConfig(ayvaConfigPath, ayvaConfig)
                resolve()
            })
        })
    })
}

var init = function(ayvaConfigPath){
    var ayvaConfig = Ayva.loadOrCreate(ayvaConfigPath).config
    inquirer.prompt(prompts.choosePlatform)
    .then(function(answer) {
        console.log("\n")
        if (answer.platform[0] === 'Google (Dialogflow)' && answer.platform.length === 1) {
            dialogflowSelection(ayvaConfigPath, ayvaConfig)
        }
        if (answer.platform[0] === 'Alexa' && answer.platform.length === 1) {
            alexaSelection(ayvaConfigPath, ayvaConfig)
        }
        if (answer.platform.length > 1) {
            dialogflowSelection(ayvaConfigPath, ayvaConfig).then(function() {
                alexaSelection(ayvaConfigPath, ayvaConfig)
            })
        }
    })
}


module.exports = init