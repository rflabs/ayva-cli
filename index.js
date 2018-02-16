#!/usr/bin/env node

var program = require('commander'),
    exec = require('child_process').exec,
    Prompts = require('./prompts.js'),
    Enquirer = require('enquirer')

var gitCommand = "git clone https://github.com/rflabs/Personal-Voice-Inbox.git"
// enquirer.register('checkbox', require('prompt-checkbox'));
var enquirer = new Enquirer();
enquirer.register('checkbox', require('prompt-checkbox'));


var getRepo = function(req, optional) {
    console.log('cloning repo from git...')
    exec(gitCommand, "", function(err, data){
        getPlatform()
    });
}

var getPlatform = function(){
    enquirer.prompt(Prompts.chooseYourOwnAdventure)
    .then(function(data){
        switch (data){
            case "Google (Dialogflow)": console.log("Google");
            case "Alexa": console.log("Alexa")
            default : "Gather your courage and fulfill your destiny!"
        }
    })
    .catch(function(err){
        console.log("Error " + err)
    })
}
program
    .version('0.0.1')
    .command('start')
    .action(getRepo)

program.parse(process.argv)