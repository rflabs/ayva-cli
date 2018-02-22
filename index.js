#!/usr/bin/env node

var program = require('commander'),
    updateSpeechModels = require("./platforms/dialogflow/uploadSpeechModelToDialogflow"),
    tutorialSetup = require('./tutorialSetup'),
    runAndStartProxy = require('./runAndStartProxy'),
    createAyva = require('./createAyva'),
    version = "0.0.1"

program
    .version(version)

program
    .command('helloWorld')
    .action(tutorialSetup)

program
    .command('deploy', "Uploads language models to Dialogflow and Alexa")
    .action(updateSpeechModels)

program
    .command('run', "Starts local webhook proxy for use in AI platforms")
    .action(runAndStartProxy)

program
    .command('create', "Create a new ayva voice assitant app")
    .action(createAyva)

program.parse(process.argv)