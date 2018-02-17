var gitCommand = "git clone https://github.com/rflabs/ayva-helloWorld.git",
path = require('path'),
ayvaConfigPath = path.join(process.env.PWD, "/ayva-helloWorld/ayva.json"),
ayvaConfig = require(path.join(__dirname,'/empty.ayva.json'))
jsonFile = require('jsonfile'),
exec = require('child_process').exec,
prompts = require('./prompts.js'),
inquirer = require('inquirer')

var walkthrough = function(req, optional) {
    console.log('cloning repo from git...')
    exec(gitCommand, "", function(err, data){
        inquirer.prompt(prompts.choosePlatform).then(function(answer) {
            console.log("\n")
            if (answer.platform === 'Google (Dialogflow)') {
                var dfClientId, dfDevAccessToken;
                inquirer.prompt(prompts.dfClientId).then(function(res) {
                    ayvaConfig.dialogflow["clientId"] = res.dfClientId
                    inquirer.prompt(prompts.dfDevAccessToken).then(function(res) {
                        ayvaConfig.dialogflow["developerAccessToken"] = res.dfDevAccessToken;
                        jsonFile.writeFileSync(ayvaConfigPath, ayvaConfig)
                    })
                })
            }
        })
    });
}

module.exports = walkthrough;