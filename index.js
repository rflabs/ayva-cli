#!/usr/bin/env node

var version = "0.0.1",
    program = require('commander'),
    executed = false

program
    .version(version)

program
    .command('hello [path]')
    .description('Start here if you\'re following the Ayva Hello World walkthrough')
    .action((cmd) => {require('./commands/hello/hello')(cmd)}) 

program
    .command('deploy [path]')
    .option('-d, --dialogflow', 'Update Dialogflow V1 from Ayva Speech Model')
    .option('-a, --alexa', 'Update Alexa from Ayva Speech Model')
    .description('Upload language models to Dialogflow and Alexa')
    .action((a,b,c) => {require('./commands/deploy/updateSpeechModels')(a,b)}) 

program
    .command('run [path]')
    .description('Start a proxy to test local applications')
    .action((cmd) => {require('./commands/run/runAndStartProxy')(cmd)}) 

program
    .command('create [path]')
    .description('Create a new Ayva project')
    .action((cmd) => {require('./commands/create/create')(cmd)})

program
    .command('init [path]')
    .description('Configure Ayva inside an existing project or add another voice platform')
    .action((cmd) => {require('./commands/init/init')(cmd)})

program.parse(process.argv)


/////////////
//Error Cases
////////////

//No 'ayva' command
program.args.length == 0 && program.help()

//Help if not a command
program.args.filter((s) =>{return typeof s === 'object' }).length == 0 && program.help()
