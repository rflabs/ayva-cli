#!/usr/bin/env node

var program = require('commander'),
    exec = require('child_process').exec
    

var gitCommand = "git clone https://github.com/rflabs/Personal-Voice-Inbox.git"

var prompts = require('./prompts.js')

var inquirer = require('inquirer');

var getRepo = function(req, optional) {
    console.log('cloning repo from git...')
    exec(gitCommand, "", function(err, data){
        inquirer.prompt(prompts.chooseYourOwnAdventure).then(function(answers) {
            console.log(answers)
        })
    });
}

program
    .version('0.0.1')
    .command('start')
    .action(getRepo)

program.parse(process.argv)