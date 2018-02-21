#!/usr/bin/env node

var program = require('commander'),
    updateSpeechModelDF = require("./platforms/dialogflow/uploadSpeechModel"),
    tutorialSetup = require('./tutorialSetup'),
    runAndStartProxy = require('./runAndStartProxy'),
    createAyva = require('./createAyva'),
    version = "0.0.1"

program
    .version(version)
    .command('helloWorld')
    .action(tutorialSetup)

program
    .version(version)
    .command('deploy')
    .action(updateSpeechModelDF)

program
    .version(version)
    .command('run')
    .action(runAndStartProxy)

program
    .version(version)
    .command('create')
    .action(createAyva)

program.parse(process.argv)