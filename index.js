#!/usr/bin/env node

var program = require('commander'),
tutorialSetup = require('./tutorialSetup'),
runAndStartProxy = require('./runAndStartProxy'),
createAyva = require('./createAyva'),
updateSpeechModels = require('./updateSpeechModels'),
version = "0.0.1"

program
    .version(version)

program
    .command('helloWorld')
    .action(tutorialSetup)

program
    .command('deploy')
    .option('-d, --dialogflow', 'Update Dialogflow V1 from Ayva Speech Model')
    .option('-a, --alexa', 'Update Alexa from Ayva Speech Model')
    .description('Uploads language models to Dialogflow and Alexa according to project\'s ayva.json configuration')
    .action(updateSpeechModels)

program
    .command('run')
    .description('Starts local webhook proxy for use in AI platforms')
    .action(runAndStartProxy)

program
    .command('create')
    .description( 'Create a new ayva voice assitant app')
    .action(createAyva)

program.parse(process.argv)