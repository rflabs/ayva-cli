#!/usr/bin/env node

var program = require('commander'),
    updateSpeechModels = require("./platforms/dialogflow/uploadSpeechModelToDialogflow"),
    tutorialSetup = require('./tutorialSetup'),
    startProxy = require('./startProxy'),
    version = "0.0.1"

program
    .version(version)
    .command('demo')
    .action(tutorialSetup)

program
    .version(version)
    .command('deploy')
    .action(updateSpeechModels)

program
    .version(version)
    .command('start')
    .action(startProxy)

program.parse(process.argv)