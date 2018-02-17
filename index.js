#!/usr/bin/env node

var program = require('commander'),
    exec = require('child_process').exec,
    prompts = require('./prompts.js'),
    inquirer = require('inquirer'),
    path = require('path')
    updateSpeechModels = require("./uploadSpeechModelToDialogflow"),
    version = "0.0.1",
    gitCommand = "git clone https://github.com/rflabs/Personal-Voice-Inbox.git",
    ayvaConfigPath = path.join(process.env.PWD, "ayva.json");
    ayvaConfig = require(ayvaConfigPath),
    jsonFile = require('jsonfile')

var getRepo = function(req, optional) {
    console.log('cloning repo from git...')
    exec(gitCommand, "", function(err, data){
        inquirer.prompt(prompts.chooseYourOwnAdventure).then(function(answer) {
            console.log("\n")
            if (answer.platform === 'Google (Dialogflow)') {
                var dfClientId, dfDevAccessToken;
                inquirer.prompt(prompts.dfClientId).then(function(res) {
                    console.log(res)
                    ayvaConfig.dialogflow["clientId"] = res.dfClientId
                    inquirer.prompt(prompts.dfDevAccessToken).then(function(res) {
                        ayvaConfig.dialogflow["developerAccessToken"] = res.dfDevAccessToken;
                        console.log(ayvaConfig)
                        jsonFile.writeFileSync(ayvaConfigPath, ayvaConfig)
                    })
                })
            }
        })
    });
}

program
    .version(version)
    .command('start')
    .action(getRepo)

program
    .version(version)
    .command('deploy')
    .action(updateSpeechModels(ayvaConfig))

program.parse(process.argv)