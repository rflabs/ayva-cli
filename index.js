#!/usr/bin/env node

var version = "0.0.1",
    program = require('commander')


program
    .version(version)

program
    .command('helloWorld')
    .action((cmd) => {require('./tutorialSetup')(cmd)}) 

program
    .command('deploy')
    .option('-d, --dialogflow', 'Update Dialogflow V1 from Ayva Speech Model')
    .option('-a, --alexa', 'Update Alexa from Ayva Speech Model')
    .description('Uploads language models to Dialogflow and Alexa according to project\'s ayva.json configuration')
    .action((cmd) => {require('./updateSpeechModels')(cmd)}) 

program
    .command('run')
    .description('Starts local webhook proxy for use in AI platforms')
    .action((cmd) => {require('./runAndStartProxy')(cmd)}) 

program
    .command('create')
    .description( 'Create a new ayva voice assitant app')
    .action((cmd) => {require('./createAyva')(cmd)}) 

program.parse(process.argv)