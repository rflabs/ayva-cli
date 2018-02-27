var cloneHelloWorld = "git clone https://github.com/rflabs/ayva-helloWorld.git",
path = require('path'),
Ayva = require('./ayvaConfigProvider'),
jsonFile = require('jsonfile'),
exec = require('child_process').exec,
prompts = require('./prompts.js'),
inquirer = require('inquirer')

var walkthrough = function() {
    if(!Ayva) return;

    console.log('cloning repo from git...')
    exec(cloneHelloWorld, "", function(err, data){
        inquirer.prompt(prompts.chooseYourOwnAdventure)
        .then(function(answer) {
            console.log("\n")
            if (answer.platform === 'Google (Dialogflow)') {
                var dfClientId, dfDevAccessToken;
                inquirer.prompt(prompts.dfClientId)
                .then(function(res) {
                    Ayva.config.dialogflow["clientId"] = res.dfClientId
                    inquirer.prompt(prompts.dfDevAccessToken)
                    .then(function(res) {
                        Ayva.config.dialogflow["developerAccessToken"] = res.dfDevAccessToken;
                        jsonFile.writeFileSync(Ayva.configPath, Ayva.config)
                    })
                })
            }
        })
    });
}

module.exports = walkthrough;