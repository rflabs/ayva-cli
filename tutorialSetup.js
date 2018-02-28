var Ayva = require('./ayvaConfigProvider');

var cloneHelloWorld = "git clone https://github.com/rflabs/ayva-helloWorld.git",
exec = require('child_process').exec,
prompts = require('./prompts.js'),
inquirer = require('inquirer'),
config = {};

var walkthrough = function(a, b) {
    console.log(a, b)
    var installPath = cmd.something;
    config = Ayva.Empty;

    console.log('cloning repo from git...')
    exec(cloneHelloWorld, "", function(err, data){
        inquirer.prompt(prompts.chooseYourOwnAdventure)
        .then(function(input) {
            console.log("\n")
            if (input.platform === 'Google (Dialogflow)') {
                inquirer.prompt(prompts.dfDevAccessToken)
                .then(function(input) {
                    config.dialogflow["developerAccessToken"] = input.dfDevAccessToken;
                    // Ayva.saveConfig(installPath, config)
                })
            }
        })
    });
}

module.exports = walkthrough;