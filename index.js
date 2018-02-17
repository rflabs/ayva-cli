#!/usr/bin/env node

var program = require('commander'),
    exec = require('child_process').exec
    
var gitCommand = "git clone https://github.com/rflabs/Personal-Voice-Inbox.git"

var prompts = require('./prompts.js')

var inquirer = require('inquirer');

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
    .version('0.0.1')
    .command('start')
    .action(getRepo)

program.parse(process.argv)