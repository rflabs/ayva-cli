var Ayva = require('./ayvaConfigProvider');

var inquirer = require('inquirer')
var prompts = require('./prompts')

var dialogflowSelection = function() {
    return new Promise(function(resolve, reject) {
        inquirer.prompt(prompts.dfDevAccessToken).then(function(res) {
            ayvaConfig.dialogflow["developerAccessToken"] = res.dfDevAccessToken;
            jsonFile.writeFileSync(ayvaConfigPath, ayvaConfig)
            console.log("\n")
            resolve()
        })
    })
}

var alexaSelection = function() {
    return new Promise(function(resolve, reject) {
        inquirer.prompt(prompts.alexaSkillId).then(function(res) {
            Ayva.config.alexa["skillId"] = res.alexaSkillId;
            inquirer.prompt(prompts.invocationPhrase).then(function(res) {
                ayvaConfig.invocationPhrase = res.invocationPhrase
                jsonFile.writeFileSync(ayvaConfigPath, ayvaConfig)
                console.log("\n")
                resolve()
            })
        })
    })
}

var init = function(){
    inquirer.prompt(prompts.choosePlatform)
    .then(function(answer) {
        console.log("\n")
        if (answer.platform[0] === 'Google (Dialogflow)' && answer.platform.length === 1) {
            dialogflowSelection()
        }
        if (answer.platform[0] === 'Alexa' && answer.platform.length === 1) {
            alexaSelection()
        }
        if (answer.platform.length > 1) {
            dialogflowSelection().then(function() {
                alexaSelection()
            })
        }
    })
}

module.exports = init