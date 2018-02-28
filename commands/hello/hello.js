var Ayva = require('../ayvaConfigProvider');

var exec = require('child_process').exec,
prompts = require('../prompts'),
inquirer = require('inquirer'),
p = require('path');

var walkthrough = function(installPath) {
    var config = Ayva.Empty;
    var cloneHelloWorld = `git clone https://github.com/rflabs/ayva-helloWorld.git ${installPath}`;

    console.log('Cloning repo from git...')
    exec(cloneHelloWorld, "", function(err, data){
        if(err) return console.log("Folder already exists at the specified path. Try deleting or specifying another path")

        inquirer.prompt(prompts.chooseYourOwnAdventure)
        .then(function(input) {
            console.log("\n")
            if (input.platform === 'Google (Dialogflow)') {
                inquirer.prompt(prompts.dfDevAccessToken)
                .then(function(input) {
                    config.dialogflow["developerAccessToken"] = input.dfDevAccessToken;
                    Ayva.saveConfig(installPath, config)
                })
            }
        })
    });
}

module.exports = walkthrough;