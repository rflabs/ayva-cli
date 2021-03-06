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
    
    Ayva.loadConfig(ayvaConfigPath).then(c => {
        let ayvaConfig = c.config;

        if(!fs.existsSync(p.join(ayvaConfigPath|| "", ayvaConfig.pathToSpeechModel))){
            fs.mkdirSync(p.join(ayvaConfigPath|| "", ayvaConfig.pathToSpeechModel))
            fs.mkdirSync(p.join(ayvaConfigPath || "", ayvaConfig.pathToSpeechModel,"/Intents"))
        }
        //This takes care of the empty Entity folder issue in git
        if(!fs.existsSync(p.join(ayvaConfigPath || "", ayvaConfig.pathToSpeechModel,"/Entities")))
            fs.mkdirSync(p.join(ayvaConfigPath || "", ayvaConfig.pathToSpeechModel,"/Entities"))
        
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
    })
}


module.exports = init