var p = require('path'),
    jsonFile = require('jsonfile'),
    exec = require('child_process').exec,
    prompts = require('../prompts.js'),
    inquirer = require('inquirer'),
    init = require('../init/init'),
    Ayva = require('../ayvaConfigProvider')

// UX
var clear = require('clear'),
    figlet = require('figlet'),
    chalk = require('chalk')


var walkthrough = function(installPath) {
    clear();
    var outputFormat = {
        font: 'Graffiti',
        horizontalLayout: 'full',
        verticalLayout: 'full'
    }

    figlet.text('Ayva', outputFormat, function(err, ascii) {
        if (err) {
            console.log(prompts.formatAsError(err));
            return;
        }
        console.log(prompts.formatAsMainText(ascii));
        console.log("\n")

        if(!installPath) 
            return console.log(prompts.formatAsError("Project name undefined. Please provide a project name using the syntax ayva create projectName or ayva create /path/to/projectName"))
        
        let cloneHelloWorld = `git clone --depth=1 https://github.com/rflabs/ayva-helloWorld.git ${installPath} && rm -rf ${installPath}/.git`; //Don't use original repo
        
        //Auto generate "project name" from end of supplied path, and use it as invocation phrase
        Ayva.loadConfig(installPath).then(c => {
            let ayvaConfig = c.config;
            let pathSplit = installPath.split(p.sep)
            ayvaConfig.invocationPhrase = pathSplit[pathSplit.length-1]

            exec(cloneHelloWorld, "", function(err, data){
                if(err) return console.log(prompts.formatAsError("Create failed: Folder already exists at the specified path. Try deleting or specifying another path"))
                Ayva.saveConfig(installPath, ayvaConfig)
                init(installPath)
            })
        })
    })
}

module.exports = walkthrough;