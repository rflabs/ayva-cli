#!/usr/bin/env node

var program = require('commander'),
    exec = require('child_process').exec,
    prompts = require('./prompts.js'),
    inquirer = require('inquirer'),
    updateSpeechModels = require("./uploadSpeechModelToDialogflow"),
    version = "0.0.1",
    gitCommand = "git clone https://github.com/rflabs/Personal-Voice-Inbox.git"

var getRepo = function(req, optional) {
    console.log('cloning repo from git...')
    exec(gitCommand, "", function(err, data){
        inquirer.prompt(prompts.chooseYourOwnAdventure).then(function(answer) {
            console.log("\n")
            if (answer.platform === 'Google (Dialogflow)') {
                inquirer.prompt(prompts.dfClientId).then(function(answer) {
                    console.log("\n")
                    inquirer.prompt(prompts.dfDevAccessToken).then(function(answer) {
                        console.log("\n")
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
    .action(updateSpeechModels)

program.parse(process.argv)