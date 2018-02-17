#!/usr/bin/env node

var program = require('commander'),
    updateSpeechModels = require("./platforms/dialogflow/uploadSpeechModelToDialogflow"),
    deleteIntents = require('./platforms/dialogflow/deleteDialogflowIntents')
    tutorialSetup = require('./tutorialSetup')
    version = "0.0.1",

program
    .version(version)
    .command('demo')
    .action(tutorialSetup)

program
    .version(version)
    .command('deploy')
    .action(updateSpeechModels)

program.parse(process.argv)